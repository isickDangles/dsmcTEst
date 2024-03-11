import React from 'react';
import { Container, Typography } from '@mui/material';

function AdminTools() {
  return (
    <Container maxWidth="xl" style={{ marginTop: '2rem', textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
      Admin Tool Box
      </Typography>
      
    </Container>
  );
}

export default AdminTools;