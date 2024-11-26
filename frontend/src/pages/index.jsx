import * as React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Box, Container, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import EmailIcon from '@mui/icons-material/Email';
import SellIcon from '@mui/icons-material/Sell';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../services/auth.service';
import { useNavigate, Link, Route, Routes, Outlet } from 'react-router-dom';
import logo from '../assets/logomarketplace.png';
import { useAuth } from '../context/AuthContext';
import Postspage from './postpage.jsx';
import Conversations from './Conversations.jsx';

const drawerWidth = 240;

function DashboardLayoutBasic() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleCreatePost = () => {
    navigate('/createpost');
  };



  const drawer = (
    <div>
      <Toolbar>
        <img src={logo} alt="Logo" style={{ width: '100%', padding: '10px' }}/>
      </Toolbar>
      <List>
        {['Explorar todo', 'Mensajes', 'Mis Compras', 'Mis Publicaciones', 'Favoritos', 'Categorias'].map((text, index) => (
          
          <ListItem button key={text} component={Link} to={text === 'Explorar todo' ? '/' : 
          text === 'Mensajes' ? '/conversations' : 
          text === 'Mis Publicaciones' ? '/user-posts' :`/${text.toLowerCase().replace(/ /g, '-')}`}>
            <ListItemIcon>
              {index === 0 ? <DashboardIcon /> : null}
              {index === 1 ? <EmailIcon /> : null}
              {index === 2 ? <ShoppingBagIcon /> : null}
              {index === 3 ? <SellIcon  /> : null}
              {index === 4 ? <FavoriteIcon /> : null}
              {index === 5 ? <FormatListBulletedIcon/> : null}
            </ListItemIcon>
            <ListItemText primary={text} sx={{ color: 'black' }}/>
          </ListItem>
        ))}
        <ListItem button  key="Logout" onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Salir" sx={{ color: 'black' }}/>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{
          backgroundColor: '#438bcb ', // Cambia 'primary.main' por el color que desees
        }}>
          <IconButton
            color="black"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" noWrap component="div">
            CampusTrade UBB
          </Typography>
          <Button color="inherit" onClick={handleCreatePost} sx={{ marginLeft: 'auto' }}>
            Crear Post
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, height: '100vh' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, height: '100vh' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` },bgcolor: 'white', minHeight: '300vh' , display: 'flex', flexDirection: 'column'}}
      >
        <Toolbar />
        <Container sx={{ flexGrow: 1, bgcolor: 'white', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
        </Container>
      </Box>
    </Box>
  );
}


export default DashboardLayoutBasic;