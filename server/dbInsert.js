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
    
//Adding roles
`
INSERT INTO "role" (roleName) VALUES
('Admin'),
('Surveyor'),
('Respondent');
`,
//Adding users and assigning them roles

`

INSERT INTO "permission" (permissionName) VALUES
('CREATE_SURVEY'),
('EDIT_SURVEY'),
('DELETE_SURVEY'),
('READ_SURVEY'),
('MANAGE_SURVEYORS'),
('MANAGE_RESPONDENTS'),
('SEND_NOTIFICATIONS'),
('COMPLETE_SURVEY'),
('VIEW_ASSIGNED_SURVEY');
`,
//Adding Administrator roles
`
INSERT INTO "rolePermissions" (roleID, permissionID) VALUES
(1, 1), 
(1, 2), 
(1, 3), 
(1, 4), 
(1, 5); 
`,
//Adding Sureveyor roles
`
INSERT INTO "rolePermissions" (roleID, permissionID) VALUES
(2, 6), 
(2, 7); 
`,
//Adding respondent roles
`
INSERT INTO "rolePermissions" (roleID, permissionID) VALUES
(3, 8), 
(3, 9); 
`,`

INSERT INTO "user" (username, email, password) VALUES
('Admin', 'admin@example.com', '$2y$10$LXmkyVS2cpvCggu/mKcUtOYpooJdW8Inxn2sR/ZUpZ6ToecYjLQNu'),
('Surveyor', 'surveyor@example.com', '$2y$10$wwR1wdvRH6VuvDPGyBJpOe2LvqnOE6j.p1PxmzCxM4RDykKqsvHga'),
('Respondent', 'respondent@example.com', '$2y$10$0EfqjYGLPJiogUFN3HauXuP8GTyWrbMRW8yMyCQtTPcXli1YPlTO.');
`,`

INSERT INTO "userRole" (userID, roleID) VALUES
(1, 1),
(2, 2), 
(3, 3); 
`

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

const addData = async () => {
  try {
    await createTables();
    console.log('All tables created successfully.');
  } catch (error) {
    console.error('Failed to create tables:', error);
  } finally {
    await pool.end();
  }
};

addData();
