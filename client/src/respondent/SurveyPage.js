import React, { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  createTheme,
  ThemeProvider,
  Typography,
  CssBaseline,
  Card,
  CardContent,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';

const SurveyPage = () => {
  const { templateId } = useParams();
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [responses, setResponses] = useState({});


  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  const handleSurveySubmit = async () => {
    try {
      const response = await fetch(`/api/submit-survey/${templateId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses }),
      });
  
      if (!response.ok) {
        throw new Error('Survey submission failed');
      }
  
      console.log('Survey submitted successfully');
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
  };

  
  useEffect(() => {
    const fetchSurveyDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/survey-details/${templateId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch survey details');
        }
        const data = await response.json();

        if (data.length > 0) {
          setSurveyTitle(data[0].title);
          setSurveyDescription(data[0].description);
          setQuestions(data);
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSurveyDetails();
  }, [templateId]);

  const renderQuestion = (question) => {
    const choices = question.choices || [];
    const questionText = question.is_required ? `${question.question} *` : question.question;

    const questionTextStyle = {
      color: 'white',
      fontWeight: 'bold',
      marginBottom: '8px',
    };

    const likertLabels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];


    return (
      <Card sx={{ maxWidth: 600, mx: 'auto', my: 2 }}>
        <CardContent>
          <Typography style={questionTextStyle} variant="h5" component="div">
            {questionText}
          </Typography>
          {question.questiontype === 'Short Answer' ? (
            <TextField label="Your Answer" variant="outlined" fullWidth margin="normal" />
          ) : question.questiontype === 'Multiple Choice' ? (
            <FormControl component="fieldset">
              <RadioGroup>
                {choices.map((choice, index) => (
                  <FormControlLabel key={index} value={choice} control={<Radio />} label={choice} />
                ))}
              </RadioGroup>
            </FormControl>
          ) : question.questiontype === 'True or False' ? (
            <FormControl component="fieldset">
              <RadioGroup>
                <FormControlLabel value="True" control={<Radio />} label="True" />
                <FormControlLabel value="False" control={<Radio />} label="False" />
              </RadioGroup>
            </FormControl>
          ) : question.questiontype === 'Likert Scale' ? (
            <FormControl component="fieldset">
              <RadioGroup>
                {likertLabels.map((label, index) => (
                  <FormControlLabel key={index} value={String(index + 1)} control={<Radio />} label={label} />
                ))}
              </RadioGroup>
            </FormControl>
          ) : null}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return <div>Loading survey details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (

    <ThemeProvider theme={darkTheme}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>

        <CssBaseline />
        <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
              {surveyTitle}
            </Typography>
            <Typography variant="subtitle1" gutterBottom align="center">
              {surveyDescription}
            </Typography>
            {questions.map((question, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                {renderQuestion(question)}
              </Box>
            ))}
            <Typography variant="body2" align="center" color="textSecondary">
              * Questions marked with a * are required
            </Typography>
          </Box>
          <Button variant="contained" color="primary" onClick={handleSurveySubmit} sx={{ mt: 2, display: 'block', mx: 'auto' }}>
  Submit Survey
</Button>
<Button variant="contained" color="primary" onClick={() => navigate(`/respondent/dashboard`)}  sx={{ mt: 1, display: 'block', mx: 'auto' }}>
  Back
</Button>
        </Container>


      </div>
    </ThemeProvider>
  );
};

export default SurveyPage;
