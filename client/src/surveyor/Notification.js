import React from 'react';
import { Container, Typography } from '@mui/material';

function Notification() {
  return (
    <Container maxWidth="xl" style={{ marginTop: '2rem', textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
      Notification
      </Typography>
      
    </Container>
  );
}

export default Notification;