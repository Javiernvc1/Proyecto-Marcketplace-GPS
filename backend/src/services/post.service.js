"use strict"

import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";

import { PORT, HOST } from "../config/configEnv.js";
import { handleError } from "../utils/errorHandler.js";
import { saveImagePost } from "../utils/generalUtils.js";

async function getPosts() {
    try {
        const posts = await Post.find()
            .populate({
                path: 'author',
                select: '_id name'
            })
            .populate({
                path: 'category',
                select: '_id nameCategory'
            })
        if (!posts) {
            return [null, "No se encontraron publicaciones"];
        }

        const publicationData = posts.map(post => ({
            ...post.toObject(),
            images: post.images.map(imageName => `${HOST}${PORT}/uploads/images/${imageName}`),
        }));

        return [publicationData, null];

    } catch (error) {
        handleError(error, "post.service -> getPosts");
        return [null, error.message];
    }
}

async function createPost(post, files = []) {
    try {
        const { title, description, author, category } = post;

        const userExists = await User.findOne({ _id: author })
        if (!userExists) return [null, "El autor no existe"];

        const categoryExists = await Category.findOne({ _id: category });
        if (!categoryExists) return [null, "La categoría no existe"];

        const fileNames = await Promise.all(
            files.map( file => saveImagePost(file) )
        );

        const newPost = new Post({
            title,
            description,
            images: fileNames,
            author,
            category
        });
        await newPost.save();

        return [newPost, null];
    } catch (error) {
        handleError(error, "post.service -> createPost");
        return [null, error.message];
    }
}

async function getPostById(id) {
    try {
        const post = await Post.findById({ _id: id })
            .populate({
                path: 'author',
                select: '_id name'
            })
        
        if (!post) return [null, "La publicación no existe"];

        const publicationData = {
            ...post.toObject(),
            images: post.images.map(imageName => `${HOST}${PORT}/uploads/images/${imageName}`),
        };

        return [publicationData, null];
    }catch (error) {
        handleError(error, "post.service -> getPostById");
        return [null, error.message];
    }
}

async function getUserPosts(id) {
    try {
        const user = await User.findById(id)
            .select("-password")
            .populate("roleUser")
            .exec()

        if (!user) return [null, "No se encontró usuario"];

        const posts = await Post.find({ author: user._id })
            .populate({ path: "author", select: "_id name" })
            .populate({ path: "category", select: "_id nameCategory" })
            .exec();

        if (!posts.length) return [null, "No se encontraron publicaciones"];

        const publicationData = posts.map(post => ({
            ...post.toObject(),
            images: post.images.map(imageName => `${HOST}${PORT}/uploads/images/${imageName}`),
        }));

        return [publicationData, null];

    } catch (error) {
        handleError(error, "post.service -> getUserPosts");
        return [null, "Error al obtener publicaciones del usuario"];
    }
}

async function updatePost(id, body) {
    try {
        const post = await Post.findById(id);
        if(!post) return [null, `No se encontro la publicacion de id: ${id}`];
        const { title, description, category, status } = body;
        const postUpdated = await Post.findByIdAndUpdate(
            id,
            { title, description, category, status },
            { new: true }
        );
        return [postUpdated, null];
    } catch (error) {
        handleError(error, "post.service -> updatePost");
    }
}

async function deletePost(id){
    try {
        const postDeleted = await Post.findByIdAndDelete(id);
        if(!postDeleted) return [null, `No se encontro publicacion de id: ${id}`];
        await User.updateOne(
            { _id: postDeleted.author },
            { $pull: { posts: id } }
        );
        return [postDeleted, null];
    } catch (error) {
        handleError(error, "post.service -> deletePost");
    }
}

async function savePostAsFavorite(userId, postId){
    try {
        const userFound = await User.findById(userId);
        if(!userFound) return [null, 'Usuario no encontrado'];
        
        const postFound = await Post.findById(postId);
        if(!postFound) return [null, 'Publicacion no encontrada'];

        // Verificar si el post ya está guardado como favorito por el usuario
        const isSaved = userFound.favorites.includes(postId);

        if (isSaved) {
            // Si ya está guardado, quitarlo de los favoritos
            console.log("Ya la tenia guardado, se quito de favoritos");
            userFound.favorites = userFound.favorites.filter(favorites => favorites.toString() !== postId);
        } else {
            // Si no está guardado, añadirlo a los favoritos
            console.log("No lo tenia guardado, se agrego a favoritos");
            userFound.favorites.push(postFound.id);
        }
        await userFound.save();
        return [userFound, null];

    } catch (error) {
        handleError(error, "post.service -> savePostAsFavorite");
        return [null, error.message];
    }
}

async function getPostsByCategory( categoryId ){
    try {
        const categoryFound = await Category.findById(categoryId);
        if(!categoryFound) return [null, `No se encontro categoria de id: ${categoryId}`];

        const posts = await Post.find({ category: hashtagId })
            .populate( { path: 'author', select: "_id name"})
            .populate( { path: 'category', select: "_id nameCategory"})

        if(!posts) return [null, "No se encontraron posts que contengan esa categoria"];

        const publicationData = posts.map(post => ({
            ...post.toObject(),
            images: post.images.map(imageName => `${HOST}${PORT}/uploads/images/${imageName}`),
        }));
        

        return [{ posts: publicationData, category: categoryFound }, null];
    } catch (error) {
        console.log("Error en post.service-> getPostByCategory", error);
    }
}

async function getUserFavoritePosts(userId){
    try {
        const user = await User.findById(userId).populate({
            path: 'savedPosts',
            populate: [{
                path: 'author',
                select: '_id name'
            },{
                path: 'category',
                select: '_id category'
            }]
        });
        if (!user) return [null, `No se encontró el usuario con id: ${userId}`];

        const favoritePosts = user.savedPosts.map(post => ({
            ...post.toObject(),
            images: post.images.map(imageName => `${HOST}${PORT}/uploads/images/${imageName}`)
        }));

        return [favoritePosts, null];
    } catch (error) {
        handleError(error, "post.service -> getUserFavoritePosts");
        return [null, error.message];
    }
}

export default {
    getPosts,
    createPost,
    getPostById,
    getUserPosts,
    updatePost,
    deletePost,
    savePostAsFavorite,
    getPostsByCategory,
    getUserFavoritePosts
}