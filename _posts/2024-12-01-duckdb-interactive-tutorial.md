---
title: "DuckDB Interactive Tutorial"
date: 2024-12-01 14:30:00 +0000
categories: [Tutorial, Database]
tags: [duckdb, sql, interactive, wasm]
use_duckdb: true
---

# Interactive DuckDB Tutorial

Welcome to our interactive DuckDB tutorial! This post demonstrates how to use our custom liquid tags for creating interactive SQL blocks.

## Setting up Sample Data

First, let's create some sample tables with DDL blocks:

{% duckdb_ddl title="Employee Database" id="emp_db" %}
-- Create employee table
CREATE TABLE employees AS 
SELECT * FROM (VALUES 
    (1, 'Alice Johnson', 25, 'Engineering', 75000),
    (2, 'Bob Smith', 30, 'Design', 65000),
    (3, 'Charlie Brown', 35, 'Management', 95000),
    (4, 'Diana Wilson', 28, 'Engineering', 80000),
    (5, 'Eve Davis', 32, 'Analytics', 70000)
) AS t(id, name, age, department, salary);

-- Create projects table  
CREATE TABLE projects AS
SELECT * FROM (VALUES 
    (101, 'Website Redesign', 'Design', '2024-01-15'),
    (102, 'Mobile App', 'Engineering', '2024-02-01'),
    (103, 'Data Pipeline', 'Analytics', '2024-01-20'),
    (104, 'Performance Optimization', 'Engineering', '2024-03-01')
) AS t(project_id, project_name, department, start_date);
{% endduckdb_ddl %}

## Querying the Data

Now let's run some queries against our sample data using the new native-styled DQL blocks:

{% dql depends="emp_db" %}
-- Find all engineers
SELECT name, age, salary 
FROM employees 
WHERE department = 'Engineering'
ORDER BY salary DESC;
{% enddql %}

{% dql depends="emp_db" %}
-- Calculate department statistics
SELECT 
    department,
    COUNT(*) as employee_count,
    AVG(salary) as avg_salary,
    MAX(salary) as max_salary,
    MIN(salary) as min_salary
FROM employees 
GROUP BY department
ORDER BY avg_salary DESC;
{% enddql %}

## Standalone Queries

You can also run queries without depending on any DDL blocks:

{% dql %}
-- Simple calculations
SELECT 
    'Hello DuckDB!' as greeting,
    42 * 3.14 as calculation,
    CURRENT_DATE as today;
{% enddql %}

## Advanced Example

Let's create another DDL block for more complex examples:

{% duckdb_ddl title="E-commerce Data" id="ecom_db" %}
-- Create customers table
CREATE TABLE customers AS
SELECT * FROM (VALUES 
    (1, 'John Doe', 'john@example.com', 'New York'),
    (2, 'Jane Smith', 'jane@example.com', 'Los Angeles'),
    (3, 'Mike Johnson', 'mike@example.com', 'Chicago')
) AS t(customer_id, name, email, city);

-- Create orders table
CREATE TABLE orders AS
SELECT * FROM (VALUES 
    (1001, 1, '2024-01-15', 150.00),
    (1002, 2, '2024-01-16', 200.00),
    (1003, 1, '2024-01-17', 75.00),
    (1004, 3, '2024-01-18', 300.00)
) AS t(order_id, customer_id, order_date, amount);
{% endduckdb_ddl %}

{% dql depends="ecom_db" %}
-- Join customers with their orders
SELECT 
    c.name,
    c.city,
    COUNT(o.order_id) as total_orders,
    SUM(o.amount) as total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name, c.city
ORDER BY total_spent DESC;
{% enddql %}

## Tips for Using Interactive Blocks

- **DDL blocks** create isolated database schemas that you can reference in DQL blocks
- **DQL blocks** can depend on a DDL block using the `depends` parameter  
- You can run queries multiple times and modify them as needed
- Use **Ctrl+Enter** or **Cmd+Enter** as a keyboard shortcut to execute queries
- Results can be viewed in different formats: Table, JSON, or CSV
- **Reset button** (↻) restores original query content

Try modifying the queries above to explore the data further!

## Try It Out

1. **Expand the DDL Block**: Click on "Employee Database" to see the table creation SQL
2. **Run a Query**: The native-styled DQL blocks will automatically use the correct schema
3. **Experiment**: Try modifying the queries and use the reset button to restore original content

This demonstrates our Jekyll liquid tag integration with native theme styling!

## What's Next?

This is our enhanced DuckDB integration with native Jekyll theme styling. Features include:
- Native code block appearance with syntax highlighting
- Read-only DDL blocks with expand/collapse
- Editable DQL blocks with reset functionality  
- Seamless theme integration

Stay tuned for more interactive tutorials!
