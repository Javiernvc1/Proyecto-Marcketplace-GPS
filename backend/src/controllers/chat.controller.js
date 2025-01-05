"use strict";

import { handleError } from "../utils/errorHandler.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";
import ChatService from "../services/chat.service.js";

async function startConversation(req, res) {
  try {
    const { userId, postId } = req.body;
    const [conversation, error] = await ChatService.startConversation(userId, postId);
    if (error) return respondError(req, res, 400, error);
    respondSuccess(req, res, 201, conversation);
  } catch (error) {
    handleError(error, "chat.controller -> startConversation");
    respondError(req, res, 500, "No se pudo iniciar la conversación");
  }
}

async function sendMessage(req, res) {
  try {
    const { conversationId, senderId, content } = req.body;
    const [message, error] = await ChatService.sendMessage(conversationId, senderId, content);
    if (error) return respondError(req, res, 400, error);
    respondSuccess(req, res, 201, message);
  } catch (error) {
    handleError(error, "chat.controller -> sendMessage");
    respondError(req, res, 500, "No se pudo enviar el mensaje");
  }
}

async function getConversation(req, res) {
  try {
    const { conversationId } = req.params;
    const [conversation, error] = await ChatService.getConversation(conversationId);
    if (error) return respondError(req, res, 400, error);
    respondSuccess(req, res, 200, conversation);
  } catch (error) {
    handleError(error, "chat.controller -> getConversation");
    respondError(req, res, 500, "No se pudo obtener la conversación");
  }
}

async function getUserConversations(req, res) {
  try {
    const { userId } = req.params;
    const [conversations, error] = await ChatService.getUserConversations(userId);
    if (error) return respondError(req, res, 400, error);
    respondSuccess(req, res, 200, conversations);
  } catch (error) {
    handleError(error, "chat.controller -> getUserConversations");
    respondError(req, res, 500, "No se pudieron obtener las conversaciones");
  }
}

async function deleteConversation(req, res) {
  try {
    const { conversationId } = req.params;
    const [result, error] = await ChatService.deleteConversation(conversationId);
    
    if (error) return respondError(req, res, 400, error);
    respondSuccess(req, res, 200, result);
  } catch (error) {
    handleError(error, "chat.controller -> deleteConversation");
    respondError(req, res, 500, "No se pudo eliminar la conversación");
  }
}

export default {
  startConversation,
  sendMessage,
  getConversation,
  getUserConversations,
  deleteConversation,
};