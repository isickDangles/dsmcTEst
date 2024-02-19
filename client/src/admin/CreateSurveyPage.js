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
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

export default function SurveyCreationPage() {
  const [surveyName, setSurveyName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(-1);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: '',
    choices: [''],
  });
  const [open, setOpen] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

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
    handleCloseConfirmDialog();
    const convertedQuestions = questions.map(question => ({
      text: question.text,
      questionType: parseInt(question.type, 10),
      choices: question.choices || [],
      
    }));

    const surveyData = {
      surveyTitle: surveyName,
      surveyDescription: "Your survey description here",
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
      alert('Survey successfully created!'); //This is the drop down alert on the webpage, remove later
      setSurveyName('');
      setQuestions([]);
    } catch (error) {
      console.error('Error creating survey:', error);
      alert('Failed to create survey.');
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Grid container spacing={0}>
        <Grid item xs={1} sx={{ borderRight: '1px solid #666' }}>
         
        </Grid>
        <Grid item xs={10} sx={{ minHeight: '100vh' }}>
          <Container component="main" sx={{ mt: 4, mb: 4 }}>
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
            {
              questions.map((question, index) => (
                <Paper key={index} elevation={2} sx={{ p: 2, mt: 2, position: 'relative' }}>
                  <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                    Question {index + 1}
                  </Typography>
                  <Typography variant="h6" component="div" sx={{ mt: 1, mb: 1 }}>
                    {question.text}
                  </Typography>
                  <Typography variant="body2" component="div" sx={{ mb: 2 }}>
                    {toFriendlyText(question.type)}
                  </Typography>
                  <Typography variant="body2" component="div" sx={{ mb: 2 }}>
                    {question.required ? 'Required' : 'Not Required'}
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

            {/* Inline form for adding or editing questions */}
            <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6">{editingQuestionIndex >= 0 ? `Edit Question ${editingQuestionIndex + 1}` : 'Add New Question'}</Typography>
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

              {currentQuestion.type === '2' &&(
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
                ))
              )}
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
                  {editingQuestionIndex >= 0 ? 'Update Question' : 'Complete Question'}
                </Button>
              </Box>

            </Paper>
            <Box sx={{ position: 'absolute', bottom: 16, right: 16, textAlign: 'right' }}>
              <Button variant="contained" color="primary" onClick={handleOpenConfirmDialog}>
                Submit Survey
              </Button>
            </Box>
            <Dialog
              open={openConfirmDialog}
              onClose={handleCloseConfirmDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Submit Survey"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
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

          </Container>

        </Grid>
        <Grid item xs={1} sx={{ borderLeft: '1px solid #666' }}>
       
        </Grid>
      </Grid>

    </ThemeProvider>
  );
}  