// frontend/src/pages/Chat.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getConversation, sendMessage, markAsSold } from "../services/chat.service";
import { getPostById } from "../services/post.service";
import { getUserByEmail } from "../services/user.service";
import { Container, TextField, Button, List, ListItem, ListItemText, Box, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  withCredentials: true,
  transports: ['websocket', 'polling']
}); // Ajusta la URL según sea necesario

const Chat = () => {
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState(null);
  const [post, setPost] = useState(null);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const { user } = useAuth();
  const [socketConnected, setSocketConnected] = useState(false);
  
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await getUserByEmail(user.email);
        setUserId(userData.data._id);
      } catch (error) {
        console.error("Error al obtener el ID del usuario:", error);
      }
    };

    const fetchConversation = async () => {
      try {
        const data = await getConversation(conversationId);
        setConversation(data.data);
        const post = await getPostById(data.data.post);
        setPost(post.data);
      } catch (error) {
        console.error("Error al obtener la conversación:", error);
      }
    };

    fetchConversation();
    fetchUserId();
    socket.connect();
    socket.on("connect", () => {
      console.log("Connected to socket server");
      setSocketConnected(true);
      socket.emit("joinRoom", conversationId);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
      setSocketConnected(false);
    });

    socket.on("chatMessage", (msg) => {
      console.log("Mensaje recibido:", msg);
      setConversation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, {
            _id: msg._id,
            sender: msg.sender,
            content: msg.content,
            conversation: msg.conversationId
          }]
        };
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("chatMessage");
      socket.emit("leaveRoom", conversationId);
    };
  }, [conversationId, user.email]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      const response = await sendMessage(conversationId, userId, message);
      const newMessage = response.data;
      
      

      socket.emit("chatMessage", {
        _id: newMessage._id,
        conversationId,
        sender: userId,
        content: message
      });
      
      
      setMessage("");
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  const handleMarkAsSold = async () => {
    try {
      const buyerId = conversation.participants.find(participant => participant._id !== userId)._id;
      await markAsSold(post._id, buyerId);
      alert("Venta marcada como realizada");
    } catch (error) {
      console.error("Error al marcar la venta como realizada:", error);
    }
  };

  if (!conversation || !post) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Container>
      <Box sx={{ 
        bgcolor: 'white', 
        height: 'calc(100vh - 100px)', // Altura fija restando el espacio del header
        display: 'flex',
        flexDirection: 'column',
        p: 3 
      }}>
        <List sx={{ 
          flexGrow: 1, 
          overflow: 'auto', // Permite el scroll
          maxHeight: 'calc(100vh - 250px)', // Altura máxima para los mensajes
          mb: 2 
        }}>
          {conversation?.messages.map((msg) => {
            const sender = conversation.participants.find(
              participant => participant._id === (typeof msg.sender === 'object' ? msg.sender._id : msg.sender)
            );
            
            return (
              <ListItem 
                key={msg._id}
                sx={{
                  justifyContent: msg.sender === userId ? 'flex-end' : 'flex-start',
                  '& .MuiListItemText-root': {
                    maxWidth: '70%'
                  }
                }}
              >
                <ListItemText 
                  primary={sender ? `${sender.name} ${sender.surname}` : "Usuario desconocido"} 
                  secondary={msg.content}
                  sx={{
                    bgcolor: msg.sender === userId ? '#e3f2fd' : '#f5f5f5',
                    p: 1,
                    borderRadius: 1
                  }}
                />
              </ListItem>
            );
          })}
        </List>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          position: 'sticky',
          bottom: 0,
          bgcolor: 'white',
          pt: 2
        }}>
          <TextField
            label="Mensaje"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            margin="normal"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSendMessage}
            sx={{ mt: 2 }}
          >
            Enviar
          </Button>
        </Box>
        
        {post?.author._id === userId && (
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleMarkAsSold}
            sx={{ mt: 2 }}
          >
            Marcar como Vendido
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default Chat;