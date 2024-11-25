// frontend/src/pages/Conversations.jsx
import React, { useEffect, useState } from "react";
import { getUserConversations } from "../services/chat.service";
import { useAuth } from "../context/AuthContext";
import { Container, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { getUserByEmail } from "../services/user.service";
const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3001';

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [userId, setUserId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await getUserByEmail(user.email);
        console.log("user", userData.data._id);
        setUserId(userData.data._id);
      } catch (error) {
        console.error("Error al obtener el ID del usuario:", error);
      }
    };

    fetchUserId();
  }, [user.email]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (userId) {
        try {
          const data = await getUserConversations(userId);
          console.log("conversations: ", data);
          setConversations(data.data);
        } catch (error) {
          console.error("Error al obtener las conversaciones:", error);
        }
      }
    };

    fetchConversations();
  }, [userId]);

  if (!conversations || conversations.length === 0) {
    return <Typography>No hay conversaciones disponibles</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Mis chats
      </Typography>
      <List>
      {conversations.map((conversation) => {
          const otherParticipant = conversation.participants.find(participant => participant._id !== userId);
          const lastMessage = conversation.messages[conversation.messages.length - 1];
          const imageUrl = `${API_URL}/uploads/images/${conversation.post.images[0]}`;
          return (
            <ListItem key={conversation._id} component={Link} to={`/chat/${conversation._id}`} button>
              <ListItemAvatar>
                <Avatar src={imageUrl} alt={conversation.post.title} />
              </ListItemAvatar>
              <ListItemText
                primary={conversation.post.title}
                secondary={`${otherParticipant.name} ${otherParticipant.surname}: ${lastMessage.content}`}
              />
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
};

export default Conversations;