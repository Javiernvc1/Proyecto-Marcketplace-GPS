import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { login } from '../services/auth.service';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link as RouterLink } from 'react-router-dom';
function LoginForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    login(data).then(() => {
      navigate('/');
    });
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
        <Typography component="h1" variant="h5" color = '#438bcb'>
          Iniciar sesión
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            {...register('email', { required: 'Correo Requerido' })}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register('password', { required: 'Contraseña Requerida' })}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{ backgroundColor: '#438bcb' }}
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" sx={{ color: 'black' }}>
            ¿No tienes una cuenta?{' '}
            <Link
              component={RouterLink}
              to="/register"
              variant="body2"
              sx={{
                color: '#438bcb',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Regístrate aquí
            </Link>
          </Typography>
        </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginForm;
