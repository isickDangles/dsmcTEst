import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Container,
  Grid,
  Button,
  useTheme,
  Box
} from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';

function SurveyStatus() {
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    async function fetchSurveys() {
      try {
        const { data } = await axios.get('/api/surveys');
        setSurveys(data);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    }
    fetchSurveys();
  }, []);

  const calculateStatusAndTime = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const oneHour = 60 * 60 * 1000; // milliseconds in an hour
    const oneDay = 24 * oneHour; // milliseconds in a day

    let difference, unit;
    if (now < start) {
      difference = start - now;
      unit = difference < oneDay ? 'hour(s)' : 'day(s)';
      difference = unit === 'day(s)' ? Math.round(difference / oneDay) : Math.round(difference / oneHour);
      return `Idle - Opens in ${difference} ${unit}`;
    } else if (now >= start && now <= end) {
      difference = end - now;
      unit = difference < oneDay ? 'hour(s)' : 'day(s)';
      difference = unit === 'day(s)' ? Math.round(difference / oneDay) : Math.round(difference / oneHour);
      return `Open - Closes in ${difference} ${unit}`;
    } else {
      difference = now - end;
      unit = difference < oneDay ? 'hour(s)' : 'day(s)';
      difference = unit === 'day(s)' ? Math.round(difference / oneDay) : Math.round(difference / oneHour);
      return `Closed - Closed ${difference} ${unit} ago`;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Survey Status Portal
      </Typography>

      <Grid container spacing={2} >
        {surveys.map((survey) => (
          <Grid item xs={12} md={4} key={survey.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardContent>
                <Typography variant="h5">
                  {survey.title}
                </Typography>
                <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                  <Box component="span" sx={{ color: getStatusColor(survey.start_date, survey.end_date, theme) }}>
                    {calculateStatusAndTime(survey.start_date, survey.end_date)}
                  </Box>
                </Typography>
                <Typography variant="body2">
                  {survey.description}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PreviewIcon />}
                  onClick={() => navigate(`/preview-survey/${survey.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  View
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );

  function getStatusColor(startDate, endDate, theme) {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return theme.palette.grey[500]; // Idle
    } else if (now >= start && now <= end) {
      return theme.palette.success.main; // Open
    } else {
      return theme.palette.error.main; // Closed
    }
  }
}

export default SurveyStatus;
