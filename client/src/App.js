
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
import ViewSurvey from './surveyor/ViewSurvey';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function RedirectToDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
                <ProtectedRoute roles={['Admin']}>
                  <Layout>        <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/surveyor/dashboard"
              element={
                <ProtectedRoute roles={['Surveyor']}>
                  <Layout>
                    <SurveyorDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/respondent/view"
              element={
                <ProtectedRoute roles={['Respondent']}>
                  <Layout>                  <RespondentView />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/createSurvey"
              element={
                <ProtectedRoute roles={['Admin']}>
                  <Layout>                  <SurveyCreationPage />
                  </Layout>

                </ProtectedRoute>
              }
            />
            <Route
              path="/viewSurveys"
              element={
                <ProtectedRoute roles={['Admin']}>
                  <Layout>                  <ViewSurvey />
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
