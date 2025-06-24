DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS employees;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL
);

CREATE TABLE employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  name TEXT,
  department TEXT,
  salary INTEGER,
  ssn TEXT,
  dob TEXT
);

-- Insert admin user: username=admin, password=admin (bcrypt hashed)
INSERT INTO users (username, password, role) VALUES (
  'admin',
  '$2b$10$KiGAYnYlQsba7lnKf.6Wye5H7gPTNroTU4qloN9tqiH1MJ7VKglzK',
  'admin'
);

