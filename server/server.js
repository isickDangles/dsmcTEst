require('dotenv').config()
const express = require('express')
const { Pool } = require('pg')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userQuery = await pool.query('SELECT * FROM "users" WHERE username = $1', [username]);
    if (userQuery.rows.length > 0) {
      const user = userQuery.rows[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const roleQuery = await pool.query(`
        SELECT r.name FROM roles r
        JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = $1
      `, [user.id]);

        const role = roleQuery.rows.length > 0 ? roleQuery.rows[0].name : null;

        const token = jwt.sign({ userId: user.id, role: role }, process.env.SECRET_KEY, { expiresIn: '24h' });
        res.json({ token, role: role });
      } else {
        res.status(401).send('Invalid credentials');
      }
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error during login');
  }
});

app.get('/api/survey-details/:templateId', async (req, res) => {
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
      const choicesResult = await pool.query(choicesQuery, [question.questionid]); // Use lowercase questionid
      
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

    // Create a survey template
    const surveyTemplateResult = await pool.query(
      'INSERT INTO survey_templates (name, description) VALUES ($1, $2) RETURNING id',
      [surveyTitle, surveyDescription]
    );
    const surveyTemplateID = surveyTemplateResult.rows[0].id;

    for (const question of questions) {
      // Insert the question
      const questionResult = await pool.query(
        'INSERT INTO questions (question, question_type_id) VALUES ($1, $2) RETURNING id',
        [question.text, question.questionType]
      );
      const questionID = questionResult.rows[0].id;

      // Link the question to the survey template
      await pool.query(
        'INSERT INTO survey_template_questions (survey_template_id, question_id) VALUES ($1, $2)',
        [surveyTemplateID, questionID]
      );

      if (question.choices) {
        for (const choiceText of question.choices) {
          // Insert choices for the question
          await pool.query(
            'INSERT INTO choices (question_id, choice_text) VALUES ($1, $2)',
            [questionID, choiceText]
          );
        }
      }
    }

    await pool.query('COMMIT');
    res.status(201).json({ message: 'Survey template created successfully!', surveyTemplateID: surveyTemplateID });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error creating survey template', error.stack);
    res.status(500).json({ message: 'Error creating survey template' });
  }
});


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




// Route to fetch all saved questions
app.get('/api/saved-questions', async (req, res) => {
  try {
    const savedQuestionsQuery = `SELECT * FROM questions WHERE is_saved = true;`;
    const { rows } = await pool.query(savedQuestionsQuery);
    res.json(rows);
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