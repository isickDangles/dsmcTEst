import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import { Card, CardActionArea, CardContent, Typography, Grid, Container } from '@mui/material';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const pages = [
        { title: 'Create Survey', path: '/createSurvey' },
        { title: 'Manage Survey', path: '/manageSurvey' },
        { title: 'Survey History', path: '/surveyHistory' },
        { title: 'Admin Tools', path: '/adminTools' },
        { title: 'Analyze Results', path: '/analyzeResults' },
        { title: 'View Results', path: '/viewResults' },
    ];

    // Style adjustments
    const cardStyle = {
        backgroundColor: '#424242', // Dark grey, from MUI dark mode palette
        color: '#fff', // White text color for better contrast
        height: '150px', // Increased height for more presence
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom align="center" style={{ color: '#fff' }}>
                Admin Dashboard
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {pages.map((page, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                        <Card style={cardStyle}>
                            <CardActionArea onClick={() => navigate(page.path)} style={{ height: '100%' }}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {page.title}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default AdminDashboard;
