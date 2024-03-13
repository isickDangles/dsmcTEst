import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  Card,
  CardContent,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

function ManageSurvey() {
  const [surveys, setSurveys] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [dateFilterType, setDateFilterType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('/api/surveys');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSurveys(data);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    }

    fetchSurveys();
  }, []);

  const handleFilter = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/surveys');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();
  
      // Apply filtering on fetched data
      if (filterType === 'surveyName' && searchValue) {
        data = data.filter(survey => survey.title.toLowerCase().includes(searchValue.toLowerCase()));
      } else if (filterType === 'surveyorName' && searchValue) {
        data = data.filter(survey => survey.surveyorName.toLowerCase().includes(searchValue.toLowerCase()));
      }
  
      if (statusFilter) {
        data = data.filter(survey => survey.status === statusFilter);
      }
  
      if (dateFilterType && startDate) {
        data = data.filter(survey => {
          const surveyDate = survey.date; // Assuming you have a date field in your survey objects
          switch (dateFilterType) {
            case 'before':
              return surveyDate < startDate;
            case 'after':
              return surveyDate > startDate;
            case 'between':
              if (endDate) {
                return surveyDate >= startDate && surveyDate <= endDate;
              }
              break;
            default:
              return true;
          }
        });
      }
  
      setSurveys(data); // Update the surveys state with the filtered data
    } catch (error) {
      console.error("Error fetching and filtering surveys:", error);
    }
  };
  

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
    setSearchValue('');
    setDateFilterType('');
    setStartDate('');
    setEndDate('');
    setStatusFilter('');
  };

  const handleDateFilterTypeChange = (event) => {
    setDateFilterType(event.target.value);
    setStartDate('');
    setEndDate('');
    setStatusFilter('');
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setSearchValue('');
    setDateFilterType('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <Container maxWidth="xl" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" gutterBottom style={{ textAlign: 'center', marginBottom: '20px' }}>
        Survey Status Portal
      </Typography>
      {/* Start of form */}
      <form onSubmit={handleFilter}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} lg={10}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="filter-type-label">Filter By</InputLabel>
                  <Select
                    labelId="filter-type-label"
                    id="filter-type"
                    value={filterType}
                    onChange={handleFilterTypeChange}
                  >
                    <MenuItem value="">Select Filter</MenuItem>
                    <MenuItem value="surveyName">Survey Name</MenuItem>
                    <MenuItem value="surveyorName">Surveyor Name</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                  </Select>
                </FormControl>
                {filterType === 'surveyName' && (
                  <TextField
                    label="Survey Name"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    fullWidth
                    style={{ marginTop: '10px' }}
                  />
                )}
                {filterType === 'surveyorName' && (
                  <TextField
                    label="Surveyor Name"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    fullWidth
                    style={{ marginTop: '10px' }}
                  />
                )}
                {filterType === 'status' && (
                  <FormControl fullWidth style={{ marginTop: '10px' }}>
                    <InputLabel id="status-filter-label">Status</InputLabel>
                    <Select
                      labelId="status-filter-label"
                      id="status-filter"
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                    >
                      <MenuItem value="">Select Status</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="closed">Closed</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                )}
                {filterType === 'date' && (
                  <FormControl fullWidth style={{ marginTop: '10px' }}>
                    <InputLabel id="date-filter-type-label">Filter Date</InputLabel>
                    <Select
                      labelId="date-filter-type-label"
                      id="date-filter-type"
                      value={dateFilterType}
                      onChange={handleDateFilterTypeChange}
                    >
                      <MenuItem value="">Select Date Filter</MenuItem>
                      <MenuItem value="before">Before</MenuItem>
                      <MenuItem value="after">After</MenuItem>
                      <MenuItem value="between">Between</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Grid>
              {/* Date inputs handling */}
              {dateFilterType && (
                <>
                  <Grid item xs={12} md={4}>
                    <TextField
                      type="date"
                      label="Start Date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      style={{ marginTop: '10px' }}
                    />
                  </Grid>
                  {dateFilterType === 'between' && (
                    <Grid item xs={12} md={4}>
                      <TextField
                        type="date"
                        label="End Date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        style={{ marginTop: '10px' }}
                      />
                    </Grid>
                  )}
                </>
              )}
            </Grid>
            {/* Filter button */}
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
              Filter
            </Button>
          </Grid>
        </Grid>
      </form>
      {/* Displaying surveys */}
      {surveys.map((survey) => (
        <Card key={survey.surveytemplateid} sx={{ marginBottom: '20px' }}>
          <CardContent>
            <Typography variant="h5">
              {survey.title}
            </Typography>
            <Button variant="contained" color="primary" startIcon={<PreviewIcon />} onClick={() => navigate(`/preview-survey/${survey.surveytemplateid}`)} style={{ cursor: 'pointer', marginRight: '10px' }}>
              View
            </Button>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default ManageSurvey;
