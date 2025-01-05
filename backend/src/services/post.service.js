"use strict"
import path from "path";
import { fileURLToPath } from "url";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";

import { PORT, HOST, URL } from "../config/configEnv.js";
import { handleError } from "../utils/errorHandler.js";
import { saveImagePost } from "../utils/generalUtils.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// backend/src/services/post.service.js
async function getPosts(userId = null) {
  try {
      let query = {};
      
      if (userId) {
          // If userId is provided, include posts that are:
          // 1. Active (visible to everyone)
          // 2. Paused (visible only to author and users who have purchased)
          query = {
              $or: [
                  { state: "activo" },
                  { 
                      state: "pausado",
                      $or: [
                          { author: userId },
                          { 'sales.buyer': userId }
                      ]
                  }
              ]
          };
      } else {
          // If no userId, only show active posts
          query = { state: "activo" };
      }

      const posts = await Post.find(query)
          .populate({
              path: 'author',
              select: '_id name'
          })
          .populate({
              path: 'category',
              select: '_id nameCategory'
          });

      if (!posts) {
          return [null, "No se encontraron publicaciones"];
      }

      const publicationData = posts.map(post => ({
          ...post.toObject(),
          images: post.images.map(imageName => `${URL}${PORT}/uploads/images/${imageName}`),
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
                select: '_id name surname email '
            })
            .populate({
                path: 'category',
                select: '_id nameCategory'
            })
            
        
        if (!post) return [null, "La publicación no existe"];

        const publicationData = {
            ...post.toObject(),
            images: post.images.map(imageName => `${URL}${PORT}/uploads/images/${imageName}`),
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
            images: post.images.map(imageName => `${URL}${PORT}/uploads/images/${imageName}`),
        }));

        return [publicationData, null];

    } catch (error) {
        handleError(error, "post.service -> getUserPosts");
        return [null, "Error al obtener publicaciones del usuario"];
    }
}

