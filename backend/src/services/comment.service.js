import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

import { handleError } from "../utils/errorHandler.js";

import { saveImagePost } from "../utils/generalUtils.js";

import { PORT, HOST } from "../config/configEnv.js";


async function createComment(comment, files = []) {
    try{
        const { textContent, userId, postId } = comment;
        const userFound = await User.findById(userId);
        if(!userFound) return [ null, "Usuario no encontrado"];

        const postFound = await Post.findById(postId);
        if (!postFound) return [ null, "Publicacion no encontrada"];
        if(!postFound.status) return [null, "La publicacion esta cerrada y no permite comentarios."];

        const fileComment = await Promise.all(
            files.map( file => saveImagePost(file) )
        );

        const newComment = new Comment({ textContent, imageContent:fileComment, userId, postId });
        const savedComment = await newComment.save();

        postFound.comments.push(savedComment._id);
        await postFound.save();

        userFound.comments.push(savedComment._id);
        await userFound.save();

        return [savedComment, null];
    }
    catch(error){
        handleError(error, "comment.service -> createComment")
        return [null, error.message];
    }
}


async function getComment(id) {
  try {
    const comment = await Comment.findById(id)
      .populate("userId", "name username")
      .exec();
      const commentData = {
        ...comment.toObject(),
        imageComment: comment.imageContent.map(image => `${HOST}${PORT}/uploads/images/${image}`),
        userId: { id: comment.userId._id, name: comment.userId.name, username: comment.userId.username }
      };
      if (!comment) return [null, "Comentario no encontrado"];
      return [commentData, null];

  } catch (error) {
    handleError(error, "comment.service -> getComment");
    return [null, error.message];
  }
}

async function updateComment(id, comment) {
  try {
    const { textContent, imageContent, userId } = comment;
    const commentFound = await Comment.findById(id);
    if (!commentFound) return [null, "Comentario no encontrado"];

    const userFound = await User.findById(userId);
    if (!userFound) return [null, "Usuario no encontrado"];

    commentFound.textContent = textContent;
    commentFound.imageContent = imageContent;
    commentFound.userId = userId;

    await commentFound.save();
    return [commentFound, null];
  } catch (error) {
    handleError(error, "comment.service -> updateComment");
    return [null, error.message];
  }
}

async function deleteComment(id) {
  try {
    const commentFound = await Comment.findByIdAndDelete(id);
    if (!commentFound) return [null, "Comentario no encontrado"];

    // Remover el ID del comentario del array de comentarios del post
    await Post.updateOne(
      { _id: commentFound.postId },
      { $pull: { comments: commentFound._id } }
    );

    return [commentFound, null];
  } catch (error) {
    handleError(error, "comment.service -> deleteComment");
    return [null, error.message];
  }
}

async function getCommentsByUser(userId) {
  try {
    const comments = await Comment.find({ userId })
      .populate("userId", "name username")
      .exec();
    if (!comments) return [null, "No se encontraron comentarios en la bbdd"];
    return [comments, null];
  } catch (error) {
    handleError(error, "comment.service -> getCommentsByUser");
    return [null, error.message];
  }
}

async function getCommentsByPost(postId) {
  try {
    const comments = await Comment.find({ postId })
      .populate("userId", "name username")
      .exec();
    if (!comments) return [null, "No se encontraron comentarios en la bbdd"];

    const commentsWithImages = comments.map(comment => {
      const commentData = {
        ...comment.toObject(),
        imageContent: comment.imageContent.map(image => `${HOST}${PORT}/uploads/images/${image}`),
        userId: { id: comment.userId._id, name: comment.userId.name, username: comment.userId.username }
      }
      return commentData;
    })
    return [commentsWithImages, null];
  } catch (error) {
    handleError(error, "comment.service -> getCommentsByPost");
    return [null, error.message];
  }
}

export default {
  createComment,
  getComment,
  updateComment,
  deleteComment,
  getCommentsByUser,
  getCommentsByPost,
};