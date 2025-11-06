# DuckDB Data Files

Place your `.duckdb` files in this directory to use them with PondPilot widgets.

## Quick Start

A sample database is already included: `blog.duckdb`

To regenerate it:

```bash
cd public/data
pip install duckdb pandas
python3 create-blog-db.py
```

This creates:
- `main.orders` table (5 rows)
- `main.customers` table (5 rows)

## Usage

1. Add your `.duckdb` file to this folder (e.g., `sample.duckdb`)
2. In your post's frontmatter, add:

```yaml
---
title: "My SQL Tutorial"
duckdb: "/data/sample.duckdb"
---
```

3. All PondPilot widgets on that page will have access to the preloaded database!

## Example

If you have `public/data/northwind.duckdb`, reference it as:

```yaml
duckdb: "/data/northwind.duckdb"
```

Then in your widgets:

```sql {pw}
SELECT * FROM customers LIMIT 5;
```

The database is shared across all widgets on the page, so tables persist between queries.

## Sample Post

See `src/content/posts/pondpilot-duckdb-demo.md` for a complete example using `blog.duckdb`.
