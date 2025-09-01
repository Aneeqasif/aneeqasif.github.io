---
title: "DuckDB Liquid Tags Test"
date: 2024-12-01 16:00:00 +0000
categories: [Tutorial, Database]
tags: [duckdb, sql, liquid, test]
duckdb: true
---

# DuckDB Liquid Tags Test

Testing the DuckDB liquid tags with the new conditional include system.

## Basic DDL Block

{% duckdb_ddl title="Basic Schema" id="basic_schema" %}
CREATE TABLE users AS 
SELECT * FROM (VALUES 
    (1, 'Alice', 'alice@example.com'),
    (2, 'Bob', 'bob@example.com'),
    (3, 'Charlie', 'charlie@example.com')
) AS t(id, name, email);
{% endduckdb_ddl %}

## Query with Dependencies

{% dql depends="basic_schema" %}
SELECT * FROM users WHERE name LIKE 'A%';
{% enddql %}

This should work with the new `duckdb: true` front matter setting!
