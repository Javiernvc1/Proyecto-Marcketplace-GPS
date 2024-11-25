"use strict";

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { handleError } from "../utils/errorHandler.js";

async function startConversation(userId, postId) {
  try {
    const post = await Post.findById(postId).populate("author");
    if (!post) return [null, "Publicación no encontrada"];

    const existingConversation = await Conversation.findOne({
      participants: { $all: [userId, post.author._id] },
      post: postId,
    });

    if (existingConversation) return [existingConversation, null];

    const newConversation = new Conversation({
      participants: [userId, post.author._id],
      post: postId,
    });

    await newConversation.save();
    return [newConversation, null];
  } catch (error) {
    handleError(error, "chat.service -> startConversation");
    return [null, error.message];
  }
}

async function sendMessage(conversationId, senderId, content) {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return [null, "Conversación no encontrada"];

    const newMessage = new Message({
      sender: senderId,
      content,
      conversation: conversationId,
    });

    await newMessage.save();

    conversation.messages.push(newMessage._id);
    await conversation.save();

    return [newMessage, null];
  } catch (error) {
    handleError(error, "chat.service -> sendMessage");
    return [null, error.message];
  }
}

async function getConversation(conversationId) {
  try {
    const conversation = await Conversation.findById(conversationId)
      .populate("participants", "name surname email")
      .populate("messages");
    if (!conversation) return [null, "Conversación no encontrada"];
    return [conversation, null];
  } catch (error) {
    handleError(error, "chat.service -> getConversation");
    return [null, error.message];
  }
}

async function getUserConversations(userId) {
  try {
    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "name surname email")
      .populate({
        path: "messages",
        populate: {
          path: "sender",
          select: "name surname",
        },
      })
      .populate({
        path: "post",
        select: "title images",
      });
    if (!conversations) return [null, "No se encontraron conversaciones"];
    return [conversations, null];
  } catch (error) {
    handleError(error, "chat.service -> getUserConversations");
    return [null, error.message];
  }
}

export default {
  startConversation,
  sendMessage,
  getConversation,
  getUserConversations,
};