import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Container,
  Grid,
  Button,
} from '@mui/material';
import axios from 'axios';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

function SurveyStatus() {
  const [surveys, setSurveys] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get('/api/surveys');
        setSurveys(response.data);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };
    fetchSurveys();
  }, []);

  const calculateDateDifference = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

    if (now < start) {
      const daysUntilStart = Math.round((start - now) / oneDay);
      return `${daysUntilStart} day(s) until open`;
    } else if (now > end) {
      const daysSinceEnd = Math.round((now - end) / oneDay);
      return `${daysSinceEnd} day(s) since close`;
    } else {
      const daysUntilEnd = Math.round((end - now) / oneDay);
      return `${daysUntilEnd} day(s) until close`;
    }
  };

  return (
    <Container maxWidth="xl" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" gutterBottom style={{ textAlign: 'center', marginBottom: '20px' }}>
        Survey Status Portal
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {surveys.map((survey) => {
          const statusText = calculateDateDifference(survey.start_date, survey.end_date);
          return (
            <Grid item xs={12} md={4} key={survey.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {survey.title}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Status: <span style={{ color: statusText.includes('since') ? 'red' : statusText.includes('until open') ? 'grey' : 'green' }}>
                      {statusText}
                    </span>
                  </Typography>
                  <Typography variant="body2">
                    {survey.description}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <Button variant="contained" color="primary" startIcon={<PreviewIcon />} onClick={() => navigate(`/preview-survey/${survey.id}`)} style={{ cursor: 'pointer' }}>
                    View
                  </Button>
                  {/* Implement Edit and Delete similarly, if needed */}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

export default SurveyStatus;
