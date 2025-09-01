---
title: "DuckDB Interactive: Two DDLs, Two DQLs Each"
date: 2024-12-01 14:30:00 +0000
categories: [Tutorial, Database]
tags: [duckdb, sql, interactive, wasm]
duckdb: true
---

# DuckDB interactive demo (2 DDLs, 2 DQLs each)

This page contains exactly two independent DDL setups; each has two DQL queries that depend on it. Use the ▶ buttons to run queries (Ctrl/Cmd+Enter works too).

---

## DDL #1 — Movies dataset

{% duckdb_ddl title="Movies Dataset" id="movies_db" %}
-- Create movies table
CREATE TABLE movies AS
SELECT * FROM (VALUES
    (1, 'Inception', 2010, 'Sci-Fi'),
    (2, 'The Matrix', 1999, 'Sci-Fi'),
    (3, 'The Godfather', 1972, 'Crime'),
    (4, 'Parasite', 2019, 'Thriller'),
    (5, 'Spirited Away', 2001, 'Animation')
) AS t(movie_id, title, year, genre);

-- Create ratings table
CREATE TABLE ratings AS
SELECT * FROM (VALUES
    (1, 4.8),
    (2, 4.7),
    (3, 4.9),
    (4, 4.6),
    (5, 4.5)
) AS t(movie_id, rating);
{% endduckdb_ddl %}

### DQL for Movies (1/2)
{% dql depends="movies_db" %}
-- Average rating by genre
SELECT m.genre, ROUND(AVG(r.rating), 2) AS avg_rating, COUNT(*) AS count
FROM movies m
JOIN ratings r USING (movie_id)
GROUP BY m.genre
ORDER BY avg_rating DESC;
{% enddql %}

### DQL for Movies (2/2)
{% dql depends="movies_db" %}
-- Top-rated titles
SELECT m.title, m.year, r.rating
FROM movies m
JOIN ratings r USING (movie_id)
ORDER BY r.rating DESC, m.title ASC
LIMIT 3;
{% enddql %}

---

## DDL #2 — Sales dataset

{% duckdb_ddl title="Sales Dataset" id="sales_db" %}
-- Create products table
CREATE TABLE products AS
SELECT * FROM (VALUES
    (10, 'Laptop', 'Electronics'),
    (11, 'Headphones', 'Electronics'),
    (12, 'Coffee Beans', 'Grocery')
) AS t(product_id, name, category);

-- Create orders table
CREATE TABLE orders AS
SELECT * FROM (VALUES
    (1001, 10, '2024-06-01', 1299.99, 'New York'),
    (1002, 11, '2024-06-02', 199.99,  'Chicago'),
    (1003, 12, '2024-06-03', 15.49,   'New York'),
    (1004, 10, '2024-06-04', 1149.00, 'San Francisco'),
    (1005, 11, '2024-06-05', 179.00,  'Chicago')
) AS t(order_id, product_id, order_date, amount, city);
{% endduckdb_ddl %}

### DQL for Sales (1/2)
{% dql depends="sales_db" %}
-- Total sales by product
SELECT p.name AS product, ROUND(SUM(o.amount), 2) AS total_sales, COUNT(*) AS orders
FROM orders o
JOIN products p USING (product_id)
GROUP BY p.product_id, p.name
ORDER BY total_sales DESC;
{% enddql %}

### DQL for Sales (2/2)
{% dql depends="sales_db" %}
-- Average order value by city
SELECT city, ROUND(AVG(amount), 2) AS avg_order_value, COUNT(*) AS orders
FROM orders
GROUP BY city
ORDER BY avg_order_value DESC;
{% enddql %}

---

Notes:
- Each DQL block declares its dependency via `depends` so it runs against the right DDL setup.
- You can edit queries inline and re-run; use the ↻ button to reset a block.
