// frontend/src/pages/Categories.jsx
import React, { useEffect, useState } from "react";
import { Container, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { getCategories } from "../services/category.service";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        console.log("data", data);
        setCategories(data.data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  if (!categories || categories.length === 0) {
    return <Typography>No hay categorías disponibles</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Categorías
      </Typography>
      <List>
        {categories.map((category) => (
          <ListItem key={category._id} component={Link} to={`/categories/${category._id}`} button>
            <ListItemText 
              primary={<Typography style={{ color: 'blue', textDecoration: 'none' }}>
              {category.nameCategory}
            </Typography>} 
              secondary={category.descriptionCategory}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Categories;