import React, { useState, useEffect , useContext} from 'react';
import { Card, CardContent, Typography, Container, Grid, Button } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import SendIcon from '@mui/icons-material/Send';
import { Router, Route, useNavigate } from 'react-router-dom';
import EmailSurveyPage from './EmailSurvey';

function SendSurvey() {
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('/api/surveys'); // Adjust the URL to your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSurveys(data); // Assuming the API returns an array of surveys
        console.log(surveys);
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
      {/* Dynamic Survey Cards */}
      <Grid container spacing={2} justifyContent="center">
        {surveys.length > 0 ? (
          surveys.map((survey) => (
            <Grid item key={survey.surveytemplateid} xs={12} lg={10}>
              
              
              <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 80 }}>
                <CardContent>
                  <Typography variant="h5">
                    {survey.title} {/* Use title instead of name */}
                  </Typography>
                </CardContent>
                <CardContent>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<PreviewIcon />} 
                    onClick={() => navigate(`/preview-survey/${survey.surveytemplateid}`)} // Correctly accessing surveyTemplateID
                    style={{ cursor: 'pointer' }}
                  >
                    View
                  </Button>
                  <Button variant="contained" color="secondary" startIcon={<SendIcon />} style={{ marginLeft: '10px' }}
                    onClick={() => navigate(`/email-survey/${survey.surveytemplateid}`)} 
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

export default SendSurvey;
