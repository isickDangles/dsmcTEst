import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Container, Grid, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import EditNoteIcon from '@mui/icons-material/EditNote';

function ManageSurvey() {
    const [surveys, setSurveys] = useState([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const response = await fetch('/api/survey-templates'); // Adjust the URL to your actual API endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSurveys(data); // Assuming the API returns an array of surveys
                console.log(surveys);
            } catch (error) {
                console.error("Error fetching surveys:", error);
            }
        };

        fetchSurveys();
    }, []);

    const handleDelete = (survey) => {
        setSelectedSurvey(survey);
        setOpenDialog(true);
    };

    const confirmDelete = async () => {
        try {
          const response = await fetch(`/api/survey-template/${selectedSurvey.surveytemplateid}/delete`, {
            method: 'PATCH', // Use PATCH to indicate updating part of the resource
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const result = await response.json();
          console.log('Survey marked as deleted:', result);
      
          // Update the local state to reflect the change
          setSurveys(surveys.filter(survey => survey.surveytemplateid !== selectedSurvey.surveytemplateid));
      
          setOpenDialog(false);
        } catch (error) {
          console.error('Error marking survey as deleted:', error);
        }
      };
      

    return (
        <Container maxWidth="xl" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" component="h1" gutterBottom style={{ textAlign: 'center', marginBottom: '20px' }}>
                Survey Distribution Portal
            </Typography>
            <Button variant="outlined" onClick={() => setDeleteMode(!deleteMode)} style={{ marginBottom: '20px' }}>
                {deleteMode ? 'Exit Delete Mode' : 'Delete Mode'}
            </Button>
            <Grid container spacing={2} justifyContent="center">
                {surveys.length > 0 ? (
                    surveys.map((survey) => (
                        <Grid item key={survey.surveytemplateid} xs={12} lg={10}>
                            <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 80 }}>
                                <CardContent>
                                    <Typography variant="h5">
                                        {survey.title}
                                    </Typography>
                                </CardContent>
                                <CardContent>
                                    <Button variant="contained" color="primary" startIcon={<PreviewIcon />} onClick={() => navigate(`/preview-survey/${survey.surveytemplateid}`)} style={{ cursor: 'pointer' }}>
                                        View
                                    </Button>
                                    <Button variant="contained" color="secondary" startIcon={<EditNoteIcon />} style={{ marginLeft: '10px' }}>
                                         Edit
                                    </Button>
                                    {deleteMode && (
                                        <Button startIcon={<DeleteIcon />} onClick={() => handleDelete(survey)} style={{ marginLeft: '10px' }}>
                                            Delete
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" style={{ textAlign: 'center', width: '100%' }}>No surveys found.</Typography>
                )}
            </Grid>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{"Are you sure you want to delete this survey?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {`Survey title: ${selectedSurvey.title}`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ManageSurvey;
