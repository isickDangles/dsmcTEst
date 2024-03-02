import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Drawer, IconButton, Button, Box, List, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItemsComponent from '../admin/MenuItems';
import logout from "./Logout";

const Layout = ({ children }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#1976d2' }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ marginRight: '20px' }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1, color: '#fff', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                        Survey System
                    </Typography>

                    <Button
                        color="inherit"
                        onClick={handleLogout}
                        sx={{
                            bgcolor: '#333', // Dark gray color
                            color: 'white', // White text for better contrast
                            '&:hover': {
                                bgcolor: '#555', // A slightly lighter shade of gray on hover
                            },
                            borderRadius: 2, // Rounded corners
                            p: '6px 16px', // Padding inside the button
                            ml: 2, // Margin left for some spacing from other elements
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
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Adding drop shadow
                    },
                }}
            >
                {/* Add a Toolbar to offset the content below the AppBar */}
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <MenuItemsComponent />
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {/* This Toolbar pushes the content down below the AppBar */}
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
