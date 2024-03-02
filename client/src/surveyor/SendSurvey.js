import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Container, Grid, Button } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import SendIcon from '@mui/icons-material/Send';

function SendSurvey() {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('/api/surveys'); // Adjust the URL to your actual API endpoint
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
    <Container maxWidth="xl" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" gutterBottom style={{ textAlign: 'center' }}>
        Survey Distribution Portal
      </Typography>
      {/* Static Test Block */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} lg={10}>
          <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 80, marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h5">
                Test Block - Static Content
              </Typography>
            </CardContent>
            <CardContent>
              <Button variant="contained" color="primary" startIcon={<PreviewIcon />}>
                View
              </Button>
              <Button variant="contained" color="secondary" startIcon={<SendIcon />} style={{ marginLeft: '10px' }}>
                Send
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Dynamic Survey Cards */}
      <Grid container spacing={2} justifyContent="center">
        {surveys.length > 0 ? (
          surveys.map((survey) => (
            survey.name && (
              <Grid item key={survey.id} xs={12} lg={10}>
                <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 80 }}>
                  <CardContent>
                    <Typography variant="h5">
                      {survey.name}
                    </Typography>
                  </CardContent>
                  <CardContent>
                    <Button variant="contained" color="primary" startIcon={<PreviewIcon />}>
                      View
                    </Button>
                    <Button variant="contained" color="secondary" startIcon={<SendIcon />} style={{ marginLeft: '10px' }}>
                      Send
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )
          ))
        ) : (
          <Typography variant="h6" style={{ textAlign: 'center', width: '100%' }}>No surveys found.</Typography>
        )}
      </Grid>
    </Container>
  );
}

export default SendSurvey;