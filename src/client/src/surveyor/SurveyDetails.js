import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function SurveyDetails() {
    const { id } = useParams();
    const [surveyDetails, setSurveyDetails] = useState(null);

    useEffect(() => {
        const fetchSurveyDetails = async (surveyId) => {
            try {
                const response = await fetch(`/api/surveys/${surveyId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSurveyDetails(data); 
            } catch (error) {
                console.error("Error fetching survey details:", error);
            }
        };

        fetchSurveyDetails(id);
    }, [id]);

    if (!surveyDetails) {
        return <p>Loading survey details...</p>;
    }

    return (
        <div>
            <h1>{surveyDetails.survey.title}</h1>
            <p>{surveyDetails.survey.description}</p>
            <h2>Questions:</h2>
            <ul>
                {
                    surveyDetails && surveyDetails.questions.length > 0 ? (
                        <ul>
                            {surveyDetails.questions.map((question, index) => (
                                <li key={question.id}>{question.questiontext}</li> 
                            ))}
                        </ul>
                    ) : (
                        <p>No questions found for this survey.</p>
                    )
                }


            </ul>
        </div>
    );
}

export default SurveyDetails;
