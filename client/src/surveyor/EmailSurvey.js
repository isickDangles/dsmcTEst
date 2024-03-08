import React, {useState} from 'react';

import {Button} from '@mui/material'


 
const EmailSurveyPage = () => {
    const labelStyle = {
      fontSize: '20px', 
      fontWeight: 'bold',
    };
    // Define a state variable for the input value
    const [RecipientValue, setRecipientValue] = useState('');
    const maxRecipientLimit = 255;
    // Event handler to update the state when the input changes
    const handleRecipientChange = (event) => {
      if (event.target.value.length <= maxRecipientLimit){ 
      setRecipientValue(event.target.value);
      }
    };
    const [SubjectValue, setSubjectValue] = useState('');
    const maxSubjectLimit = 255;
    const handleSubjectChange = (event) => {
      if (event.target.value.length <= maxSubjectLimit){
        setSubjectValue(event.target.value);
      }
    };
    const [MessageValue, setMessageValue] = useState('');
    const maxMessageLimit = 2000;
    const handleMessageChange = (event) => {
      if (event.target.value.length <= maxMessageLimit){
        setMessageValue(event.target.value);
      }
    };
    const handleEmailClick = () => {
      const emailSubject = SubjectValue;
      const emailAddress = RecipientValue;
      const emailMessage = MessageValue;

    // Replace spaces with %20 in the email message
    const formattedMessage = encodeURIComponent(emailMessage).replace(/%20/g, '%20');
  
      // Construct the mailto URL
      const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${formattedMessage}`;
  
      // Open default email client
      window.location.href = mailtoLink;
    };
    return (
        <div>
          <h2>Email Survey</h2>
          <div style = {{marginLeft: '250px', marginTop: '25px'}}>
          <label style={labelStyle}>Recipient:</label>
          </div>
          <div>
          <input
            type="email"
            value={RecipientValue}
            onChange={handleRecipientChange}
            maxLength={maxRecipientLimit}
            style={{
            flex:'self-center',
            background: 'white',
            border: 'gray-900',
            border: '1px solid #ccc',
            rounded: 'lg',
            focus: 'ring-primary-500',
            focus: 'border-primary-500',
            padding: '2.5px',
            fontSize: '16px',
            borderRadius: '4px',
            width: '500px',
            marginTop: '35px',
            marginLeft: '75px',
            }}
            required
            placeholder='username@email.com'         
          ></input>
          </div>
          <div style = {{marginLeft: '260px', marginTop: '45px'}}>
          <label style={labelStyle}>Subject:</label>
          </div>
          <div>
          <input
            type="text"
            value={SubjectValue}
            onChange={handleSubjectChange}
            maxLength={maxSubjectLimit}
            style={{
            flex:'self-center',
            background: 'white',
            border: 'gray-900',
            border: '1px solid #ccc',
            rounded: 'lg',
            focus: 'ring-primary-500',
            focus: 'border-primary-500',
            padding: '2.5px',
            fontSize: '16px',
            borderRadius: '4px',
            width: '500px',
            marginTop: '35px',
            marginLeft: '75px',
            }}
            required
            placeholder='Check out this cool survey...'           
          ></input>
          </div>
          <div style = {{marginLeft: '255px', marginTop: '55px'}}>
          <label style={labelStyle}>Message:</label>
          </div>
          <div>
          <textarea
            type="text"
            rows ='6'
            value={MessageValue}
            onChange={handleMessageChange}
            maxLength={maxMessageLimit}
            style={{
            flex:'self-center',
            background: 'white',
            border: 'gray-900',
            border: '1px solid #ccc',
            rounded: 'lg',
            focus: 'ring-primary-500',
            focus: 'border-primary-500',
            padding: '2.5px',
            fontSize: '16px',
            borderRadius: '4px',
            width: '600px',
            marginTop: '35px',
            marginLeft: '30px',
            }}
            required
            placeholder='Write a nice message...'           
          ></textarea>          
          </div>
          <Button
            onClick = {handleEmailClick}
            >
            Send mail
          </Button>
        </div>
      );
    };
export default EmailSurveyPage;