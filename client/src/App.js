
import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, AuthContext } from './components/AuthContext'; 
import Login from './components/Login';
import AdminDashboard from './admin/AdminDashboard'; 
import SurveyorDashboard from './surveyor/SurveyorDashboard'; 
import RespondentView from './respondent/RespondentView'; 
import Layout from './components/Layout'; 
import ProtectedRoute from './components/ProtectedRoute'; 

import SurveyCreationPage from './admin/CreateSurveyPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function RedirectToDashboard() {
  const { user } = useContext(AuthProvider);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'surveyor':
          navigate('/surveyor/dashboard');
          break;
        case 'respondent':
          navigate('/respondent/view');
          break;
        default:
          navigate('/login'); 
      }
    }
  }, [user, navigate]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={darkTheme}>
        <BrowserRouter>
          <Routes>


            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Layout>        <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/surveyor/dashboard"
              element={
                <ProtectedRoute roles={['surveyor']}>
                  <Layout>
                    <SurveyorDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/respondent/view"
              element={
                <ProtectedRoute roles={['respondent']}>
                  <Layout>                  <RespondentView />
</Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/createSurvey"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Layout>                  <SurveyCreationPage />
                  </Layout>

                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
