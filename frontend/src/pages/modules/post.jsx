// frontend/src/pages/PostDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams,  useNavigate} from "react-router-dom";
import { getPostById } from "../../services/post.service";
import { getUserByEmail } from "../../services/user.service";
import { startConversation } from "../../services/chat.service";
import { Container, Typography, Card, CardMedia, CardContent, Grid, Button, Snackbar, Alert  } from "@mui/material";
import { useAuth } from "../../context/AuthContext";


const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const { user } = useAuth();
  const [alertOpen, setAlertOpen] = useState(false);

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

    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data.data);
        console.log(data);
      } catch (error) {
        console.error("Error al obtener el post:", error);
      }
    };
    fetchUserId();
    fetchPost();
  }, [id]);

  const handleStartConversation = async () => {
    if (post.author._id === userId) {
      console.error("No puedes enviarte un mensaje a ti mismo.");
      setAlertOpen(true);
      return;
    }

    try {
      const response = await startConversation(userId, post._id);
      const conversationId = response.data._id;
      navigate(`/chat/${conversationId}`);
    } catch (error) {
      console.error("Error al iniciar la conversación:", error);
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  if (!post) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Container>
      <Card>
        {post.images.length > 0 && (
          <CardMedia
            component="img"
            height="300"
            image={post.images[0]} // Renderiza la primera imagen
            alt={post.title}
          />
        )}
        <CardContent>
          <Typography variant="h4" component="h1">
            {post.title}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {post.description}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Autor: {post.author.name} {post.author.surname}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Categoría: {post.category.nameCategory}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Contacto: {post.author.email}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Estado: {post.state}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Fecha de creación: {new Date(post.createdAt).toLocaleDateString()}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleStartConversation} >
            Comenzar Conversación
          </Button>
        </CardContent>
      </Card>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
          No puedes enviarte un mensaje a ti mismo.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Post;