import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import { styled } from '@mui/material/styles';
import { Card, CardActionArea, CardContent, Typography, Grid, Container } from '@mui/material';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const pages = [
        { title: 'Create Survey', path: '/createSurvey' },
        { title: 'Manage Survey', path: '/manageSurvey' },
        { title: 'Survey Status', path: '/surveyHistory' },
        { title: 'Admin Tools', path: '/adminTools' },
        { title: 'Analyze Results', path: '/analyzeResults' },
        { title: 'View Results', path: '/viewResults' },
    ];

    const BackgroundImageCard = styled(Card)(({ theme }) => ({
        backgroundColor: '#424242',
        color: '#000',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url(${process.env.PUBLIC_URL}/Board.jpg)`, // Applies a dimming effect
        backgroundSize: '200% auto',
        backgroundPosition: 'center',
        '&:hover': {
            opacity: 0.9,
        },
    }));
    
    return (
        <Container>
            <Typography variant="h4" gutterBottom align="center" style={{ color: '#fff', fontWeight: 'bold' }}>
                Admin Dashboard
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {pages.map((page, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                        <BackgroundImageCard>
                            <CardActionArea onClick={() => navigate(page.path)} style={{ height: '100%' }}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold' }}>
                                        {page.title}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </BackgroundImageCard>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default AdminDashboard;

