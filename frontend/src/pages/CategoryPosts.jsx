// frontend/src/pages/CategoryPosts.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Grid, Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { getPostByCategory } from "../services/post.service";

const CategoryPosts = () => {
  const { categoryId } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPostByCategory(categoryId);
        console.log("data", data.data);
        setPosts(data.data);
      } catch (error) {
        console.error("Error al obtener los posts de la categoría:", error);
      }
    };

    fetchPosts();
  }, [categoryId]);

  if (!posts || posts.length === 0) {
    return <Typography>No hay publicaciones disponibles para esta categoría</Typography>;
  }
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Publicaciones de la Categoría
      </Typography>
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <Link to={`/posts/${post._id}`} style={{ textDecoration: "none" }}>
              <Card sx={{ bgcolor: '#e3f2fd', color: '#333', border: '1px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.2)', border: '1px solid #bdbdbd' } }}>
                {post.images.length > 0 && (
                  <CardMedia
                    component="img"
                    height="200"
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
    </Container>
  );
};

export default CategoryPosts;