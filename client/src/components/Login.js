import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; 
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ErrorSnackbar from './ErrorMessage';
import { CssBaseline } from '@mui/material';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'Admin':
          navigate('/admin/dashboard');
          break;
        case 'Surveyor':
          navigate('/surveyor/dashboard');
          break;
        case 'Respondent':
          navigate('/respondent/dashboard');
          break;
        default:
          navigate('/login');
          break;
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username); // Pass only the username to the login function
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
  };

  return (
    <Container component="main" maxWidth="sm"> 
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4"> 
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 3 }}> 
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username or Email" // Adjust the label to reflect both username and email
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
      <ErrorSnackbar open={!!error} message={error} onClose={handleCloseSnackbar} />
    </Container>
  );
};

export default Login;
