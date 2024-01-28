const express = require('express')
const app = express()

app.get("/api", (req, res) => {
    console.log("Received request:", req.path);
    res.json({ "users": ["userOne", "userTwo", "userThree", "userFour"] });
});


app.listen(5003, () => {console.log("Server started on port 5003")})