import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';

  const RespondentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('/api/surveys');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSurveys(data);
      } catch (error) {
        console.error('Error fetching surveys:', error);
      }
    };

    fetchSurveys();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div>
      <h1>Respondent Dashboard</h1>
      <ul>
        {surveys.map((survey) => (
          <li key={survey.surveytemplateid} onClick={() => navigate(`/fill-survey/${survey.surveytemplateid}`)} style={{ cursor: 'pointer' }}>
            {survey.title}
          </li>
        ))}
      </ul>

    </div>
  );
};

export default RespondentDashboard;
