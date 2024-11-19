// frontend/src/pages/PostDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../../services/post.service";
import { Container, Typography, Card, CardMedia, CardContent, Grid } from "@mui/material";



const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data.data);
        console.log(data);
      } catch (error) {
        console.error("Error al obtener el post:", error);
      }
    };

    fetchPost();
  }, [id]);

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
            Autor: {post.author.name}
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
        </CardContent>
      </Card>
    </Container>
  );
};

export default Post;