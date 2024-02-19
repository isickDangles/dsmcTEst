import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, AuthContext } from './components/AuthContext';
import Login from './components/Login';
import AdminDashboard from './admin/AdminDashboard';
import SurveyorDashboard from './surveyor/SurveyorDashboard';
import RespondentDashboard from './respondent/RespondentDashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import SurveyCreationPage from './admin/CreateSurveyPage';
import ViewSurvey from './surveyor/ViewSurvey';
import SurveyPage from './respondent/SurveyPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const { user } = useContext(AuthContext);

  return (
    <AuthProvider>
      <ThemeProvider theme={darkTheme}>
        <BrowserRouter>
          <Routes>


            <Route path="/login" element={<Login />} />

            <Route path="/admin/dashboard" element={
              <ProtectedRoute roles={['Admin']}>
                <Layout><AdminDashboard /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/surveyor/dashboard" element={
              <ProtectedRoute roles={['Surveyor']}>
                <Layout><SurveyorDashboard /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/respondent/dashboard" element={
              <ProtectedRoute roles={['Respondent']}>
                <Layout><RespondentDashboard /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/createSurvey" element={
              <ProtectedRoute roles={['Admin']}>
                <Layout><SurveyCreationPage /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/viewSurveys" element={
              <ProtectedRoute roles={['Admin']}>
                <Layout><ViewSurvey /></Layout>


              </ProtectedRoute>
            } />
            <Route path="/fill-survey/:templateId" element={
              <ProtectedRoute roles={['Respondent']}>
                <SurveyPage />
              </ProtectedRoute>
            } />

            {/* Catch-all route to handle undefined paths */}
            <Route path="*" element={<Navigate to={!user ? "/login" : `/${user.role.toLowerCase()}/dashboard`} replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
