---
title: "DuckDB Test - Simple Example"
date: 2024-12-01 15:00:00 +0000
categories: [Tutorial, Database]
tags: [duckdb, sql, test]
duckdb: true
---

# DuckDB Test

This is a simple test to verify the new DuckDB integration using the theme's conditional include pattern.

## Create Sample Data

{% duckdb_ddl title="Sample Data" id="test_data" %}
CREATE TABLE products AS 
SELECT * FROM (VALUES 
    (1, 'Laptop', 'Electronics', 999.99),
    (2, 'Coffee', 'Food', 4.99),
    (3, 'Book', 'Education', 29.99),
    (4, 'Phone', 'Electronics', 699.99)
) AS t(id, name, category, price);
{% endduckdb_ddl %}

## Query the Data

{% dql depends="test_data" %}
SELECT category, 
       COUNT(*) as product_count,
       AVG(price) as avg_price
FROM products 
GROUP BY category 
ORDER BY avg_price DESC;
{% enddql %}

## Standalone Query

{% dql %}
SELECT 'Hello DuckDB!' as greeting, 
       42 * 3.14 as calculation,
       CURRENT_DATE as today;
{% enddql %}

---

If you can see the interactive blocks above with proper styling and can execute queries, the implementation is working correctly!
