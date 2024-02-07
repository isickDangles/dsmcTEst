import React, { useState } from 'react';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

//MUI Imports
import { Box, CssBaseline, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Container, Grid, Paper, BottomNavigation, BottomNavigationAction, ThemeProvider, createTheme } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import SendIcon from '@mui/icons-material/Send';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Menu, MenuItem, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreVertIcon from '@mui/icons-material/MoreVert';

//Page Imports
import CreateSurveyPage from './CreateSurveyPage.js'; // Adjust the path based on your file structure
import ViewSurvey from './ViewSurvey.js';


const SettingsPage = () => <div>Settings Page</div>;
const CreateSurvey = () => <div>Create Survey Page</div>;
const SendSurveyPage = () => <div>Send Survey Page</div>;
const ViewResponsesPage = () => <div>View Responses Page</div>;
const ViewCurrentSurveys = () => <div>View Current Surveys</div>;

const drawerWidth = 240;

const menuItems = [
  { text: 'Create Survey', icon: <CreateIcon />, route: '/createSurvey' },
  { text: 'Send Survey', icon: <SendIcon />, route: '/sendSurvey' },
  { text: 'View Responses', icon: <ListAltIcon />, route: '/viewResponses' },
  { text: 'Analyze Results', icon: <AssessmentIcon />, route: '/analyzeResults' },
  { text: 'View Surveys', icon: <AssessmentIcon />, route: '/viewSurveys' }

];
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <BrowserRouter>
      <ThemeProvider theme={darkTheme}>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <CssBaseline />
          {/* Header */}
          <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                Survey System
              </Typography>
              {/* Icons on the top right */}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <SettingsIcon />
              </IconButton>
              <IconButton
                size="large"
                aria-label="display more actions"
                edge="end"
                color="inherit"
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>
                {/* Add more menu items here if needed */}
              </Menu>
            </Toolbar>
          </AppBar>
          {/* Sidebar */}
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
                {menuItems.map((item, index) => (
                  <ListItem button key={item.text} component={Link} to={item.route} style={{ textDecoration: 'none' }}>
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
          {/* Main Content */}
          <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: 'calc(100vh - 64px)' }}>
            <Toolbar />
            <Container>
              <Grid container spacing={3}>
                {/* Replace with your content */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    
                    <Routes>
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/createSurvey" element={<CreateSurveyPage />} />
          <Route path="/sendSurvey" element={<SendSurveyPage />} />
          <Route path="/viewResponses" element={<ViewResponsesPage />} />
          <Route path="/viewSurveys" element={<ViewSurvey/>} />

          {/* ... other routes ... */}
        </Routes>
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </Box>
          {/* Footer */}
          <Box sx={{ mt: 'auto', bgcolor: 'background.paper', p: 3 }} component="footer">
            <Typography variant="h6" align="center" gutterBottom>
            </Typography>
            <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              sx={{ width: 500, margin: 'auto' }}
            >
              <BottomNavigationAction label="Contact Us" icon={<CreateIcon />} />
              <BottomNavigationAction label="FAQs" icon={<ListAltIcon />} />
              <BottomNavigationAction label="Support" icon={<SendIcon />} />
            </BottomNavigation>
            <Typography variant="subtitle1" align="center" color="text.secondary" component="p">
              © 2024 Customer Survey Application, Inc. All rights reserved.
            </Typography>
          </Box>
        </Box>
       
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
