// frontend/src/pages/EditPost.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, updatePost } from "../services/post.service";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const EditPost = () => {
  const { postId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(postId);
        setTitle(data.title);
        setDescription(data.description);
      } catch (error) {
        console.error("Error al obtener el post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedPost = { title, description };
    try {
      await updatePost(postId, updatedPost);
      navigate("/user-posts");
    } catch (error) {
      console.error("Error al actualizar el post:", error);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 6,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: '#EDF2EE'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Publicación
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Actualizar
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default EditPost;