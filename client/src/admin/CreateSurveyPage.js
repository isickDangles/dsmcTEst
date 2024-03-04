import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Paper,
  DialogTitle,
  Fab,
  DialogContentText
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import ErrorMessage from '../components/ErrorMessage'

export default function SurveyCreationPage() {
  const [surveyName, setSurveyName] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');

  const [questions, setQuestions] = useState([]);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(-1);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: '',
    choices: [''],
  });
  const [open, setOpen] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [error, setError] = useState({ open: false, message: '' });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmSubmit = () => {
    console.log("Survey submitted:", { surveyName, questions });
    setOpenConfirmDialog(false);
  };
  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingQuestionIndex(-1);
    setCurrentQuestion({ text: '', type: '', choices: [''] }); // Reset
  };

  const handleSurveyNameChange = (event) => {
    setSurveyName(event.target.value);
  };

  const handleCurrentQuestionChange = (prop, value) => {
    setCurrentQuestion({ ...currentQuestion, [prop]: value });
  };

  const handleAddChoice = () => {
    setCurrentQuestion({
      ...currentQuestion,
      choices: [...currentQuestion.choices, ''],
    });
  };

  const handleCancelEditing = () => {
    setCurrentQuestion({ text: '', type: '', choices: [''] }); {
      questions.map((question, index) => (
        <Paper key={index} elevation={2} sx={{ p: 2, mt: 2, position: 'relative' }}>
          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
            Question {index + 1}
          </Typography>
          <Typography variant="h6" component="div" sx={{ mt: 1, mb: 1 }}>
            {question.text}
          </Typography>
          <Typography variant="body2" component="div" sx={{ mb: 2 }}>
            Type: {toFriendlyText(question.type)}
          </Typography>
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <IconButton onClick={() => handleEditQuestion(index)} sx={{ color: 'white' }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteQuestion(index)} sx={{ color: 'white' }}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Paper>
      ))
    }
    setEditingQuestionIndex(-1);
  };


  const handleChoiceChange = (index, event) => {
    const newChoices = currentQuestion.choices.map((choice, i) =>
      i === index ? event.target.value : choice
    );
    setCurrentQuestion({ ...currentQuestion, choices: newChoices });
  };

  const handleRemoveChoice = (index) => {
    const newChoices = currentQuestion.choices.filter((_, i) => i !== index);
    setCurrentQuestion({ ...currentQuestion, choices: newChoices });
  };
  const handleAddOrEditQuestion = () => {
    if (!validateQuestion(currentQuestion)) {
      return;
    }
    if (editingQuestionIndex >= 0) {
      const updatedQuestions = questions.map((question, index) =>
        index === editingQuestionIndex ? currentQuestion : question
      );
      setQuestions(updatedQuestions);
    } else {
      setQuestions([...questions, currentQuestion]);
    }
    handleCloseDialog();
  };

  const handleEditQuestion = (index) => {
    setEditingQuestionIndex(index);
    setCurrentQuestion(questions[index]);
    handleOpenDialog();
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(updatedQuestions);
  };
  const toFriendlyText = (text) => {
    return text
      .replace(/([A-Z])/g, ' $1') // insert a space before all caps
      .replace(/^./, (str) => str.toUpperCase()); // capitalize the first letter
  };

  const handleSubmitSurvey = async () => {
    if (!validateSurvey()) {
      return;
    }
    handleCloseConfirmDialog();

    // Use surveyDescription or default to "DSMC Survey" if it's empty
    const finalSurveyDescription = surveyDescription || "DSMC Survey";

    const convertedQuestions = questions.map(question => ({
      text: question.text,
      questionType: parseInt(question.type, 10),
      choices: question.choices || [],
    }));

    const surveyData = {
      surveyTitle: surveyName,
      surveyDescription: finalSurveyDescription, // Use the finalSurveyDescription here
      questions: convertedQuestions,
    };

    try {
      const response = await fetch('/create-survey-template', {
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
      setSurveyName('');
      setSurveyDescription(''); // Reset survey description
      setQuestions([]);
    } catch (error) {
      console.error('Error creating survey:', error);
    }
  };

  const validateQuestion = (question) => {
    if (!question.text) {
      setError({ open: true, message: 'Question text cannot be empty.' });
      return false;
    }
    if (!question.type) {
      setError({ open: true, message: 'Question type cannot be empty.' });
      return false;
    }
    if (question.type === '2') {
      if (question.choices.length === 0) {
        setError({ open: true, message: 'Multiple choice questions must have at least one choice.' });
        return false;
      }
      if (question.choices.some(choice => !choice)) {
        setError({ open: true, message: 'Choice text cannot be empty.' });
        return false;
      }
    }
    return true;
  };

  const validateSurvey = () => {
    if (!surveyName) {
      setError({ open: true, message: 'Survey name cannot be empty.' });
      return false;
    }
    if (questions.length === 0) {
      setError({ open: true, message: 'There are no questions in this survey. Be sure to add questions before submitting.' });
      return false;
    }
    if (!questions.every(validateQuestion)) {
      // Note: validateQuestion will set the appropriate error message.
      return false;
    }
    return true;
  };


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container component="main" sx={{ mt: 4, mb: 4, position: 'relative' }}>
        <Typography variant="h4" gutterBottom>
          Create Survey
        </Typography>
        <TextField
          fullWidth
          label="Survey Name"
          variant="outlined"
          value={surveyName}
          onChange={handleSurveyNameChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Survey Description (Optional)"
          variant="outlined"
          value={surveyDescription}
          onChange={(e) => setSurveyDescription(e.target.value)}
          margin="normal"
          placeholder="DSMC Survey" // Optional: provide a placeholder
        />

        {questions.map((question, index) => (
          <Paper key={index} elevation={2} sx={{ p: 2, mt: 2, position: 'relative' }}>
            <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
              Question {index + 1}
            </Typography>
            <Typography variant="h6" component="div" sx={{ mt: 1, mb: 1 }}>
              {question.text}
            </Typography>
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <IconButton onClick={() => handleEditQuestion(index)} sx={{ color: 'white' }}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteQuestion(index)} sx={{ color: 'white' }}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}

        <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6">
            {editingQuestionIndex >= 0 ? `Edit Question ${editingQuestionIndex + 1}` : 'Add New Question'}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={currentQuestion.required || false}
                onChange={(e) => handleCurrentQuestionChange('required', e.target.checked)}
                name="required"
              />
            }
            label="Required"
          />
          <TextField
            fullWidth
            label="Question Text"
            variant="outlined"
            value={currentQuestion.text}
            onChange={(e) => handleCurrentQuestionChange('text', e.target.value)}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Question Type</InputLabel>
            <Select
              value={currentQuestion.type}
              label="Question Type"
              onChange={(e) => handleCurrentQuestionChange('type', e.target.value)}
            >
              <MenuItem value="3">True/False</MenuItem>
              <MenuItem value="2">Multiple Choice</MenuItem>
              <MenuItem value="1">Likert Scale</MenuItem>
              <MenuItem value="4">Short Answer</MenuItem>
            </Select>
          </FormControl>

          {currentQuestion.type === '2' &&
            currentQuestion.choices.map((choice, index) => (
              <Box key={index} display="flex" alignItems="center" mt={2}>
                <TextField
                  fullWidth
                  label={`Choice ${index + 1}`}
                  value={choice}
                  onChange={(e) => handleChoiceChange(index, e)}
                  sx={{ mr: 1 }}
                />
                <IconButton onClick={() => handleRemoveChoice(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          {currentQuestion.type === '2' && (
            <Button onClick={handleAddChoice} variant="outlined" startIcon={<AddIcon />} sx={{ mt: 2 }}>
              Add Choice
            </Button>
          )}

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleCancelEditing} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleAddOrEditQuestion} color="primary" startIcon={<CheckIcon />}>
              {editingQuestionIndex >= 0 ? 'Update Question' : 'Add Question'}
            </Button>
          </Box>
        </Paper>

        {/* Footer Button */}
        <Box sx={{ position: 'fixed', bottom: 16, left: 0, right: 0, textAlign: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleOpenConfirmDialog}>
            Submit Survey
          </Button>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
          <DialogTitle>{"Submit Survey"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to submit this survey?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmitSurvey} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <ErrorMessage open={error.open} message={error.message} onClose={() => setError({ ...error, open: false })} />


      </Container>



    </ThemeProvider>


  );
}  