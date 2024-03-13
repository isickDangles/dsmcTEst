import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, List, ListItem, ListItemText, IconButton, Select, Autocomplete, FormControl } from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import ErrorMessage from '../components/ErrorMessage';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';


const EmailSurveyPage = () => {
  const theme = useTheme();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [defaultMessage, setDefaultMessage] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [newRecipient, setNewRecipient] = useState('');

  const [emailError, setEmailError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadedDefaultMessage = localStorage.getItem('defaultMessage') || '';
    setDefaultMessage(loadedDefaultMessage);
    setMessage(loadedDefaultMessage);
  }, []);

  const handleSaveDefaultMessage = () => {
    localStorage.setItem('defaultMessage', defaultMessage);
  };

  const handleAddRecipient = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email pattern for validation
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
    const mailtoLink = `mailto:${recipients.join(';')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}%0A%0A%0APlease%20complete%20this%20survey%0A%0Ahttp://localhost:3000/fill-survey/5`;
    window.location.href = mailtoLink;
  };



  const respondents = [
    {label: 'daniels214@marshall.edu',},
    {label: 'brent.maynard@marshall.edu'},
    {label: 'miller1399@marshall.edu'},

  ];

  const [recipientValue, setRecipientValue] = React.useState(respondents[0]);
  const [inputValue, setInputValue] = React.useState(respondents[0]);


  return (
    <Container maxWidth="xl" sx={{ mt: 4, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', gap: 4 }}>
      {/* Message Template Section */}
      <Paper elevation={3} sx={{ p: 2, width: '30%', mr: 2 }}>
        <Typography variant="h6" gutterBottom>
          Message Template
        </Typography>
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
          value={defaultMessage}
          onChange={(e) => setDefaultMessage(e.target.value)}
          placeholder="Set a default message..."
        />
        <Button variant="contained" onClick={handleSaveDefaultMessage} sx={{ mt: 1 }}>
          Save as Default
        </Button>
      </Paper>

      {/* Email Survey Section */}
      <Box sx={{ flex: 2, minWidth: '250px' }}>
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
          onChange={(e) => setMessage(e.target.value)} // Corrected to update `message`
          placeholder="Write your survey message..."
        />
        <Button variant="contained" onClick={handleSendEmail} sx={{ mt: 1 }}>
          Open in Email Client
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 2, flex: 1, minWidth: '250px' }}>
        <Typography variant="h6" gutterBottom>
          Manage Respondents
        </Typography>
        <Autocomplete
        value={recipientValue}
        onChange={(event) => setNewRecipient(event.target.value)}
        inputValue={inputValue}
        onInputChange={(e) => setNewRecipient(e.target.value)}
          id="respondent-auto"
        options={respondents}
        sx={{ width: 220 }}
        renderInput={(params) => <TextField {...params} label="Respondent" />}
        />
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
      <ErrorMessage open={emailError} message={errorMessage} onClose={() => setEmailError(false)} />

    </Container>
  );
};

export default EmailSurveyPage;
