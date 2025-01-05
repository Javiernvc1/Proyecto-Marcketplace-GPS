// frontend/src/pages/Favorites.jsx
import React, { useEffect, useState } from "react";
import { Container, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { getUserFavoritePosts, removeFavoritePost} from "../services/post.service";
import { useAuth } from "../context/AuthContext";
import { getUserByEmail } from "../services/user.service";
import DeleteIcon from '@mui/icons-material/Delete';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const { user } = useAuth();
    const [userId, setUserId] = useState(null);
  
    useEffect(() => {
      const fetchUserId = async () => {
        try {
          const userData = await getUserByEmail(user.email);
          setUserId(userData.data._id);
        } catch (error) {
          console.error("Error al obtener el ID del usuario:", error);
        }
      };
  
      const fetchFavorites = async () => {
        if (userId) {
          try {
            const data = await getUserFavoritePosts(userId);
            setFavorites(data.data);
          } catch (error) {
            console.error("Error al obtener las publicaciones favoritas:", error);
          }
        }
      };
  
      fetchUserId();
      fetchFavorites();
    }, [user.email, userId]);
  
    const handleRemoveFavorite = async (postId) => {
      try {
        await removeFavoritePost(userId, postId);
        setFavorites(favorites.filter(favorite => favorite._id !== postId));
      } catch (error) {
        console.error("Error al eliminar la publicación favorita:", error);
      }
    };

    if (!favorites || favorites.length === 0) {
      return <Typography>No hay publicaciones favoritas disponibles</Typography>;
    }
  
    return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Mis Favoritos
      </Typography>
      <List>
        {favorites.map((favorite) => (
          <ListItem key={favorite._id} component={Link} to={`/posts/${favorite._id}`} button>
            <ListItemAvatar>
              <Avatar src={favorite.images[0]} alt={favorite.title} />
            </ListItemAvatar>
            <ListItemText
              primary={favorite.title}
              secondary={favorite.description}
            />
            <IconButton 
              edge="end" 
              aria-label="delete" 
              onClick={(e) => {
                e.preventDefault(); // Prevenir la navegación al hacer clic en el botón de eliminar
                handleRemoveFavorite(favorite._id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
  };
  
  export default Favorites;