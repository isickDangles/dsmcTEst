import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import { styled, useTheme } from '@mui/material/styles';
import { Card, CardActionArea, CardContent, Typography, Grid, Container } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import BuildIcon from '@mui/icons-material/Build';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const theme = useTheme();

    const pages = [
        { title: 'Create Survey', path: '/createSurvey', icon: CreateIcon, color: theme.palette.primary.main },
        { title: 'Manage Survey', path: '/manageSurvey', icon: ManageSearchIcon, color: theme.palette.secondary.main },
        { title: 'Survey Status', path: '/surveyHistory', icon: HistoryToggleOffIcon, color: theme.palette.info.main },
        { title: 'Admin Tools', path: '/adminTools', icon: BuildIcon, color: theme.palette.warning.main },
        { title: 'Analyze Results', path: '/analyzeResults', icon: AnalyticsIcon, color: theme.palette.success.main },
        { title: 'View Results', path: '/viewResults', icon: VisibilityIcon, color: theme.palette.error.main },
    ];

    const BackgroundImageCard = styled(Card)(({ color }) => ({
        height: '180px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: color, // Dynamic color based on the page
        color: '#fff',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
        },
    }));

    return (
        <Container>
            <Typography variant="h4" gutterBottom align="center" style={{ color: '#fff', fontWeight: 'bold', marginBottom: '20px' }}>
                Admin Dashboard
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {pages.map((page, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                        <BackgroundImageCard color={page.color}>
                            <CardActionArea onClick={() => navigate(page.path)} style={{ height: '100%' }}>
                                <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    {React.createElement(page.icon, { style: { fontSize: 60, color: 'rgba(255, 255, 255, 0.87)' }, color: "inherit" })}
                                    <Typography variant="h5" component="div" style={{ fontWeight: 'bold', marginTop: '20px' }}>
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
