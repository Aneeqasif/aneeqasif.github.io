---
title: "Getting Started with DuckDB"
published: 2024-11-06
description: 'Installing DuckDB and running your first queries'
tags: ['DuckDB', 'SQL', 'Database']
category: 'Tutorial'
draft: false
series:
  name: "DuckDB Essentials"
  part: 2
---

# Getting Started with DuckDB

Let's install DuckDB and run some queries!

## Installation

```bash
# Using pip
pip install duckdb

# Or download the CLI
wget https://github.com/duckdb/duckdb/releases/latest/download/duckdb_cli-linux-amd64.zip
```

## Your First Query

```sql
SELECT 'Hello, DuckDB!' as greeting;
```

## Creating a Table

```sql
CREATE TABLE users (
    id INTEGER,
    name VARCHAR,
    age INTEGER
);

INSERT INTO users VALUES (1, 'Alice', 30), (2, 'Bob', 25);
```

Next: Working with files and data sources!
