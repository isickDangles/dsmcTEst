import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useTheme,
  FormControl,
  Select,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorMessage from '../components/ErrorMessage';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';


const EmailSurveyPage = () => {
  const theme = useTheme();
  const { templateId } = useParams(); 
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [defaultMessage, setDefaultMessage] = useState('');
  const [isDefaultMessage, setIsDefaultMessage] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [newRecipient, setNewRecipient] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [organizationName, setOrganizationName] = useState('');



  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
  };
  useEffect(() => {
    const loadedDefaultMessage = localStorage.getItem('defaultMessage') || '';
    setDefaultMessage(loadedDefaultMessage);
    setMessage(loadedDefaultMessage);
    setIsDefaultMessage(loadedDefaultMessage !== '');
  }, []);

  const handleSaveDefaultMessage = () => {
    localStorage.setItem('defaultMessage', message);
    setDefaultMessage(message);
    setIsDefaultMessage(true);
  };

  const handleAddRecipient = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newRecipient)) {
      setEmailError(true);
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!recipients.includes(newRecipient)) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient('');
    }

    setEmailError(false);
  };

  const handleRemoveRecipient = (email) => {
    setRecipients(recipients.filter((recipient) => recipient !== email));
  };

  const handleSendEmail = () => {
    handleSubmitSurvey();
    const mailtoLink = `mailto:${recipients.join(';')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}%0A%0A%0APlease%20complete%20this%20survey%0A%0Ahttp://localhost:3000/fill-survey/5`;
    window.open(mailtoLink, '_blank');
};

  const handleAddOrganization = () => {
    setOrganizationName(organizationName)
  }
  const handleAddProject = () => {
    setProjectName(projectName)
  }

  const handleSubmitSurvey = async () => {
    try {
      // Create organization
      const orgResponse = await fetch('/api/create-organization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: organizationName }),
      });
      const orgData = await orgResponse.json();
  
      // Create project
      const projResponse = await fetch('/api/create-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName }),
      });
      const projData = await projResponse.json();
  
      const surveyData = {
        surveyTemplateId: parseInt(templateId, 10),
        surveyorId: 1, 
        organizationId: orgData.organizationId,
        projectId: projData.projectId,
        surveyorRoleId: null, // Not sure what this is...
        startDate: startDate,
        endDate: endDate,
      };
  
      const surveyResponse = await fetch('/api/create-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData),
      });
  
      if (surveyResponse.ok) {
        console.log('Survey created successfully');
      } else {
        console.error('Failed to create survey');
      }
    } catch (error) {
      console.error('Error creating survey or dependencies:', error);
    }
  };
  



  return (

    <Container maxWidth="xl" sx={{ mt: 4, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', gap: 4 }}>
      {/* Email Survey Section */}
      <Box sx={{ flex: 2, minWidth: '250px', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Email Survey
        </Typography>
        <TextField
          fullWidth
          label="Subject"
          variant="outlined"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter survey subject"
          margin="normal"
        />

        <Typography variant="h6" gutterBottom>
          Date Range
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            sx={{ width: '50%' }}
          />
          <TextField
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            sx={{ width: '50%' }}
          />
        </Box>

        <TextareaAutosize
          minRows={8}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '1rem',
            borderRadius: '4px',
            borderColor: theme.palette.mode === 'light' ? '#ccc' : 'rgba(255,255,255,0.23)',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            resize: 'vertical'
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your survey message..."
        />

        {/* Button Section */}
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
          {/* Save as Default Button */}
          {message !== defaultMessage && (
            <Button variant="contained" onClick={handleSaveDefaultMessage} sx={{ mr: 2 }}>
              Save as Default
            </Button>
          )}

          {/* Open in Email Client Button */}
          <Button variant="contained" onClick={handleSendEmail}>
            Send Survey
          </Button>
        </Box>
      </Box>

      {/* Manage Respondents Section */}
      <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: '250px' }}>
        <Typography variant="h6" gutterBottom>
          Manage Respondents
        </Typography>
        <FormControl fullWidth>
        <InputLabel id="respondent-simple-select">Respondent</InputLabel>
        <Select
          labelId="respondent-simple-select"
          id="respondent-select"
          value={newRecipient}
          label="Respondent"
          onChange={(e) => setNewRecipient(e.target.value)}       
        >
          <MenuItem value={'daniels214@marshall.edu'}>daniels214@marshall.edu</MenuItem>
          <MenuItem value={'brent.maynard@marshall.edu'}>brent.maynard@marshall.edu</MenuItem>
          <MenuItem value={'miller1399@marshall.edu'}>miller1399@marshall.edu</MenuItem>
        </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Add Respondent Email"
          variant="outlined"
          value={newRecipient}
          onChange={(e) => setNewRecipient(e.target.value)}
          margin="normal"
          placeholder="respondent@example.com"
        />
        <Button variant="contained" onClick={handleAddRecipient} sx={{ mt: 1 }}>
          Add Respondent
        </Button>
        <List sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
          {recipients.map((email, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveRecipient(email)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={email} />
            </ListItem>
          ))}
        </List>
      </Paper>
            
      <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: '250px' }}>
        <Typography variant="h6" gutterBottom>
          Manage Organization
        </Typography>
      <TextField
          fullWidth
          label="Add Organization"
          variant="outlined"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          margin="normal"
          placeholder="Google"
        />
        <Button variant="contained" onClick={handleAddOrganization} sx={{ mt: 1 }}>
          Add Organization
        </Button>
        </Paper>  <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: '250px' }}>
        <Typography variant="h6" gutterBottom>
          Manage Project
        </Typography>
      <TextField
          fullWidth
          label="Add Project"
          variant="outlined"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          margin="normal"
          placeholder="Google"
        />
        <Button variant="contained" onClick={handleAddProject} sx={{ mt: 1 }}>
          Add Project
        </Button>
        </Paper>









      <ErrorMessage open={emailError} message={errorMessage} onClose={() => setEmailError(false)} />
    </Container>
  );
}

export default EmailSurveyPage;
