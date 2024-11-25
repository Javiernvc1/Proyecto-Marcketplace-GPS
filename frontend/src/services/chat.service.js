import axios from "./root.service";

export const startConversation = async (userId, postId) => {
  try {
    const response = await axios.post("/chat/start", { userId, postId });
    return response.data;
  } catch (error) {
    console.error("Error en chat.service -> startConversation", error);
  }
};

export const sendMessage = async (conversationId, senderId, content) => {
  try {
    const response = await axios.post("/chat/send", { conversationId, senderId, content });
    return response.data;
  } catch (error) {
    console.error("Error en chat.service -> sendMessage", error);
  }
};

export const getConversation = async (conversationId) => {
  try {
    const response = await axios.get(`/chat/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error("Error en chat.service -> getConversation", error);
  }
};

export const getUserConversations = async (userId) => {
  try {
    const response = await axios.get(`/chat/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error en chat.service -> getUserConversations", error);
  }
};