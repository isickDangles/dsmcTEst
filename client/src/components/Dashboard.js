import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
const Dashboard = () => {
  return (
    <Grid container spacing={3}>
           <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4">Dashboard</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
