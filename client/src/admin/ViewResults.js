import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button } from '@mui/material';
import { ArrowUpward, ArrowDownward, UnfoldMore } from '@mui/icons-material';

function ViewResults() {
  const [responses, setResponses] = useState([]);
  const [filter, setFilter] = useState({
    surveyName: '',
    questionText: '',
    questionType: '',
  });
  const filteredResponses = responses.filter((response) =>
    response.survey_name.toLowerCase().includes(filter.surveyName.toLowerCase()) &&
    response.question.toLowerCase().includes(filter.questionText.toLowerCase()) &&
    response.question_type.toLowerCase().includes(filter.questionType.toLowerCase())
  );

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const sortedResponses = React.useMemo(() => {
    let sortableItems = [...filteredResponses];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredResponses, sortConfig]);
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
    

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
  const convertToCSV = (data) => {
    const csvRows = [];
    // Headers
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));
    
    // Data rows
    for (const row of data) {
        const values = headers.map(header => {
            // Get the value and ensure it's a string
            let value = '' + row[header];
            // Optionally, prepend a tab or `="` to prevent Excel auto-formatting
            // value = '\t' + value; // Prepend a tab character
            // or
            // value = `="${value}"`; // Encase in ="value" to force Excel to treat as text
            // Ensure the value is quoted and escape existing quotes
            value = value.replace(/"/g, '""'); // Escape double quotes
            return `"${value}"`; // Quote the value
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
};

  const downloadCSV = () => {
    const data = sortedResponses.map(row => ({
      survey_name: row.survey_name,
      question: row.question,
      question_type: row.question_type,
      response: translateLikertResponse(row.response, row.question_type),
    }));
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'survey_responses.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
      <Typography variant="h4" gutterBottom>
        Survey Responses
      </Typography>
      <Button variant="contained" color="primary" onClick={downloadCSV}>
        Download CSV
      </Button>
    </Box>
      <TableContainer component={Paper}>
        <Table aria-label="survey responses table">
          <TableHead>
            <TableRow>
              <TableCell>
                Survey Name
                <br />
                <input
                  type="text"
                  placeholder="Filter..."
                  value={filter.surveyName}
                  onChange={(e) => setFilter({ ...filter, surveyName: e.target.value })}
                  style={{ width: '100%', marginTop: '5px', background: 'rgb(97, 97, 97)', color: 'white', border: 'none', padding: '5px' }}
                />
                <span onClick={() => requestSort('survey_name')}>
                  {sortConfig.key === 'survey_name' ? (sortConfig.direction === 'ascending' ? <ArrowDownward /> : <ArrowUpward />) : <UnfoldMore />}
                </span>
              </TableCell>
              <TableCell>
                Question Text
                <br />
                <input
                  type="text"
                  placeholder="Filter..."
                  value={filter.questionText}
                  onChange={(e) => setFilter({ ...filter, questionText: e.target.value })}
                  style={{ width: '100%', marginTop: '5px', background: 'rgb(97, 97, 97)', color: 'white', border: 'none', padding: '5px' }}
                />
                <span onClick={() => requestSort('question')}>
                  {sortConfig.key === 'question' ? (sortConfig.direction === 'ascending' ? <ArrowDownward /> : <ArrowUpward />) : <UnfoldMore />}
                </span>
              </TableCell>
              <TableCell align="center">
                Question Type
                <br />
                <input
                  type="text"
                  placeholder="Filter..."
                  value={filter.questionType}
                  onChange={(e) => setFilter({ ...filter, questionType: e.target.value })}
                  style={{ width: '100%', marginTop: '5px', background: 'rgb(97, 97, 97)', color: 'white', border: 'none', padding: '5px' }}
                />
                <span onClick={() => requestSort('question_type')}>
                  {sortConfig.key === 'question_type' ? (sortConfig.direction === 'ascending' ? <ArrowDownward /> : <ArrowUpward />) : <UnfoldMore />}
                </span>
              </TableCell>
              <TableCell align="right">
                Response
                <span onClick={() => requestSort('response')}>
                  {sortConfig.key === 'response' ? (sortConfig.direction === 'ascending' ? <ArrowDownward /> : <ArrowUpward />) : <UnfoldMore />}
                </span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedResponses.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.survey_name}</TableCell>
                <TableCell>{row.question}</TableCell>
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
