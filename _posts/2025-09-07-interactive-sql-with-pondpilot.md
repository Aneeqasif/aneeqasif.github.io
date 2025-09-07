---
title: Interactive SQL in the Browser with PondPilot Widget
date: 2025-08-07 12:00:00 +0500
toc: true
comments: true
math: false
use_sql: true
categories: [technology, data]
tags: [sql, duckdb, javascript, web-development, data-analysis]
image:
  path: /assets/img/workstation-grey.jpg
  alt: Interactive SQL Demo with PondPilot Widget
  lqip: /assets/img/workstation-grey-lqip.webp
---

### Working with Generated Data

{% include pondpilot.html 
   title="Number Generation and Calculations"
   description="Generate a sequence of numbers and perform various calculations"
   sql="-- Generate a sequence of numbers and perform calculations
SELECT 
    num,
    num * 2 as doubled,
    num^2 as squared,
    CASE 
        WHEN num % 2 = 0 THEN 'Even'
        ELSE 'Odd'
    END as parity
FROM generate_series(1, 10) AS t(num)
ORDER BY num;" %}
