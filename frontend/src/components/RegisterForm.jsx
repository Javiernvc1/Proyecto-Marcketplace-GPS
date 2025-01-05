import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { register } from '../services/user.service';
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Container, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link
} from "@mui/material";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const validDomains = ['@alumnos.ubiobio.cl', '@ubiobio.cl'];
    return validDomains.some(domain => email.endsWith(domain));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('name', name);
    // Validate email
    if (!validateEmail(email)) {
      setErrors(prev => ({
        ...prev,
        email: 'Solo se permiten correos institucionales UBB'
      }));
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('surname', surname);
    formData.append('username', username);
    formData.append('description', description);
    formData.append('gender', gender);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('roleUser[]', 'user');

    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
        console.log('formData', formData);
      const response = await register(formData);
      if (response) {
        navigate('/auth');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
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
        <img src="../logomarketplace.png" alt="Logo" style={{ height: '150px', marginRight: '10px' }} />
        <Typography component="h1" variant="h5" color='#438bcb'>
          Registro
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nombre"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="surname"
            label="Apellido"
            name="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            error={!!errors.surname}
            helperText={errors.surname}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nombre de usuario"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Descripción"
            name="description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Género</InputLabel>
            <Select
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              label="Género"
            >
              <MenuItem value="Hombre">Hombre</MenuItem>
              <MenuItem value="Mujer">Mujer</MenuItem>
              <MenuItem value="Otro">Otro</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico institucional"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{ backgroundColor: '#438bcb' }}
            sx={{ mt: 3, mb: 2 }}
          >
            Registrarse
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'black' }}>
              ¿Ya tienes una cuenta?{' '}
              <Link
                component={RouterLink}
                to="/auth"
                variant="body2"
                sx={{
                  color: '#438bcb',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Inicia sesión aquí
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterForm;