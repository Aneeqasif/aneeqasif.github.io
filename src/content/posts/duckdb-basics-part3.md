---
title: "DuckDB with Files and Data Sources"
published: 2024-11-11
description: 'Working with CSV, Parquet, and other data formats in DuckDB'
tags: ['DuckDB', 'SQL', 'Database', 'DataEngineering']
category: 'Tutorial'
draft: false
series:
  name: "DuckDB Essentials"
  part: 3
---

# Working with Files

DuckDB excels at reading various file formats directly!

## Reading CSV Files

```sql
SELECT * FROM 'data.csv';
```

## Reading Parquet Files

```sql
SELECT * FROM 'data.parquet';
```

## Creating Tables from Files

```sql
CREATE TABLE my_data AS 
SELECT * FROM 'data.csv';
```

## Querying Remote Files

```sql
SELECT * FROM 'https://example.com/data.csv';
```

## Multiple Files at Once

```sql
SELECT * FROM 'data/*.parquet';
```

That's the power of DuckDB! More advanced topics coming in future series.
