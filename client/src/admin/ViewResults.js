import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from '@mui/material';
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
