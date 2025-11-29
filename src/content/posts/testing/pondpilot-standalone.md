---
author: M. Aneeq Asif
category: Demo
description: Testing sql widgets
draft: true
published: 2026-09-09
series:
  name: testing blog
  part: 4
tags:
- demo
- testing
title: PondPilot
---

```sql {pw}
SELECT
    'Hello, World!' as greeting,
    42 as answer,
    CURRENT_DATE as today;

```

```sql {pw}
CREATE TABLE users (
    id INTEGER,
    name VARCHAR,
    age INTEGER,
    country VARCHAR
);

INSERT INTO users VALUES
    (1, 'Alice', 22, 'US'),
    (2, 'Bob',   17, 'UK'),
    (3, 'Carol', 35, 'PK'),
    (4, 'Dave',  29, 'US');

```

```sql {pw}
SELECT
    name,
    age,
    CASE
        WHEN age < 18 THEN 'minor'
        WHEN age BETWEEN 18 AND 30 THEN 'young adult'
        ELSE 'adult'
    END AS age_group
FROM users;

```
