---
title: PondPilot with DuckDB File Demo
published: 2024-11-04
description: 'Loading and querying a local .duckdb file with PondPilot widgets'
tags: ['SQL', 'DuckDB', 'Database', 'Demo']
category: 'Demo'
draft: true
duckdb: "/data/blog.duckdb"
---

# Loading Local DuckDB Files

This demo loads a preloaded `.duckdb` file from the server. The file contains `main.orders` and `main.customers` tables.

## 1. Count Orders

```sql {pw}
SELECT COUNT(*) AS rows_in_orders FROM main.orders;
```

## 2. Preview Orders

```sql {pw}
SELECT * FROM main.orders ORDER BY order_id LIMIT 5;
```

## 3. Join Orders with Customers

```sql {pw}
SELECT 
    o.order_id, 
    o.customer, 
    c.tier, 
    o.amount
FROM main.orders o
JOIN main.customers c USING(customer)
ORDER BY o.order_id;
```

## 4. Create New Table

Create a products table that we'll use for analysis:

```sql {pw}
CREATE OR REPLACE TABLE products AS
SELECT * FROM (VALUES
    (1, 'Widget', 29.99),
    (2, 'Gadget', 49.50),
    (3, 'Doohickey', 15.00),
    (4, 'Thingamajig', 99.95),
    (5, 'Whatsit', 10.00)
) AS t(product_id, product_name, price);

SELECT * FROM products;
```

## 5. Join New Table with Existing Data

Join the newly created products table with orders (matching by amount to product price):

```sql {pw}
SELECT 
    o.order_id,
    o.customer,
    c.tier,
    p.product_name,
    o.amount as price
FROM main.orders o
JOIN main.customers c USING(customer)
JOIN products p ON o.amount = p.price
ORDER BY o.order_id;
```

```sql
SELECT 
    o.order_id,
    o.customer,
    c.tier,
    p.product_name,
    o.amount as price
FROM main.orders o
JOIN main.customers c USING(customer)
JOIN products p ON o.amount = p.price
ORDER BY o.order_id;

```


```ps frame="code" title="PowerShell Profile.ps1"
# Without overriding, this would be a terminal frame
function Watch-Tail { Get-Content -Tail 20 -Wait $args }
New-Alias tail Watch-Tail
```

---

**Note:** All widgets on this page share the same DuckDB instance. Tables created in one widget (like `products`) are accessible in all other widgets!
