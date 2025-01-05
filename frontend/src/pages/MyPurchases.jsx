// frontend/src/pages/MyPurchases.jsx
import React, { useEffect, useState } from "react";
import { Container, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { getUserPurchases } from "../services/user.service";
import { useAuth } from "../context/AuthContext";
import { getUserByEmail } from "../services/user.service";
const API_URL = 'http://localhost:3001';

const MyPurchases = () => {
  const [userId, setUserId] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const { user } = useAuth();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserByEmail(user.email);
        console.log("user", userData.data._id);
        const userId = userData.data._id;
        setUserId(userId);

        const purchasesData = await getUserPurchases(userId);
        console.log("data user 1", purchasesData);
        if (Array.isArray(purchasesData.data)) {
          setPurchases(purchasesData.data);
        } else {
          console.error("La respuesta de getUserPurchases no es un array:", purchasesData.data);
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, [user.email]);

  if (!purchases || purchases.length === 0) {
    return <Typography>No hay compras disponibles</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Mis Compras
      </Typography>
      <List>
        {purchases.map((purchase,index) => { 
          const imageUrl = `${API_URL}/uploads/images/${purchase.images[0]}`;
          return (
          <ListItem key={`${purchase._id}-${index}`} component={Link} to={`/posts/${purchase._id}`} button>
            <ListItemAvatar>
              <Avatar src={imageUrl} alt={purchase.title} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography style={{ color: 'blue', textDecoration: 'none' }}>
                  {purchase.title}
                </Typography>
              } 
              secondary={purchase.description}
            />
          </ListItem>
          );
        })}
      </List>
    </Container>
  );
};

export default MyPurchases;
