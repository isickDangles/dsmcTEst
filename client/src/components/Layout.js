import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Drawer, IconButton, Button, Box, List, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import MenuItemsComponent from '../admin/MenuItems';
import logout from "./Logout";
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleLogout = async () => {
        await logout();
    };

    const navigateToDashboard = () => {
        const role = localStorage.getItem('role');
        if (role) {
            switch (role) {
                case 'Admin':
                    navigate('/admin/dashboard');
                    break;
                case 'Surveyor':
                    navigate('/surveyor/dashboard');
                    break;
                case 'Respondent':
                    navigate('/respondent/dashboard');
                    break;
                default:
                    navigate('/login');
                    break;
            }
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#192841' }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ marginRight: '20px', transform: drawerOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
                    >
                        {drawerOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{ flexGrow: 1, color: '#fff', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', letterSpacing: '0.5px', cursor: 'pointer' }}
                        onClick={navigateToDashboard}
                    >
                        Survey System
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={handleLogout}
                        sx={{
                            bgcolor: '#333',
                            color: 'white',
                            '&:hover': {
                                bgcolor: '#555',
                            },
                            borderRadius: 2,
                            p: '6px 16px',
                            ml: 2,
                        }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="persistent"
                open={drawerOpen}
                sx={{
                    width: drawerOpen ? 240 : 0, // Conditionally set width based on drawerOpen
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerOpen ? 240 : 0, // Conditionally set width based on drawerOpen
                        boxSizing: 'border-box',
                        overflowX: 'hidden', // Prevent horizontal scrollbar when drawer is closed
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <MenuItemsComponent />
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, transition: 'margin-left .5s', marginLeft: `${drawerOpen ? 240 : 0}px`, width: `calc(100% - ${drawerOpen ? 240 : 0}px)` }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
