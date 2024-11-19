"use strict"

import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";
import PostService from "../services/post.service.js";
import { postBodySchema } from "../schema/post.schema.js";
async function getPosts(req, res) {
    try {
        const [posts, error] = await PostService.getPosts();
        if (error) return respondError(req, res, 404, error);

        posts.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, posts);
    } catch (error) {
        handleError(error, "post.controller -> getPosts");
        respondError(req, res, 400, error.message);
    }
}

async function createPost(req, res) {
    try {
        const { title, description, author, category } = req.body;
        const { error: bodyError} = postBodySchema.validate(req.body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);
        const post = { title, description, author, category };
        const [newPost, error] = await PostService.createPost(post, req.files);

        if (error) return respondError(req, res, 400, error);
        if (!newPost) {
            return respondError(req, res, 400, "No se creo la publicación");
        }

        respondSuccess(req, res, 201, newPost);
    } catch (error) {
        handleError(error, "post.controller -> createPost");
        respondError(req, res, 500, "No se creo la publicación");
    }
}

async function getPostById(req, res) {
    try {
        const { params } = req;
        const { id } = params;
        const [post, error] = await PostService.getPostById(id);

        if (error) return respondError(req, res, 404, error);
        respondSuccess(req, res, 200, post);
    } catch (error) {
        handleError(error, "post.controller -> getPostById");
        respondError(req, res, 400, error.message);
    }
}

async function getUserPosts(req, res) {
    try {
        const { params } = req;
        const { id } = params;
        const [posts, error] = await PostService.getUserPosts(id);

        if (error) return respondError(req, res, 404, error);
        respondSuccess(req, res, 200, posts);
    } catch (error) {
        handleError(error, "post.controller -> getUserPosts");
        respondError(req, res, 400, error.message);
    }
}

async function updatePost(req, res) {
    try {
        const { params, body } = req;
        const { id } = params;
        const { title, description, author, category, status } = req.body;
        let base64Image = null;
        if (req.file) {
            const imageBuffer = req.file.buffer;
            base64Image = imageBuffer.toString("base64");
        }
        const post = { title, description, author, category, status};

        const [updatedPost, error] = await PostService.updatePost(id, post);

        if (error) return respondError(req, res, 404, error);
        respondSuccess(req, res, 200, updatedPost);
    } catch (error) {
        handleError(error, "post.controller -> updatePost");
        respondError(req, res, 400, error.message);
    }
}

async function deletePost(req, res) {
    try {
        const { params } = req;
        const { id } = params;
        const [deletedPost, error] = await PostService.deletePost(id);

        if (error) return respondError(req, res, 404, error);
        respondSuccess(req, res, 200, deletedPost);
    } catch (error) {
        handleError(error, "post.controller -> deletePost");
        respondError(req, res, 400, error.message);
    }
}

async function savePostAsFavorite(req, res) {
    try {
        const { postId } = req.params;
        const { userId} = req.body;
        const [post, error] = await PostService.savePostAsFavorite(userId, postId);

        if (error) return respondError(req, res, 404, error);
        respondSuccess(req, res, 200, post);
    } catch (error) {
        handleError(error, "post.controller -> savePostAsFavorite");
        respondError(req, res, 400, error.message);
    }
}

async function getPostByCategory(req, res) {
    try {
        const { params } = req;
        const { categoryId } = params;
        const [posts, error] = await PostService.getPostByCategory(categoryId);

        if (error) return respondError(req, res, 404, error);
        respondSuccess(req, res, 200, posts);
    } catch (error) {
        handleError(error, "post.controller -> getPostByCategory");
        respondError(req, res, 400, error.message);
    }
}

async function getUserFavoritePosts(req, res){
    try {
        const {userId} = req.params;
        const [posts, errorPosts] = await PostService.getUserFavoritePosts(userId);
        if(errorPosts) return respondError(req, res, 400,  errorPosts);
        if(!posts) return respondError(req,res, 400, "No se encontro favoritos");
        respondSuccess(req, res, 200, posts);
    } catch (error) {
        handleError(error, 'post.controller -> getUserFavoritePosts');
        respondError(req, res, 500, 'No se encontro  favoritos');
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
    getUserFavoritePosts
}