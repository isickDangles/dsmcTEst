const express = require('express')
const {Pool} = require('pg')
const app = express()


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Redsfan1',
    port: 5432, 
});

app.use(express.json());

// To query the database
/*
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
      console.error(err);
      return;
  }
  console.log('Connection successful, current time:', res.rows[0].now);
  pool.end(); // close the connection
});
*/

// API to retrieve survey creation information
app.post('/create-survey', async (req, res) => {
  const {surveyTitle , surveyDescription, questions } = req.body;
  console.log(surveyTitle);

  try {
    await pool.query('BEGIN'); // Start a transaction

    // Insert the survey and get its ID
    const surveyResult = await pool.query(
      'INSERT INTO survey (title, description) VALUES ($1, $2) RETURNING id',
      [surveyTitle, surveyDescription]
    );
    const surveyId = surveyResult.rows[0].id;

    // Prepare the question insertion query
    const questionInsertQuery = `
      INSERT INTO question (surveyid, questiontext, questiontype, ismandatory)
      VALUES ($1, $2, $3, $4)
    `;

    // Insert each question
    for (const question of questions) {
      await pool.query(questionInsertQuery, [
        surveyId,
        question.questionText,
        question.questionType,
        question.isRequired
      ]);
    }

    await pool.query('COMMIT'); // Commit the transaction
    res.status(201).json({ message: 'Survey created successfully!', surveyId: surveyId });
  } catch (error) {
    await pool.query('ROLLBACK'); // Rollback the transaction on error
    console.error('Error creating survey', error.stack);
    res.status(500).json({ message: 'Error creating survey' });
  }
});
/*
app.get('/', async (req, res) => {
  try {
      const queryRes = await pool.query('SELECT NOW()');
      res.send(`Current time: ${queryRes.rows[0].now}`);
  } catch (err) {
      console.error(err);
      res.send('Error occurred');
  }
});
*/


//app.get("/api", (req, res) => {
//    console.log("Received request:", req.path);
//    res.json({ "users": ["userOne", "userTwo", "userThree", "userFour"] });
//});


app.listen(5003, () => {console.log("Server started on port 5003")})