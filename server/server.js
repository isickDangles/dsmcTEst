const express = require('express')
const {Pool} = require('pg')
const app = express()

const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'your_database_name',
    password: 'your_password',
    port: 5432, // default port for PostgreSQL
  });

app.get("/api", (req, res) => {
    console.log("Received request:", req.path);
    res.json({ "users": ["userOne", "userTwo", "userThree", "userFour"] });
});


app.listen(5003, () => {console.log("Server started on port 5003")})