require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createTables = async () => {

    const queries = [
    `
  CREATE TABLE IF NOT EXISTS "user" (
  userID SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL, 
  password VARCHAR(255) NOT NULL
);
`,`
CREATE TABLE IF NOT EXISTS "role" (
  roleID SERIAL PRIMARY KEY,
  roleName VARCHAR(255) UNIQUE NOT NULL
);
`,`
CREATE TABLE IF NOT EXISTS "userRole" (
  userID INTEGER REFERENCES "user"(userID),
  roleID INTEGER REFERENCES "role"(roleID),
  PRIMARY KEY (userID, roleID)
);
`,`
CREATE TABLE IF NOT EXISTS "permission" (
  permissionID SERIAL PRIMARY KEY,
  permissionName VARCHAR(255) UNIQUE NOT NULL
);
`,`
CREATE TABLE IF NOT EXISTS "rolePermissions" (
  roleID INTEGER REFERENCES "role"(roleID),
  permissionID INTEGER REFERENCES "permission"(permissionID),
  PRIMARY KEY (roleID, permissionID)
);
`,`
CREATE TABLE IF NOT EXISTS "organization" (
  organizationID SERIAL PRIMARY KEY,
  organizationName VARCHAR(255) UNIQUE NOT NULL
);
`,`
CREATE TABLE IF NOT EXISTS "project" (
  projectID SERIAL PRIMARY KEY,
  projectName VARCHAR(255) NOT NULL,
  organizationID INTEGER REFERENCES "organization"(organizationID)
);
`,`
CREATE TABLE IF NOT EXISTS "surveyor" (
  userID INTEGER REFERENCES "user"(userID),
  projectID INTEGER REFERENCES "project"(projectID),
  PRIMARY KEY (userID, projectID)
);
`,`
CREATE TABLE IF NOT EXISTS "surveyTemplate" (
  surveyTemplateID SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT
);
`,`
CREATE TABLE IF NOT EXISTS "survey" (
  surveyID SERIAL PRIMARY KEY,
  surveyTemplateID INTEGER REFERENCES "surveyTemplate"(surveyTemplateID),
  startDate TIMESTAMP NOT NULL,
  endDate TIMESTAMP NOT NULL,
  surveyors INTEGER REFERENCES "user"(userID)
);
`,`CREATE TABLE IF NOT EXISTS "questionType" (
  questionTypeID SERIAL PRIMARY KEY,
  questionType VARCHAR(255) UNIQUE NOT NULL,
  description TEXT
);
`,`
CREATE TABLE IF NOT EXISTS "question" (
  questionID SERIAL PRIMARY KEY,
  questionText TEXT NOT NULL,
  dateCreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`,`
CREATE TABLE IF NOT EXISTS "questionVersion" (
  questionVersionID SERIAL PRIMARY KEY,
  questionID INTEGER REFERENCES "question"(questionID),
  questionTypeID INTEGER REFERENCES "questionType"(questionTypeID),
  isRequired BOOLEAN,
  dateModified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  versionNumber INTEGER NOT NULL
);
`,`
CREATE TABLE IF NOT EXISTS "surveyQuestion" (
  surveyQuestionID SERIAL PRIMARY KEY,
  surveyTemplateID INTEGER REFERENCES "surveyTemplate"(surveyTemplateID),
  questionVersionID INTEGER REFERENCES "questionVersion"(questionVersionID)
);
`,`
CREATE TABLE IF NOT EXISTS "choice" (
  choiceID SERIAL PRIMARY KEY,
  questionVersionID INTEGER REFERENCES "questionVersion"(questionVersionID),
  choiceText TEXT NOT NULL
);
`,`
CREATE TABLE IF NOT EXISTS "response" (
  responseID SERIAL PRIMARY KEY,
  questionVersionID INTEGER REFERENCES "questionVersion"(questionVersionID),
  choiceID INTEGER REFERENCES "choice"(choiceID),
  likertResponse INTEGER, 
  textResponse TEXT,
  userID INTEGER REFERENCES "user"(userID),
  responseDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`,


    ];

  for (const query of queries) {
    try {
      await pool.query(query);
      console.log('Query executed successfully.');
    } catch (error) {
      console.error('Error executing query:', error.stack);
    }
  }
};

const runMigrations = async () => {
  try {
    await createTables();
    console.log('All tables created successfully.');
  } catch (error) {
    console.error('Failed to create tables:', error);
  } finally {
    await pool.end();
  }
};

runMigrations();
