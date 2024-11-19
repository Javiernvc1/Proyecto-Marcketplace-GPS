// frontend/src/pages/CreatePost.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../services/post.service";
import { getCategories } from "../../services/category.service.js"
import { Container, TextField, Button, Typography, Box, MenuItem, Select, InputLabel, FormControl} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { getUserByEmail } from "../../services/user.service.js"
const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    
    useEffect(() => {
        const fetchCategories = async () => {
          try {
            const data = await getCategories();
            setCategories(data.data);
          } catch (error) {
            console.error("Error al obtener las categorías:", error);
          }
        };
        const fetchUserId = async () => {
            try {
            
              const userData = await getUserByEmail(user.email);
              console.log("userdata", userData);
              console.log("email", user)
              setUserId(userData.data._id);
            } catch (error) {
              console.error("Error al obtener el ID del usuario:", error);
            }
          };
        fetchUserId();
        fetchCategories();
  }, [user.email]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    console.log("usuario datos", userId);
    if (userId) {
        formData.append("author", userId); // Agrega el ID del usuario al formulario
      } else {
        console.error("El ID del usuario no está disponible");
    }
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      await createPost(formData);
      navigate("/");
    } catch (error) {
      console.error("Error al crear el post:", error);
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
          Crear Post
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
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Categoría"
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.nameCategory}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <input
            type="file"
            multiple
            onChange={(e) => setImages(e.target.files)}
            accept="image/*"
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Crear
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default CreatePost;