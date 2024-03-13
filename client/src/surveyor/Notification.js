import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, CardContent, Card, Button } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';

function Notification() {
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('/api/surveys');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSurveys(data); // Assuming the API returns an array of surveys
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };

    fetchSurveys();
  }, []);

  return (
    <Container maxWidth="xl" style={{ marginTop: '2rem', textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Notification
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {surveys.length > 0 ? (
          surveys.map((survey) => (
            <Grid item key={survey.id} xs={12} lg={10}>
              <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 80 }}>
                <CardContent>
                  <Typography variant="h5">
                    {survey.title} {/* Now using the correct survey property */}
                  </Typography>
                </CardContent>
                <CardContent>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PreviewIcon />}
                    onClick={() => navigate(`/preview-survey/${survey.id}`)} // Navigate using survey ID
                    style={{ cursor: 'pointer' }}
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<SendIcon />}
                    style={{ marginLeft: '10px' }}
                    onClick={() => navigate(`/email-notification/${survey.id}`)} // Navigate using survey ID
                  >
                    Send
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" style={{ textAlign: 'center', width: '100%' }}>No surveys found.</Typography>
        )}
      </Grid>
    </Container>
  );
}

export default Notification;
