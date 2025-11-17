---
title: 'PgLoader: Reliable Database Migration to PostgreSQL'
published: 2025-11-16
description: ''
image: ''
tags: [DataMigration, SQL, pgloader]
category: 'Data Engineering'
draft: false
duckdb: ''
lang: ''
pinned: false
---

PostgreSQL is one of the most loved databases among developers, and for good reason. The number of features it packs can make it hard to wrap your head around everything it can do. So it's no surprise that you might want to migrate your data from another database to PostgreSQL.

While it's not something you do every day, when the problem of database migration arrives, it can feel daunting. You'll find many solutions for data migration, but most are built for simple **homogeneous** migrations (like MySQL to MySQL). Tools that support full schema+data **heterogeneous** migrations—i.e., moving from one database technology to another—are fewer.

Here’s a quick look at some approaches:

- **Manual approach:** Dump the data from the source database and import it into the target, then manually construct the schema. This is error-prone and tedious. There are great libraries like [sqlglot](https://github.com/tobymao/sqlglot) that can help you parse and translate different SQL dialects. I tried going down this road, and it was a bit exhaustive, to say the least.
- **Proprietary Tools:**  Some commercial tools like Sqlines or Navicat promise smooth data migration. The catch? They can be quite expensive, and since I'm a bit of a cheapskate and haven't personally used them, I can't vouch for their magic.
- **pgloader:** This is the solution that worked like butter for me. It supports migrating to PostgreSQL from several common sources including MySQL, SQLite, and MS SQL Server. pgloader is [open-source](https://github.com/dimitri/pgloader) and written in Common Lisp.
- **ora2pg:** Another open-source tool ([GitHub](https://github.com/darold/ora2pg)) for migrating Oracle databases to PostgreSQL. It's written in Perl and is quite robust.


# Say Hello to Pgloader
So, how does pgloader perform its magic? Instead of just parsing a static SQL dump, it reads database metadata from a live connection to your source database. After querying the source's catalog, pgloader creates the target PostgreSQL schema by translating source definitions into PostgreSQL equivalents.

The real power is its flexible [domain-specific language (DSL)](https://pgloader.readthedocs.io/en/latest/command.html#command-syntax) that lets you dial in the exact behavior you want. Don't let that scare you off—it's actually very simple and minimal.

Here are some of its notable features:


- **Schema Discovery:** Automatically reads source tables, columns, constraints, indexes, and comments to recreate the PostgreSQL schema.
- **Continuous Migration:** PgLoader supports regular, repeated runs by automatically handling schema drop/create keeping source and target databases synchronized. [See more](https://pgloader.io/blog/continuous-migration/).
- **Custom Casting Rules:** Tell Pgloader exactly how to transform a `DATETIME` from MySQL into a `TIMESTAMPTZ` in Postgres, how to handle enums, or any other transformations.
- **Execution Hooks:** Run specific SQL queries _before_ or _after_ loading the data or schema creation. This is perfect for pre-migration setup or post-migration cleanup.
- **Partial Migrations**: Include or exclude specific tables using regex for precise control.
- **Templating with Mustache:** Interpolate environment variables, secrets, or other dynamic values into your migration scripts.

Okay, enough of the boilerplate. Let's go through some examples.

# PgLoader In Action

For common migrations, pgloader can be invoked with a one-liner shell command. For more advanced requirements you can use a pgloader load file.

## Migrate from SQLite

```bash
createdb fromsqlite
pgloader ./test/sqlite/sqlite.db postgresql:///fromsqlite
```

### Sqlite — Advanced Example
Now let's create a sample database with four tables: `audit_logs`, `orders`, `products`, and `users`. We'll do a **partial migration** that excludes the `audit_logs` table.

You can [Download SQL example](/files/example-sqlite.sql) and test it out yourself.

```bash frame="none"
sqlite3 example.db < example-sqlite.sql
```

```sql title="sqlite-partial.load" {"1.":2} {"2.":4-5} ins={"3.":7-8} {"4.":10-11}
LOAD DATABASE
    FROM sqlite://</absolute/path/to/example.db>


    INTO postgresql://postgres:{{DBPASS}}@localhost/sqlite-partial-test


INCLUDING ONLY TABLE NAMES like 'users', 'orders', 'products'


WITH include drop, create tables, create indexes, reset sequences;
```

1. We need an absolute path here.
2. **Templated connection string:** We don't hardcode the password; instead we provide it through a shell variable.
3. **Partial migration:** We are not migrating the `audit_logs` table.
4. **Load options:** See load option documentation [here](https://pgloader.readthedocs.io/en/latest/command.html#with).

| Option            | Purpose                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `include drop`    | Drop target tables before loading to start fresh                                           |
| `create tables`   | Create table schema in PostgreSQL based on the source DB                                   |
| `create indexes`  | Recreate indexes in PostgreSQL to match the source                                         |
| `reset sequences` | Ensure PG sequences match the current max values in their columns to prevent ID conflicts. |

This allows us to repeat the migration as many times as needed. See [Continuous Migration](https://pgloader.io/blog/continuous-migration/) for more details.

Now run the script with pgloader
```bash  
# first create target db in PostgreSQL
createdb sqlite-partial-test
# Now let it cook
DBPASS=yourpass pgloader sqlite_partial.load
```

## Migrate from MySQL

Again, for simple needs this is a one-shot operation.

```bash frame="none"
pgloader mysql://myuser@myhost/dbname pgsql://pguser@pghost/dbname
```

### Using a Load File

```sql del={"!! Import in Public Schema":26-28} {15-21}
LOAD DATABASE
     FROM mysql://aneeq:test@localhost/Northwind
     INTO postgresql://adminuser:pass@localhost/northwind

WITH on error stop
     include drop,
     create tables,
     create indexes,
     reset sequences,
     workers = 4
     concurrency = 2,
     batch rows = 1000,
     batch size = 50 MB,
     prefetch rows = 50000

SET PostgreSQL PARAMETERS
    maintenance_work_mem to '256MB',
    work_mem to '64MB',

SET MySQL PARAMETERS
    net_read_timeout = '300',
    net_write_timeout = '300'

MATERIALIZE VIEWS active_employees
INCLUDING ONLY TABLE NAMES MATCHING ~/employees/, ~/departments/


WITH CREATE NO SCHEMA
ALTER SCHEMA 'Northwind' RENAME TO 'public';

AFTER LOAD DO
    $$ COMMENT ON TABLE company_schema.company_employees IS 'Employee data migrated from MySQL'; $$,
    $$ COMMENT ON TABLE company_schema.departments IS 'Department information'; $$,
```
:::tip
Like me, you may be tempted to load data into the public schema; it's not recommended though. Keep objects in a schema named for your database (for example `northwind`) and add that schema to the database's default search_path: `ALTER DATABASE dbname SET search_path TO northwind, public;` in PostgreSQL ([Advice by PgLoader's author](https://github.com/dimitri/pgloader/issues/645))
:::


I added a few optimization [options](https://pgloader.readthedocs.io/en/latest/command.html?highlight=batch%20rows#batch-behaviour-options) to show some features you can fine-tune if needed.

# Conclusion

So there you go—I really enjoyed working with pgloader and hope you will too. Migrating to PostgreSQL doesn’t have to be painful. pgloader simplifies the process and handles both schema and data translation intelligently. Moving from MySQL—or any other supported source—becomes efficient, reliable, and surprisingly smooth. Refer to the [pgloader documentation](https://pgloader.readthedocs.io/en/latest/index.html) or manpage for detailed guidance.

