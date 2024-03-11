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
    // Adding roles
    `
    INSERT INTO roles (name, created_at, created_by) VALUES
    ('Admin', NOW(), 1),
    ('Surveyor', NOW(), 1),
    ('Respondent', NOW(), 1);
    `,
    // Adding permissions
    `
    INSERT INTO permissions (name, created_at, created_by) VALUES
    ('CREATE_SURVEY', NOW(), 1),
    ('EDIT_SURVEY', NOW(), 1),
    ('DELETE_SURVEY', NOW(), 1),
    ('READ_SURVEY', NOW(), 1),
    ('MANAGE_SURVEYORS', NOW(), 1),
    ('MANAGE_RESPONDENTS', NOW(), 1),
    ('SEND_NOTIFICATIONS', NOW(), 1),
    ('COMPLETE_SURVEY', NOW(), 1),
    ('VIEW_ASSIGNED_SURVEY', NOW(), 1);
    `,
    // Adding Administrator roles
    `
    INSERT INTO role_permissions (role_id, permission_id, created_at, created_by) VALUES
    (1, 1, NOW(), 1), 
    (1, 2, NOW(), 1), 
    (1, 3, NOW(), 1), 
    (1, 4, NOW(), 1), 
    (1, 5, NOW(), 1); 
    `,
    // Adding Surveyor roles
    `
    INSERT INTO role_permissions (role_id, permission_id, created_at, created_by) VALUES
    (2, 6, NOW(), 1), 
    (2, 7, NOW(), 1); 
    `,
    // Adding Respondent roles
    `
    INSERT INTO role_permissions (role_id, permission_id, created_at, created_by) VALUES
    (3, 8, NOW(), 1), 
    (3, 9, NOW(), 1); 
    `,
    // Adding users and assigning them roles
    `
    INSERT INTO "users" (username, email, password, created_at, created_by) VALUES
    ('Admin', 'admin@example.com', '$2b$10$Si3Ryo32psoIe2ES/LhYEeXaIDE8tc6yjAEtZDx3bFNdSqUI7odju', NOW(), 1),
    ('Surveyor', 'surveyor@example.com', '$2b$10$ZcMT7a0ukOX4Pn.KQpYhIeQrE66/S2h8LJxIJGI8kaIm8cyCF7SBq', NOW(), 1),
    ('Respondent', 'respondent@example.com', '$2b$10$zcFWoRmEPUkD07ksq.ST0.G6CJLPOZUkMn6/a/Nqrvca6kU3aIcke', NOW(), 1);
    `,
    // Adding user roles
    `
    INSERT INTO user_roles (user_id, role_id, created_at, created_by) VALUES
    (1, 1, NOW(), 1),
    (2, 2, NOW(), 1), 
    (3, 3, NOW(), 1); 
    `,
    // Adding question types
    `
    INSERT INTO question_types (name, created_at, created_by) VALUES 
    ('Likert Scale', NOW(), 1), 
    ('Multiple Choice', NOW(), 1), 
    ('True or False', NOW(), 1), 
    ('Short Answer', NOW(), 1);
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