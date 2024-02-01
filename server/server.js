const express = require('express')
const {Pool} = require('pg')
const app = express()

const port = 3007;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Redsfan1',
    port: 5432, // Default port for PostgreSQL, change if your DB uses a different port
});

// To query the database
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
      console.error(err);
      return;
  }
  console.log('Connection successful, current time:', res.rows[0].now);
  pool.end(); // close the connection
});


app.get('/', async (req, res) => {
  try {
      const queryRes = await pool.query('SELECT NOW()');
      res.send(`Current time: ${queryRes.rows[0].now}`);
  } catch (err) {
      console.error(err);
      res.send('Error occurred');
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

//app.get("/api", (req, res) => {
//    console.log("Received request:", req.path);
//    res.json({ "users": ["userOne", "userTwo", "userThree", "userFour"] });
//});


app.listen(5003, () => {console.log("Server started on port 5003")})