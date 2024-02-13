import React from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Container} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuItemsComponent, { menuItems } from '../admin/MenuItems';
import { drawerWidth } from '../admin/constants';
import { ThemeProvider, createTheme } from '@mui/material';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const Layout = ({ children }) => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Survey System
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <MenuItemsComponent />
            </List>
          </Box>
        </Drawer>
        <Container component="main" sx={{ flexGrow: 1, p: 3, minHeight: 'calc(100vh - 64px)' }}>
          <Toolbar />
          {children}
        </Container>
        {/* Footer */}
      </Box>
    );
  };
  

export default Layout;
