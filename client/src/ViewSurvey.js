import React, { useState, useEffect } from 'react';

function ViewSurvey() {
  const [surveys, setSurveys] = useState([]);
  const [activeSurveyId, setActiveSurveyId] = useState(null); // Track the active survey

  const fetchSurveys = async () => {
    try {
      const response = await fetch('/get-surveys');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setSurveys(data.surveys);
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);
  // Function to toggle the active survey
  const toggleActiveSurvey = (surveyId) => {
    setActiveSurveyId(activeSurveyId === surveyId ? null : surveyId);
  };
  return (
    <div>
      <h1>Surveys</h1>
      {surveys.length > 0 ? (
        <ul>
          {surveys.map((survey) => (
            <li key={survey.id}>
              <h2>{survey.title}</h2>
              <p>{survey.description}</p>
              {/* You might want to display more details here, like questions */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No surveys found.</p>
      )}
    </div>
  );
}

export default ViewSurvey;