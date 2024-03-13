import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function ViewResults() {
  const [responses, setResponses] = useState([]);

  const translateLikertResponse = (response, questionType) => {
    const likertScale = {
      '1': 'Strongly Disagree',
      '2': 'Disagree',
      '3': 'Neutral',
      '4': 'Agree',
      '5': 'Strongly Agree',
    };
  
    return questionType === "Likert Scale" ? likertScale[response] || response : response;
  };
  
  useEffect(() => {
    const fetchResponses = async () => {
      const response = await fetch('/api/survey-responses');
      if (response.ok) {
        const data = await response.json();
        setResponses(data);
      } else {
        console.error('Failed to fetch responses');
      }
    };

    fetchResponses();
  }, []);

  return (
    <Container maxWidth="xl" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        All Survey Responses
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="survey responses table">
          <TableHead>
            <TableRow>
              <TableCell>Question Text</TableCell>
              <TableCell align="center">Question Type</TableCell>
              <TableCell align="right">Response</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {responses.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.question}
                </TableCell>
                <TableCell align="center">{row.question_type}</TableCell>
                <TableCell align="right">{translateLikertResponse(row.response, row.question_type)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default ViewResults;
