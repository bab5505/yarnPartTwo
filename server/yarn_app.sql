-- Create database if not exists
CREATE DATABASE yarn_app;


-- Table for inventory items
CREATE TABLE inventory_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  quantity INT,
  category VARCHAR(50),
  note TEXT
);

-- Table for progress tracking
CREATE TABLE progress_tracker (
  id SERIAL PRIMARY KEY,
  item_name VARCHAR(100),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  notes TEXT
);

-- Table for projects
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  hook_size VARCHAR(10),
  needle_size VARCHAR(10),
  yarn_type VARCHAR(50),
  color VARCHAR(50)
);
