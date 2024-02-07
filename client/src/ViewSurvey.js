import React, { useState, useEffect } from 'react';

function ViewSurvey() {
  const [surveys, setSurveys] = useState([]);

  // Function to fetch surveys from the backend
  const fetchSurveys = async () => {
    try {
      const response = await fetch('/get-surveys'); // Assuming '/get-surveys' is your endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSurveys(data.surveys); // Assuming the data returned is an object with a surveys property
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };

  // Use useEffect to fetch surveys when the component mounts
  useEffect(() => {
    fetchSurveys();
  }, []); // Empty dependency array means this effect runs once on mount

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
