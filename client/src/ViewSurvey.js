import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';


function ViewSurvey() {
  const [surveys, setSurveys] = useState([]);
  const [activeSurveyId, setActiveSurveyId] = useState(null); // Track the active survey

  const fetchSurveys = async () => {
    try {
      const response = await fetch('/get-surveys');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched data:", data); // Check what data you're receiving
      setSurveys(data.surveys); // Make sure your backend is structured to return { surveys: [...] }
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);
  // Function to toggle the active survey
  const toggleActiveSurvey = (surveyId) => {
    setActiveSurveyId(activeSurveyId === surveyId ? null : surveyId);
  };
  return (
    <div>
      <h1>Surveys</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {surveys.length > 0 ? (
          surveys.map((survey) => (
            <Card key={survey.id} style={{ margin: 10, width: 300 }}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {survey.title}
                </Typography>
                <Typography color="textSecondary">
                  {survey.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/survey/${survey.id}`}>
                  View/Edit Survey
                </Button>
              </CardActions>
            </Card>
          ))
        ) : (
          <p>No surveys found.</p>
        )}
      </div>
    </div>
  );
}

export default ViewSurvey;