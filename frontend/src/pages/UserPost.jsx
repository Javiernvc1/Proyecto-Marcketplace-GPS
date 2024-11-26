// frontend/src/pages/UserPosts.jsx
import React, { useEffect, useState } from "react";
import { getUserPosts, deletePost } from "../services/post.service";
import { useAuth } from "../context/AuthContext";
import { Container, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Button, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from "react-router-dom";
import { getUserByEmail } from "../services/user.service";
const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3001';

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();
  const [userId, setUserId] = useState(null);

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
    const fetchUserPosts = async () => {
    if (userId) {
      try {
        const data = await getUserPosts(userId);
        console.log("data.data",data.data);
        setPosts(data.data);
      } catch (error) {
        console.error("Error al obtener las publicaciones del usuario:", error);
      }
    }
    };

    fetchUserPosts();
  }, [userId]);

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Error al eliminar la publicación:", error);
    }
  };

  if (!posts || posts.length === 0) {
    return <Typography>No hay publicaciones disponibles</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Mis Publicaciones
      </Typography>
      <List>
        {posts.map((post) => (
            
        
          <ListItem key={post._id} component={Link} to={`/posts/${post._id}`} button>
            <ListItemAvatar>
              <Avatar src={post.images[0]} alt={post.title} />
            </ListItemAvatar>
            <ListItemText
              primary={post.title}
              secondary={post.description}
            />
            <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePost(post._id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
         
        ))}
      </List>
    </Container>
  );
};

export default UserPosts;