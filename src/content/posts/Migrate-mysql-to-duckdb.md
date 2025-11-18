---
title: Migrate MySQL to DuckDB
published: 2025-11-17
description: ''
image: ''
tags: [DataMigration, SQL, Duckdb]
category: 'Data Engineering'
draft: false
duckdb: ''
lang: ''
pinned: false
---


# Intro

Recently, I needed to move a MySQL database into DuckDB to run fast, local analytics without spinning up heavy infrastructure. Instead of writing custom scripts or building an ETL pipeline, I discovered that DuckDB has a nice MySQL extension that can connect to a MySQL database and supports Direct Querying, Bulk Transfer and Bi-directional read/write.

It turned out to be surprisingly smooth—so here’s the exact workflow I used, along with short explanations to make it easy for you to follow.

---

# Step-by-Step Workflow

Let’s start by attaching a DuckDB session to a local file. 

```bash
duckdb duckwind.db
```
After that process is very straightforward:

## Migrate Data

:::steps
1. **Install and Load MySQL Extension**

    ```sql frame="none"
    INSTALL mysql;
    LOAD mysql;
    ```

2. **Attach to MySQL Database**

    ```sql 'host=localhost user=user database=Northwind password=test' 
    ATTACH 'host=localhost user=user database=Northwind password=test' 
        AS mysqldb (TYPE mysql);
    USE mysqldb;
    ```
    Pass any required [connection parameters](https://duckdb.org/docs/stable/core_extensions/mysql)


3. **Pull MySQL Data To Local Catalog**

    ```sql "Northwind"
    COPY FROM DATABASE mysqldb TO duckwind;
    -- or TO MEMORY if not attached to a file.
    SET search_path = 'Northwind,main';
    ```
    We should add the imported schema to search path for ease of use.


4. **Clean Up Unwanted Schemas (Optional)**
    ```sql
    DROP SCHEMA IF EXISTS mysql CASCADE;
    DROP SCHEMA IF EXISTS information_schema CASCADE;
    DROP SCHEMA IF EXISTS performance_schema CASCADE;
    DROP SCHEMA IF EXISTS sys CASCADE;
    ```

:::

## Backup
Optionally, if you want to create a backup, you can do it as follows:

:::steps
1. **Backup**

   - The export directory contains schema, tables, metadata, and views.
   - It’s ideal for backups, sharing datasets, or keeping version-controlled snapshots.
    ```sql
    EXPORT DATABASE 'target_directory';
    ```
    We can also export to Parquet for better portability and compression efficiency.
    ```sql
    EXPORT DATABASE 'target_directory' (
        FORMAT parquet,
        COMPRESSION zstd,
        ROW_GROUP_SIZE 50_000
    );
    ```

2. **Importing Back**
    ```sql
    IMPORT DATABASE 'source_directory';
:::
---

# **Final Thoughts**

This workflow made my MySQL → DuckDB migration quick and clean. DuckDB handles the heavy lifting—attaching to MySQL, copying schema and data, exporting everything, and rebuilding it later with zero friction.

Let me know if anything above can be improved — or if there’s anything else you’d like added here.

Keep querying! ✨