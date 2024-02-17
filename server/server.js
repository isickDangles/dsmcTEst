
require('dotenv').config()
const express = require('express')
const { Pool } = require('pg')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express()

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(express.json());


app.get('/api/surveys/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const surveyResult = await pool.query('SELECT * FROM survey WHERE id = $1', [id]);
    const questionsResult = await pool.query('SELECT * FROM question WHERE surveyid = $1', [id]);
    if (surveyResult.rows.length) {
      res.json({ survey: surveyResult.rows[0], questions: questionsResult.rows });
    } else {
      res.status(404).json({ message: 'Survey not found' });
    }
  } catch (error) {
    console.error('Error fetching survey details', error.stack);
    res.status(500).json({ message: 'Error fetching survey details' });
  }
});


// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userQuery = await pool.query('SELECT * FROM "user" WHERE username = $1', [username]);
    if (userQuery.rows.length > 0) {
      const user = userQuery.rows[0];

      // Use bcrypt to compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      // Hash the password entered by the user
  

      if (isMatch) {
        const roleQuery = await pool.query(`
        SELECT r.roleName FROM "role" r
        JOIN "userRole" ur ON r.roleID = ur.roleID
        WHERE ur.userID = $1
      `, [user.userid]); // Ensure the column name matches the actual ID column name in your table
       
      // Assuming we are only fetching one role for simplicity
      const role = roleQuery.rows.length > 0 ? roleQuery.rows[0].rolename : null;
      console.log(role);
      const token = jwt.sign({ userId: user.userid, role: role }, process.env.SECRET_KEY, { expiresIn: '24h' });
      res.json({ token, role: role });
      } else {
        res.status(401).send('Invalid credentials');
      }
    } else {
      // User not found
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error during login');
  }
});

app.get('/api/surveys/:id/questions', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM question WHERE survey_id = $1', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching questions for survey', error.stack);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});


app.post('/create-survey', async (req, res) => {
  const { surveyTitle, surveyDescription, questions } = req.body;

  try {
    await ensureTablesExist(pool);
    await pool.query('BEGIN');

    const surveyResult = await pool.query(
      'INSERT INTO survey (title, description) VALUES ($1, $2) RETURNING id',
      [surveyTitle, surveyDescription]
    );
    const surveyId = surveyResult.rows[0].id;

    const questionInsertQuery = `
      INSERT INTO question (surveyid, questiontype, questiontext, ismandatory)
      VALUES ($1, $2, $3, $4) RETURNING id
    `;

    for (const question of questions) {
      const questionResult = await pool.query(questionInsertQuery, [
        surveyId,
        question.questionType,
        question.text,
        question.isRequired ?? false,
      ]);
      const questionId = questionResult.rows[0].id;

      if (question.questionType === 2 && question.choices) {
        const choiceInsertQuery = `
          INSERT INTO choice (questionid, choicetext)
          VALUES ($1, $2)
        `;
        for (const choiceText of question.choices) {
          await pool.query(choiceInsertQuery, [questionId, choiceText]);
        }
      }
    }

    await pool.query('COMMIT');
    res.status(201).json({ message: 'Survey created successfully!', surveyId: surveyId });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error creating survey', error.stack);
    res.status(500).json({ message: 'Error creating survey' });
  }
});







app.get('/get-surveys', async (req, res) => {
  try {
    // Fetch all questions
    const questionsResponse = await pool.query('SELECT * FROM question');
    const questions = questionsResponse.rows;


    const surveysIndex = {};


    questions.forEach(question => {
      const surveyId = question.surveyid;

      if (!surveysIndex[surveyId]) {
        surveysIndex[surveyId] = {
          questions: []
        };
      }

      surveysIndex[surveyId].questions.push(question);
    });

    const surveysResponse = await pool.query('SELECT * FROM survey');
    const surveys = surveysResponse.rows;

    surveys.forEach(survey => {
      if (surveysIndex[survey.id]) {
        surveysIndex[survey.id] = { ...survey, ...surveysIndex[survey.id] };
      }
    });

    const surveysWithQuestions = Object.values(surveysIndex);

    res.json({ surveys: surveysWithQuestions });
  } catch (error) {
    console.error('Error fetching surveys with questions:', error);
    res.status(500).json({ message: 'Error fetching surveys' });
  }
});




async function ensureTablesExist(pool) {
  const createSurveyTableQuery = `
    CREATE TABLE IF NOT EXISTS survey (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT
    );
  `;

  const createQuestionTableQuery = `
    CREATE TABLE IF NOT EXISTS question (
      id SERIAL PRIMARY KEY,
      surveyid INTEGER REFERENCES survey(id),
      questiontext TEXT,
      questiontype VARCHAR(50),
      ismandatory BOOLEAN
    );
  `;

  try {
    await pool.query(createSurveyTableQuery);
    await pool.query(createQuestionTableQuery);
  } catch (error) {
    console.error('Error ensuring tables exist', error.stack);
    throw error;
  }
}

app.listen(5003, () => { console.log("Server started on port 5003") })