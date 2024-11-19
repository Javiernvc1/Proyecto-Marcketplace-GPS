// frontend/src/pages/PostsPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";
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
    <Grid container spacing={2}>
      {posts.map((post) => (
        <Grid item xs={12} sm={6} md={4} key={post._id}>
          <Link to={`/posts/${post._id}`} style={{ textDecoration: "none" }}>
            <Card>
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
                <Typography variant="h6" component="div">
                  {post.description}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default PostsPage;