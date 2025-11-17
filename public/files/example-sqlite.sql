PRAGMA foreign_keys = ON;

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    price REAL NOT NULL
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY,
    event TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email) VALUES
  ('Alice', 'alice@example.com'),
  ('Bob',   'bob@example.com');

INSERT INTO products (title, price) VALUES
  ('Keyboard', 50.00),
  ('Mouse', 20.00);

INSERT INTO orders (user_id, product_id, quantity) VALUES
  (1, 1, 2),
  (2, 2, 1);

INSERT INTO audit_logs (event) VALUES
  ('System started'),
  ('User logged in');