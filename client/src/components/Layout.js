import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Drawer, IconButton, Button, Box, List, CssBaseline} from '@mui/material';
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
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                        Survey System
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="persistent"
                open={drawerOpen}
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
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
