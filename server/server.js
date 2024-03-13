require('dotenv').config()
const express = require('express')
const { Pool } = require('pg')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express()
const saltRounds = 10; //const for hashing

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(express.json());

// Login route
// Login route
app.post('/login', async (req, res) => {
  const { emailOrUsername } = req.body;
  try {
    const userQuery = await pool.query('SELECT * FROM "users" WHERE email = $1 OR username = $1', [emailOrUsername]);
    if (userQuery.rows.length > 0) {
      const user = userQuery.rows[0];

      const roleQuery = await pool.query(`
        SELECT r.name FROM roles r
        JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = $1
      `, [user.id]);

      const role = roleQuery.rows.length > 0 ? roleQuery.rows[0].name : null;

      const token = jwt.sign({ userId: user.id, role: role }, process.env.SECRET_KEY, { expiresIn: '24h' });
      res.json({ token, role: role });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error during login');
  }
});



app.get('/api/survey-template-details/:templateId', async (req, res) => {
  const { templateId } = req.params;

  try {
    const surveyDetailsQuery = `
      SELECT st.id AS surveyTemplateID, st.name AS title, st.description, q.id AS questionID, q.question, 
      q.is_required, qt.name AS questionType
      FROM survey_templates st
      JOIN survey_template_questions sq ON st.id = sq.survey_template_id
      JOIN questions q ON sq.question_id = q.id
      JOIN question_types qt ON q.question_type_id = qt.id
      WHERE st.id = $1;
    `;

    const surveyDetailsResult = await pool.query(surveyDetailsQuery, [templateId]);

    if (surveyDetailsResult.rows.length === 0) {
      return res.status(404).json({ message: "Survey template not found" });
    }

    const surveyDetails = [];

    for (const question of surveyDetailsResult.rows) {
      const choicesQuery = `
        SELECT choice_text
        FROM choices
        WHERE question_id = $1;
      `;
      const choicesResult = await pool.query(choicesQuery, [question.questionid]); 

      surveyDetails.push({
        ...question,
        choices: choicesResult.rows.map(choiceRow => choiceRow.choice_text)
      });
    }

    res.json(surveyDetails);
  } catch (error) {
    console.error('Failed to fetch survey details:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


app.get('/api/survey-details/:surveyId', async (req, res) => {
  // Corrected from templateId to surveyId to match the route parameter
  const { surveyId } = req.params;

  try {
    const surveyDetailsQuery = `
      SELECT s.id AS surveyID, st.name AS title, st.description, q.id AS questionID, q.question, 
      q.is_required, qt.name AS questionType
      FROM surveys s
      JOIN survey_templates st ON s.survey_template_id = st.id
      JOIN survey_template_questions sq ON st.id = sq.survey_template_id
      JOIN questions q ON sq.question_id = q.id
      JOIN question_types qt ON q.question_type_id = qt.id
      WHERE s.id = $1;
    `;

    const surveyDetailsResult = await pool.query(surveyDetailsQuery, [surveyId]);

    if (surveyDetailsResult.rows.length === 0) {
      return res.status(404).json({ message: "Survey not found" });
    }

    const surveyDetails = [];

    for (const question of surveyDetailsResult.rows) {
      const choicesQuery = `
        SELECT choice_text
        FROM choices
        WHERE question_id = $1;
      `;
      const choicesResult = await pool.query(choicesQuery, [question.questionid]); 

      surveyDetails.push({
        ...question,
        choices: choicesResult.rows.map(choiceRow => choiceRow.choice_text)
      });
    }

    res.json(surveyDetails);
  } catch (error) {
    console.error('Failed to fetch survey details:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.post('/create-survey-template', async (req, res) => {
  const { surveyTitle, surveyDescription, questions } = req.body;

  try {
    await pool.query('BEGIN');

    // Insert the survey template
    const surveyTemplateResult = await pool.query(
      'INSERT INTO survey_templates (name, description) VALUES ($1, $2) RETURNING id',
      [surveyTitle, surveyDescription]
    );
    const surveyTemplateID = surveyTemplateResult.rows[0].id;

    for (const question of questions) {
      let questionID = await questionExists(question, pool);

      if (!questionID) { // If the question doesn't exist, insert it
        const questionInsertResult = await pool.query(
          'INSERT INTO questions (question, question_type_id, is_required) VALUES ($1, $2, $3) RETURNING id',
          [question.text, question.questionType, question.isRequired]
        );
        questionID = questionInsertResult.rows[0].id;

        // Insert choices for the new question
        if (question.choices && question.choices.length > 0) {
          for (const choice of question.choices) {
            await pool.query(
              'INSERT INTO choices (question_id, choice_text) VALUES ($1, $2)',
              [questionID, choice]
            );
          }
        }
      }

      // Link the question (new or existing) to the survey template
      await pool.query(
        'INSERT INTO survey_template_questions (survey_template_id, question_id) VALUES ($1, $2)',
        [surveyTemplateID, questionID]
      );
    }

    await pool.query('COMMIT');
    res.status(201).json({ message: 'Survey template created successfully!', surveyTemplateID: surveyTemplateID });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error during survey template creation:', error);
    res.status(500).json({ message: 'Error creating survey template', error: error.message });
  }
});

//Creates a SURVEY From the template survey data, with some additional parameters
app.post('/api/create-survey', async (req, res) => {
  const { surveyTemplateId, surveyorId, organizationId, projectId, surveyorRoleId, startDate, endDate } = req.body;

  try {
    const insertSurveyQuery = `
      INSERT INTO surveys (survey_template_id, surveyor_id, organization_id, project_id, surveyor_role_id, start_date, end_date, created_at, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $2) RETURNING id;
    `;
    const result = await pool.query(insertSurveyQuery, [surveyTemplateId, surveyorId, organizationId, projectId, surveyorRoleId, startDate, endDate]);
    const surveyId = result.rows[0].id;
    res.status(201).json({ message: 'Survey created successfully!', surveyId: surveyId });
  } catch (error) {
    console.error('Failed to create survey:', error);
    res.status(500).json({ message: 'Failed to create survey', error: error.message });
  }
});

//CREATE Project and ORganization 

// Endpoint to create an organization and return its ID
app.post('/api/create-organization', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query('INSERT INTO organizations (name) VALUES ($1) RETURNING id', [name]);
    res.json({ organizationId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating organization');
  }
});

// Endpoint to create a project and return its ID
app.post('/api/create-project', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query('INSERT INTO projects (name) VALUES ($1) RETURNING id', [name]);
    res.json({ projectId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating project');
  }
});



async function questionExists(question, pool) {
  // Attempt to find an existing question that matches the submitted question exactly
  const questionQuery = `
    SELECT q.id
    FROM questions q
    WHERE q.question = $1 AND q.question_type_id = $2 AND q.is_required = $3;
  `;

  const res = await pool.query(questionQuery, [question.text, question.questionType, question.isRequired]);

  // If the question exists, return its ID; otherwise, return false
  return res.rows.length > 0 ? res.rows[0].id : false;
}



// Survey template route
app.get('/api/survey-template/:templateId', async (req, res) => {
  const { templateId } = req.params;

  try {
    await pool.query('BEGIN');

    const surveyTemplateQuery = `
      SELECT name, description
      FROM survey_templates
      WHERE id = $1;
    `;
    const surveyTemplateResult = await pool.query(surveyTemplateQuery, [templateId]);

    if (surveyTemplateResult.rows.length === 0) {
      res.status(404).json({ message: 'Survey template not found' });
      return;
    }

    const surveyTemplate = surveyTemplateResult.rows[0];

    const questionsQuery = `
      SELECT q.id AS questionID, q.question, qt.name AS questionType, qv.is_required, qv.version_number
      FROM survey_template_questions sq
      JOIN question_versions qv ON sq.question_version_id = qv.id
      JOIN questions q ON qv.question_id = q.id
      JOIN question_types qt ON qv.question_type_id = qt.id
      WHERE sq.survey_template_id = $1;
    `;
    const questionsResult = await pool.query(questionsQuery, [templateId]);

    // Enhance questions with choices if necessary
    for (let question of questionsResult.rows) {
      if (['Multiple Choice', 'Likert Scale'].includes(question.questiontype)) {
        const choicesQuery = `
          SELECT choice_text
          FROM choices
          WHERE question_version_id = $1;
        `;
        const choicesResult = await pool.query(choicesQuery, [question.questionid]);
        question.choices = choicesResult.rows;
      } else {
        question.choices = []; // Ensure all questions have a choices key for consistency
      }
    }

    await pool.query('COMMIT');

    res.json({
      id: templateId,
      name: surveyTemplate.name,
      description: surveyTemplate.description,
      questions: questionsResult.rows
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error fetching survey template:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/surveys', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id AS surveyTemplateID, name AS title, description FROM survey_templates WHERE deleted_at IS NULL'
    );
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch surveys:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/api/survey-response/:surveyId', async (req, res) => {
  const { surveyId } = req.params;
  const { responses } = req.body; 

  try {
    await pool.query('BEGIN');

    for (const [questionId, response] of Object.entries(responses)) {
      await pool.query(
        'INSERT INTO responses (question_id, survey_id, response) VALUES ($1, $2, $3)',
        [questionId, surveyId, response]
      );
    }

    await pool.query('COMMIT');
    res.json({ message: 'Responses submitted successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Failed to submit responses:', error);
    res.status(500).json({ message: 'Failed to submit responses', error: error.message });
  }
});


// Route to fetch all saved questions
app.get('/api/saved-questions', async (req, res) => {
  try {
    const savedQuestionsQuery = `
      SELECT q.id, q.question_type_id, q.question, q.is_required, q.is_saved, 
      COALESCE(json_agg(c.choice_text) FILTER (WHERE c.choice_text IS NOT NULL), '[]') AS choices
      FROM questions q
      LEFT JOIN choices c ON q.id = c.question_id
      GROUP BY q.id;
    `;
    const { rows } = await pool.query(savedQuestionsQuery);
    res.json(rows.map(row => ({
      ...row,
      choices: row.choices === '[]' ? [] : row.choices
    })));
  } catch (error) {
    console.error('Failed to fetch saved questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to save a question to the question bank
app.post('/api/save-question', async (req, res) => {



  // Log the received data
  console.log('Received data:', { questionText, questionTypeId, choices, isRequired });

  try {
    await pool.query('BEGIN');

    const insertQuestionQuery = `
      INSERT INTO questions (question, question_type_id, is_saved, is_required)
      VALUES ($1, $2, true, $3)
      RETURNING id;
    `;
    // Include isRequired in the parameter array for the query
    const questionResult = await pool.query(insertQuestionQuery, [questionText, questionTypeId, isRequired]);
    const questionID = questionResult.rows[0].id;

    // If there are choices, insert them too
    if (choices) {
      for (const choiceText of choices) {
        const insertChoiceQuery = `
          INSERT INTO choices (question_id, choice_text)
          VALUES ($1, $2);
        `;
        await pool.query(insertChoiceQuery, [questionID, choiceText]);
      }
    }

    await pool.query('COMMIT');
    res.status(201).json({ message: 'Question saved successfully!' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error saving question:', error);
    res.status(500).json({ message: 'Error saving question' });
  }
});


app.patch('/api/survey-template/:templateId/delete', async (req, res) => {
  const { templateId } = req.params;

  try {
    const result = await pool.query(
      'UPDATE survey_templates SET deleted_at = NOW() WHERE id = $1 RETURNING *',
      [templateId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Survey template not found or already deleted." });
    }

    res.json({ message: 'Survey template marked as deleted successfully.', surveyTemplate: result.rows[0] });
  } catch (error) {
    console.error('Failed to mark survey as deleted:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});



app.listen(5003, () => { console.log("Server started on port 5003") })