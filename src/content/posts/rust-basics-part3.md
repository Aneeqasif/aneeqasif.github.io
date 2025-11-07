---
title: "Variables and Data Types in Rust"
published: 2024-11-10
description: 'Understanding Rust variables, mutability, and basic data types'
tags: ['Rust', 'Programming', 'Tutorial']
category: 'Tutorial'
draft: false
duckdb: "/data/blog.duckdb"
series:
  name: "Learning Rust from Scratch"
  part: 3
---

# Variables and Data Types

In this part, we'll explore how Rust handles variables and data types.

## 1. Count Orders

```sql {pw}
SELECT COUNT(*) AS rows_in_orders FROM main.orders;
```

## 2. Preview Orders

```sql {pw}
SELECT * FROM main.orders ORDER BY order_id LIMIT 5;
```
## Immutable by Default

```rust
let x = 5; // immutable
// x = 6; // This would cause an error!
```

## Mutable Variables

```rust
let mut y = 5;
y = 6; // This works!
```

:::steps

1. Install dependencies
2. Configure your environment
3. Run the app

:::

## Basic Data Types

```rust
let integer: i32 = 42;
let float: f64 = 3.14;
let boolean: bool = true;
let character: char = 'R';
```

That's the basics! Stay tuned for ownership and borrowing in the next series.
## Steps with Rich Content

You can include any markdown content inside steps:

:::steps

1. **Install the required packages**

   Run the following command in your terminal:

   ```bash
   pnpm install @astrojs/sitemap @astrojs/rss
   ```

2. **Create your configuration file**

   Add a new file called `config.json` with these settings:

   ```json
   {
     "site": "https://example.com",
     "title": "My Blog"
   }
   ```

3. **Test your setup**

   Start the development server and verify everything works:

   ```bash
   pnpm dev
   ```

   Open http://localhost:4321 in your browser.

:::