// backend/src/services/post.service.js
async function updatePost(id, body) {
    try {
        const post = await Post.findById(id);
        if(!post) return [null, `No se encontro la publicacion de id: ${id}`];
        
        const { title, description, category, state } = body;
        
        // Validar estados permitidos
        if (state && !["activo", "pausado", "cerrado"].includes(state)) {
            return [null, "Estado no válido"];
        }

        const postUpdated = await Post.findByIdAndUpdate(
            id,
            { title, description, category, state },
            { new: true }
        );
        return [postUpdated, null];
    } catch (error) {
        handleError(error, "post.service -> updatePost");
        return [null, error.message];
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

async function savePostAsFavorite(userId, postId) {
    try {
      const userFound = await User.findById(userId);
      if (!userFound) return [null, 'Usuario no encontrado'];
  
      const postFound = await Post.findById(postId);
      if (!postFound) return [null, 'Publicación no encontrada'];
  
      const isSaved = userFound.favorites.includes(postId);
  
      if (isSaved) {
        userFound.favorites = userFound.favorites.filter(favorites => favorites.toString() !== postId);
      } else {
        userFound.favorites.push(postFound.id);
      }
  
      await userFound.save();
      return [userFound, null];
    } catch (error) {
      handleError(error, "post.service -> savePostAsFavorite");
      return [null, error.message];
    }
  }

  async function getPostByCategory(categoryId) {
    try {
      const categoryFound = await Category.findById(categoryId);
      if (!categoryFound) return [null, `No se encontró categoría con id: ${categoryId}`];
  
      const posts = await Post.find({ category: categoryId })
        .populate({ path: 'author', select: "_id name" })
        .populate({ path: 'category', select: "_id nameCategory" });
  
      if (!posts) return [null, "No se encontraron publicaciones para esta categoría"];
  
      const publicationData = posts.map(post => ({
        ...post.toObject(),
        images: post.images.map(imageName => `${URL}${PORT}/uploads/images/${imageName}`),
      }));
  
      return [publicationData, null];
    } catch (error) {
      handleError(error, "post.service -> getPostByCategory");
      return [null, error.message];
    }
  }

async function getUserFavoritePosts(userId){
    try {
        const user = await User.findById(userId).populate({
            path: 'favorites',
            populate: [{
                path: 'author',
                select: '_id name'
            },{
                path: 'category',
                select: '_id nameCategory'
            }]
        });
        if (!user) return [null, `No se encontró el usuario con id: ${userId}`];
  
        const favoritePosts = user.favorites.map(post => ({
            ...post.toObject(),
            images: post.images.map(imageName => `${URL}${PORT}/uploads/images/${imageName}`)
        }));
  
        return [favoritePosts, null];
    } catch (error) {
        handleError(error, "post.service -> getUserFavoritePosts");
        return [null, error.message];
    }
  }

async function markAsSold(postId, userId) {
    try {
      const post = await Post.findById(postId);
      if (!post) return [null, "Publicación no encontrada"];
  
      const buyer = await User.findById(userId);
      if (!buyer) return [null, "Comprador no encontrado"];
  
      post.sales.push({ buyer: userId });
      await post.save();
  
      buyer.buys.push(postId);
      await buyer.save();
  
      return [post, null];
    } catch (error) {
      handleError(error, "post.service -> markAsSold");
      return [null, error.message];
    }
  }

async function searchPosts(query) {
  try {
    // Diccionario de palabras relacionadas
    const relatedWords = {
      'deportes': ['deportivo', 'deporte', 'deportiva', 'equipamiento deportivo', 'deportistas'],
      'libros': ['libro', 'textos', 'texto', 'académico', 'académicos'],
      'electrónica': ['electronica','electrónico', 'electrónicos', 'electrónicas', 'tecnología'],
      'instrumentos': ['musica','música', 'musical', 'musicales'],
      'arriendo': ['arriendos', 'alquiler', 'alquileres', 'renta'],
      'tutoria': ['tutorias', 'clases', 'enseñanza', 'particular']
    };

    // Obtener palabras relacionadas con la búsqueda
    const searchTerms = [query.toLowerCase()];
    Object.entries(relatedWords).forEach(([key, values]) => {
      if (values.includes(query.toLowerCase()) || key === query.toLowerCase()) {
        searchTerms.push(...values);
        searchTerms.push(key);
      }
    });

    // Crear patrón de búsqueda con todas las palabras relacionadas
    const searchPattern = searchTerms.join('|');

    // Buscar categorías que coincidan con cualquiera de los términos
    const categories = await Category.find({
      nameCategory: { $regex: searchPattern, $options: "i" }
    });

    const categoryIds = categories.map(cat => cat._id);

    // Buscar posts que coincidan con el título o descripción o que pertenezcan a las categorías encontradas
    const posts = await Post.find({
      $or: [
        { title: { $regex: searchPattern, $options: "i" } },
        { description: { $regex: searchPattern, $options: "i" } },
        { category: { $in: categoryIds } }
      ]
    })
    .populate({ path: 'author', select: "_id name" })
    .populate({ path: 'category', select: "_id nameCategory" });

    if (!posts) return [null, "No se encontraron publicaciones"];

    const publicationData = posts.map(post => ({
      ...post.toObject(),
      images: post.images.map(imageName => `${URL}${PORT}/uploads/images/${imageName}`),
    }));

    return [publicationData, null];
  } catch (error) {
    handleError(error, "post.service -> searchPosts");
    return [null, error.message];
  }
}

async function removeFavoritePost(userId, postId) {
  try {
    console.log("BACKEND SERVICE: removeFavoritePost -> userId, postId", userId, postId); // Agregar log para debug
    
    const user = await User.findById(userId);
    if (!user) return [null, 'Usuario no encontrado'];

    user.favorites = user.favorites.filter(favorite => favorite.toString() !== postId);
    await user.save();

    return [user, null];
  } catch (error) {
    handleError(error, "post.service -> removeFavoritePost");
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
    getPostByCategory,
    getUserFavoritePosts,
    markAsSold,
    searchPosts,
    removeFavoritePost
}