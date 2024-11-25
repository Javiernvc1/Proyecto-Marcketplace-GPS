// frontend/src/pages/PostsPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Grid, Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { getPosts } from "../services/post.service.js";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
        try {
            const data = await getPosts();
    
            if (Array.isArray(data)) {
              setPosts(data);
            } else {
              console.error('La respuesta de la API no es un array:', data);
            }
          } catch (error) {
            console.error('Error al obtener los camiones:', error);
          }
    }

    fetchPosts();
  }, []);

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', p:3, flexGrow: 1  }}>
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <Link to={`/posts/${post._id}`} style={{ textDecoration: "none" }}>
              <Card sx={{ bgcolor: '#e3f2fd', color: '#333' }}>
                {post.images.length > 0 && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={post.images[0]} // Renderiza la primera imagen
                    alt={post.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" component="div">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {post.description}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PostsPage;