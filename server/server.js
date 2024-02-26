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
    const userQuery = await pool.query('SELECT * FROM "user" WHERE username = $1', [username]);
    if (userQuery.rows.length > 0) {
      const user = userQuery.rows[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const roleQuery = await pool.query(`
        SELECT r.roleName FROM role r
        JOIN userRole ur ON r.roleID = ur.roleID
        WHERE ur.userID = $1
      `, [user.userid]);


        const role = roleQuery.rows.length > 0 ? roleQuery.rows[0].rolename : null;
        
        const token = jwt.sign({ userId: user.userid, role: role }, process.env.SECRET_KEY, { expiresIn: '24h' });
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
      SELECT st.surveyTemplateID, st.title, st.description, q.questionID, q.questionText, 
             qv.versionNumber, qv.isRequired, qt.questionType, qv.questionVersionID
      FROM surveyTemplate st
      JOIN surveyQuestion sq ON st.surveyTemplateID = sq.surveyTemplateID
      JOIN questionVersion qv ON sq.questionVersionID = qv.questionVersionID
      JOIN question q ON qv.questionID = q.questionID
      JOIN questionType qt ON qv.questionTypeID = qt.questionTypeID
      WHERE st.surveyTemplateID = $1;
    `;

    const surveyDetailsResult = await pool.query(surveyDetailsQuery, [templateId]);

    if (surveyDetailsResult.rows.length === 0) {
      return res.status(404).json({ message: "Survey template not found" });
    }

    // Initialize an array to hold the survey details including choices
    const surveyDetails = [];

    // Loop over each question to set the choices
    for (const question of surveyDetailsResult.rows) {
      const choicesQuery = `
        SELECT choicetext
        FROM choice
        WHERE questionversionid = $1 
      `;
      const choicesResult = await pool.query(choicesQuery, [question.questionversionid]);
      
      // Push the question along with its choices into the surveyDetails array
      surveyDetails.push({
        ...question,
        choices: choicesResult.rows.map(choiceRow => choiceRow.choicetext) // Ensure this is the correct column name
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
      'INSERT INTO surveyTemplate (title, description) VALUES ($1, $2) RETURNING surveyTemplateID',
      [surveyTitle, surveyDescription]
    );
    const surveyTemplateID = surveyTemplateResult.rows[0].surveytemplateid;

    for (const question of questions) {
      // Insert the question (if it's new)
      const questionResult = await pool.query(
        'INSERT INTO question (questionText) VALUES ($1) RETURNING questionID',
        [question.text]
      );
      const questionID = questionResult.rows[0].questionid;

      const questionTypeResult = await pool.query(
        'SELECT questionTypeID FROM questionType WHERE questionTypeID = $1',

        [question.questionType]
      );
      let questionTypeID;
      if (questionTypeResult.rows.length > 0) {
        questionTypeID = questionTypeResult.rows[0].questiontypeid;
      } else {
      }

      const questionVersionResult = await pool.query(
        `INSERT INTO questionVersion (questionID, questionTypeID, isRequired, versionNumber)
         VALUES ($1, $2, $3, 1) RETURNING questionVersionID`,
        [questionID, questionTypeID, question.isRequired ?? false]
      );
      const questionVersionID = questionVersionResult.rows[0].questionversionid;

      await pool.query(
        'INSERT INTO surveyQuestion (surveyTemplateID, questionVersionID) VALUES ($1, $2)',
        [surveyTemplateID, questionVersionID]
      );

      if (question.choices) {
        for (const choiceText of question.choices) {
          await pool.query(
            'INSERT INTO choice (questionVersionID, choiceText) VALUES ($1, $2)',
            [questionVersionID, choiceText]
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

app.get('/api/survey-template/:templateId', async (req, res) => {
  const { templateId } = req.params;

  try {
    await pool.query('BEGIN');

    const surveyTemplateQuery = `
      SELECT title, description
      FROM surveyTemplate
      WHERE surveyTemplateID = $1;
    `;
    const surveyTemplateResult = await pool.query(surveyTemplateQuery, [templateId]);

    if (surveyTemplateResult.rows.length === 0) {
      res.status(404).json({ message: 'Survey template not found' });
      return;
    }

    const surveyTemplate = surveyTemplateResult.rows[0];

    const questionsQuery = `
      SELECT q.questionID, q.questionText, qt.questionType, qv.isRequired, qv.versionNumber
      FROM surveyQuestion sq
      JOIN questionVersion qv ON sq.questionVersionID = qv.questionVersionID
      JOIN question q ON qv.questionID = q.questionID
      JOIN questionType qt ON qv.questionTypeID = qt.questionTypeID
      WHERE sq.surveyTemplateID = $1;
    `;
    const questionsResult = await pool.query(questionsQuery, [templateId]);

    // Enhance questions with choices if necessary
    for (let question of questionsResult.rows) {
      if (['Multiple Choice', 'Likert Scale'].includes(question.questiontype)) {
        const choicesQuery = `
          SELECT c.choiceID, c.choiceText
          FROM choice c
          JOIN questionVersion qv ON c.questionVersionID = qv.questionVersionID
          WHERE qv.questionID = $1;
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
      title: surveyTemplate.title,
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
    const { rows } = await pool.query('SELECT surveyTemplateID, title, description FROM surveyTemplate');
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch surveys:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/create-survey', async (req, res) => {
  const { surveyTitle, surveyDescription, questions } = req.body;

  try {
    await pool.query('BEGIN');

    // Insert the survey template
    const surveyTemplateResult = await pool.query(
      'INSERT INTO surveyTemplate (title, description) VALUES ($1, $2) RETURNING surveyTemplateID',
      [surveyTitle, surveyDescription]
    );
    const surveyTemplateID = surveyTemplateResult.rows[0].surveytemplateid;

    for (const question of questions) {
      // Find the corresponding questionTypeID from the questionType description
      const questionTypeResult = await pool.query(
        'SELECT questionTypeID FROM questionType WHERE questionType = $1',
        [question.questionType]
      );

      if (questionTypeResult.rows.length === 0) {
        throw new Error(`Question type '${question.questionType}' not found.`);
      }

      const questionTypeID = questionTypeResult.rows[0].questiontypeid;
      console.log(`Question Type ID: ${questionTypeID} for type ${question.questionType}`);

      // Insert the question
      const questionResult = await pool.query(
        'INSERT INTO question (questionText) VALUES ($1) RETURNING questionID',
        [question.text]
      );
      const questionID = questionResult.rows[0].questionid;

      // Insert a new question version
      await pool.query(
        'INSERT INTO questionVersion (questionID, questionTypeID, isRequired, versionNumber) VALUES ($1, $2, $3, 1)',
        [questionID, questionTypeID, question.isRequired ?? false]
      );

      // Get the latest questionVersionID for this question
      const versionResult = await pool.query(
        'SELECT questionVersionID FROM questionVersion WHERE questionID = $1 ORDER BY questionVersionID DESC LIMIT 1',
        [questionID]
      );
      const questionVersionID = versionResult.rows[0].questionversionid;

      // Insert choices for the question, if applicable
      if (question.choices && Array.isArray(question.choices) && question.choices.length > 0) {
        for (const choiceText of question.choices) {
          await pool.query(
            'INSERT INTO choice (questionVersionID, choiceText) VALUES ($1, $2)',
            [questionVersionID, choiceText]
          );
        }
      }
    }

    await pool.query('COMMIT');
    res.status(201).json({ message: 'Survey created successfully!', surveyTemplateID });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error creating survey:', error.stack);
    res.status(500).json({ message: 'Error creating survey', error: error.message });
  }
});




app.listen(5003, () => { console.log("Server started on port 5003") })