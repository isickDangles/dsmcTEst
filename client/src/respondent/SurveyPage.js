import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, createTheme, ThemeProvider } from '@mui/material';

const SurveyPage = () => {
  const { templateId } = useParams();
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

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

    switch (question.questiontype) {
      case 'Short Answer':
        return <TextField label="Your Answer" variant="outlined" fullWidth />;
        case 'Multiple Choice':
          return (
            <FormControl component="fieldset">
              <FormLabel component="legend">{question.questionText}</FormLabel>
              <RadioGroup>
                {choices.map((choice, index) => (
                  <FormControlLabel key={index} value={choice} control={<Radio />} label={choice} />
                ))}
              </RadioGroup>
            </FormControl>
          );
      case 'True or False':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{question.questionText}</FormLabel>
            <RadioGroup>
              <FormControlLabel value="True" control={<Radio />} label="True" />
              <FormControlLabel value="False" control={<Radio />} label="False" />
            </RadioGroup>
          </FormControl>
        );
      case 'Likert Scale':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{question.questionText}</FormLabel>
            <RadioGroup row>
              {[1, 2, 3, 4, 5].map((value) => (
                <FormControlLabel key={value} value={String(value)} control={<Radio />} label={String(value)} />
              ))}
            </RadioGroup>
          </FormControl>
        );
      default:
        return <p>Question type not supported.</p>;
    }
  };
  if (loading) {
    return <div>Loading survey details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ThemeProvider theme={darkTheme}>

    <div style={{ margin: '20px' }}>
      <h1>{surveyTitle}</h1>
      <p>{surveyDescription}</p>
      <form>
        {questions.map((question, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h3>{question.questiontext}</h3>
            {renderQuestion(question)}
          </div>
        ))}
        <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Submit Survey
        </Button>
      </form>
      
    </div>
    </ThemeProvider>
    
  );
};

export default SurveyPage;
