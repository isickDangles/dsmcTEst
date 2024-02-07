import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';


export default function SurveyCreationPage() {
  const [surveyName, setSurveyName] = useState('');
  const [creatingQuestion, setCreatingQuestion] = useState(false);
  const [questionType, setQuestionType] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questionOptions, setQuestionOptions] = useState(['']); // Define questionOptions and its setter
  const [questions, setQuestions] = useState([]);
  const [surveyCreated, setSurveyCreated] = useState('');
  const [isSurveyComplete, setIsSurveyComplete] = useState(false);


  const handleSurveyNameChange = (event) => {
    setSurveyName(event.target.value);
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, qIndex) => qIndex !== index)); //Delete  
  }
  const handleCreateSurvey = () => {
    setSurveyCreated(true);
  };

  const handleCreateQuestionClick = () => {
    setCreatingQuestion(true);
  };

  const handleQuestionTypeChange = (event) => {
    setQuestionType(event.target.value);
  };

  const handleQuestionTextChange = (event) => {
    setQuestionText(event.target.value);
  };

  const handleOptionChange = (index, event) => {
    const updatedOptions = questionOptions.map((option, i) => {
      if (i === index) {
        return event.target.value;
      }
      return option;
    });
    setQuestionOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setQuestionOptions([...questionOptions, '']);
  };

  const handleCompleteQuestion = () => {
    if (questionType === 'multipleChoice' && questionOptions.some(option => option === '')) {
      alert('Please fill in all options for the multiple choice question.');
      return;
    }

    const newQuestion = {
      type: questionType,
      text: questionText,
      options: questionType === 'multipleChoice' ? questionOptions :
        questionType === 'likertScale' ? Array.from({ length: 10 }, (_, i) => (i + 1).toString()) :
          undefined,

    };
    setQuestions([...questions, newQuestion]);
    setCreatingQuestion(false);
    setQuestionType('');
    setQuestionText('');
    setQuestionOptions(['', '']);
  };

  /*
  const handleSubmitSurvey = () => {
    if (questions.length === 0) {
      alert('Please add at least one question before completing the survey.');
      return;
    }
    setSurveyCreated(false);
    setIsSurveyComplete(true);
  };
  */

  const handleSubmitSurvey = async () => {
    const surveyData = {
      surveyTitle: surveyName, // Using the surveyName state variable
      surveyDescription: "Your survey description here", // Add a description if needed or use a state variable
      questions: questions, // Using the questions state variable
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
      // Here you can update your component's state to reflect the successful creation
      // For example, you might want to clear the form, or display a message, etc.
      alert('Survey successfully created!');
      // Reset or update state as necessary
      setSurveyName('');
      setQuestions([]);
      setIsSurveyComplete(true); // If you're using this to show/hide the survey form
    } catch (error) {
      console.error('Error creating survey:', error);
      // Handle the error, for example, by displaying a notification to the user
      alert('Failed to create survey.');
    }
  };


  return (
    <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1 }, '& .MuiButton-root': { m: 1 }, maxWidth: '500px', margin: 'auto' }}
      noValidate
      autoComplete="off"
    >
      {!surveyCreated && !isSurveyComplete && (
        <>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Survey Name"
            variant="outlined"
            value={surveyName}
            onChange={handleSurveyNameChange}
          />
          <Button variant="contained" color="primary" onClick={handleCreateSurvey}>
            Create Survey
          </Button>
        </>
      )}

      {surveyCreated && surveyName && (
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <h2>{surveyName}</h2>
        </Box>
      )}
      {/* This is to display the title of the survey at the top as the user makes it */}


      {surveyCreated && (
        <>
          {questions.map((question, index) => (
            <Box key={index} sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Delete">
                <IconButton aria-label="delete" size="small" onClick={() => handleDeleteQuestion(index)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <FormControl fullWidth sx={{ mr: 2 }}>
                <TextField
                  label={`Question ${index + 1}`}
                  variant="outlined"
                  value={question.text}
                  InputProps={{ readOnly: true }}
                />
              </FormControl>
              <Box sx={{ fontWeight: 'bold' }}>
                {question.type === 'trueFalse' ? 'True/False' :
                  question.type === 'multipleChoice' ? 'Multiple Choice' :
                    question.type === 'likertScale' ? 'Likert Scale (1-10)' :
                      'Unknown Type'}
              </Box>
            </Box>
          ))}

          {!creatingQuestion && (
            <Box sx={{ textAlign: 'center', width: '100%' }}>
              <Button variant="contained" onClick={handleCreateQuestionClick}>
                Add New Question
              </Button>
            </Box>
          )}

          {creatingQuestion && (
            <Box sx={{ marginTop: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="question-type-label">Question Type</InputLabel>
                <Select
                  labelId="question-type-label"
                  id="question-type-select"
                  value={questionType}
                  label="Question Type"
                  onChange={handleQuestionTypeChange}
                >
                  <MenuItem value="trueFalse">True/False</MenuItem>
                  <MenuItem value="multipleChoice">Multiple Choice</MenuItem>
                  <MenuItem value="likertScale">Likert Scale (1-7)</MenuItem>
                  {/* ... other question types */}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label={`Question ${questions.length + 1}`}
                variant="outlined"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                sx={{ marginTop: 2 }}
              />
              {questionType === 'multipleChoice' && questionOptions.map((option, index) => (
                <TextField
                  key={index}
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e)}
                  margin="normal"
                />
              ))}
              {questionType === 'multipleChoice' && (
                <Button onClick={handleAddOption} variant="contained" sx={{ mt: 1 }}>
                  Add Option
                </Button>
              )}


              {/*This is space for more question types*/}

              <Button onClick={handleCompleteQuestion} variant="contained" sx={{ mt: 2 }}>
                Save Question
              </Button>
            </Box>
          )}
        </>
      )}

      {isSurveyComplete && (
        <>
          <h2>{surveyName}</h2>
          {questions.map((question, index) => (
            <Box key={index}>
              <FormControl component="fieldset" sx={{ marginTop: 2 }}>
                <FormLabel component="legend">{`Question ${index + 1}: ${question.text}`}</FormLabel>
                {question.type === 'multipleChoice' ? (
                  <RadioGroup row name={`question_${index}`}>
                    {question.options.map((option, optionIndex) => (
                      <FormControlLabel
                        key={optionIndex}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                ) : (
                  <RadioGroup row name={`question_${index}`}>
                    <FormControlLabel value="true" control={<Radio />} label="True" />
                    <FormControlLabel value="false" control={<Radio />} label="False" />
                  </RadioGroup>
                )}
              </FormControl>
            </Box>
          ))}
          
        </>
      )}
      <Button variant="contained" onClick={handleSubmitSurvey} color="primary" sx={{ marginTop: 2 }}>
            Submit Answers
          </Button>
    </Box>
    
  );
}