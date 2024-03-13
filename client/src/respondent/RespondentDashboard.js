import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import { Grid, Card, CardActionArea, CardContent, Typography, Container } from '@mui/material';

const RespondentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('/api/surveys');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSurveys(data);
      } catch (error) {
        console.error('Error fetching surveys:', error);
      }
    };

    fetchSurveys();
  }, []); 

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Respondent Dashboard
      </Typography>
      <Grid container spacing={4} direction="column">
        {surveys.map((survey) => (
          <Grid item xs={12} key={survey.id}>
            <Card elevation={3}>
              <CardActionArea onClick={() => navigate(`/fill-survey/${survey.id}`)}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {survey.title}
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

export default RespondentDashboard;
