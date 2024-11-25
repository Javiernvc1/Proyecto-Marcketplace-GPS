// frontend/src/pages/Chat.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getConversation, sendMessage } from "../services/chat.service";
import { getUserByEmail } from "../services/user.service";
import { Container, TextField, Button, List, ListItem, ListItemText, Box,Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await getUserByEmail(user.email);
        console.log("user", userData);
        setUserId(userData.data._id);
      } catch (error) {
        console.error("Error al obtener el ID del usuario:", error);
      }
    };

    const fetchConversation = async () => {
      
      try {
        const data = await getConversation(conversationId);
        console.log("conversacion datos", data.data);
        setConversation(data.data);
        
      } catch (error) {
        console.error("Error al obtener la conversación:", error);
      }
    };

    fetchConversation();
    fetchUserId();
  }, [conversationId,user.email]);

  const handleSendMessage = async () => {
    try {
      console.log("user id: ",userId);
      await sendMessage(conversationId, userId, message);
      setMessage("");
      const data = await getConversation(conversationId);
      console.log("data conversation", data.data);
      setConversation(data.data);
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  if (!conversation) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Container>
      <Box sx={{ bgcolor: 'white', minHeight: '100vh', p: 3 }}>
        <List>
        {conversation.messages.map((msg) => {
            console.log("Mensaje:", msg);
            if (!msg.sender) {
              console.log("msg.sender es undefined");
              return null;
            }
            const sender = conversation.participants.find(participant => participant._id.toString() === msg.sender.toString());
            console.log("sender:",conversation.participants.find(participant => participant._id.toString() === msg.sender.toString() ));
            return (
              <ListItem key={msg._id}>
                <ListItemText 
                  primary={sender ? `${sender.name} ${sender.surname}`: "Usuario desconocido"} 
                  secondary={msg.content } 
                  
                />
              </ListItem>
            );
          })}
        </List>
        <TextField
          label="Mensaje"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Enviar
        </Button>
      </Box>
    </Container>
  );
};

export default Chat;