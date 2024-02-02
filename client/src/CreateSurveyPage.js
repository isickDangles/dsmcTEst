import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function CreateSurveyForm() {
  const [surveyTitle, setSurveyTitle] = React.useState('');
  const [surveyDescription, setSurveyDescription] = React.useState('');
  const [questions, setQuestions] = React.useState([]);

  const handleCreateSurvey = async () => {
    
    const surveyData = {
      surveyTitle,
      surveyDescription,
      questions,
    };

    try {
      const response = await fetch('/create-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Survey created:', result);
      // Additional logic on survey creation success
    } catch (error) {
      console.error('Error creating survey:', error);
    }
  };

  const handleSurveyTitleChange = (event) => {
    setSurveyTitle(event.target.value);
  };

  const handleSurveyDescriptionChange = (event) => {
    setSurveyDescription(event.target.value);
  };

  // Function to add a new question
  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', questionType: '', isRequired: false }]);
  };

  // Function to update a specific question
  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  // Function to remove a specific question
  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  return (
    <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '75ch' } }} noValidate autoComplete="off">
      <TextField
        label="Survey Name"
        variant="outlined"
        value={surveyTitle}
        onChange={handleSurveyTitleChange}
      />

      <TextField
        label="Survey Description"
        variant="outlined"
        multiline
        rows={4}
        value={surveyDescription}
        onChange={handleSurveyDescriptionChange}
      />

      {questions.map((question, index) => (
        <div key={index}>
          <TextField
            label="Question Text"
            variant="outlined"
            value={question.questionText}
            onChange={(e) => updateQuestion(index, 'questionText', e.target.value)}
          />
          <TextField
            label="Question Type"
            variant="outlined"
            value={question.questionType}
            onChange={(e) => updateQuestion(index, 'questionType', e.target.value)}
          />
          <Tooltip title="Check if the question is required" placement="right">
            <FormControl>
              <label>
                Is Required:
                <input
                  type="checkbox"
                  checked={question.isRequired}
                  onChange={(e) => updateQuestion(index, 'isRequired', e.target.checked)}
                />
              </label>
            </FormControl>
          </Tooltip>
          <Button variant="contained" color="secondary" onClick={() => removeQuestion(index)}>
            Remove Question
          </Button>
        </div>
      ))}

      <Button variant="contained" color="primary" onClick={addQuestion}>
        Add Question
      </Button>

      <Button variant="contained" color="primary" onClick={handleCreateSurvey}>
        Create Survey
      </Button>
    </Box>
  );
}
