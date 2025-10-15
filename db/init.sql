-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- NOTES TABLE
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- LOGS TABLE
CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  occurred_at TIMESTAMP NOT NULL DEFAULT now(),
  method TEXT,
  endpoint TEXT,
  headers JSONB,
  request_payload JSONB,
  response_body JSONB,
  status_code INTEGER
);
