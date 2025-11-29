---
author: M. Aneeq Asif
category: Demo
description: Testing sql widgets
draft: false
duckdb: /data/blog.duckdb
published: 2026-09-09
series:
  name: testing blog
  part: 5
tags:
- demo
- testing
title: PondPilot with Files
---

# Testing sql widget with local file

```sql {pw}
SELECT COUNT(*) AS rows_in_orders FROM main.orders;

```

## Sql basic operations

```sql {pw}
SELECT * FROM main.orders ORDER BY order_id LIMIT 5;

```

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

## Create New Table (will give ERROR)

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

### Join New Table with Existing Data

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
