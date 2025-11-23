---
title: "Variables and Data Types in Rust"
published: 2024-11-10
description: 'Understanding Rust variables, mutability, and basic data types'
tags: ['Rust', 'Programming', 'Tutorial']
category: 'Tutorial'
draft: false
duckdb: "/data/blog.duckdb"
pinned: true
series:
  name: "Learning Rust from Scratch"
  part: 3
---

# Variables and Data Types

Rust is a systems programming language designed for safety, speed, and concurrency without relying on a garbage collector. One of its defining features is **memory safety through ownership and borrowing**, which eliminates common bugs like null pointer dereferences, dangling pointers, and data races at compile time. Rust’s powerful **type system and pattern matching** encourage expressive yet predictable code, while its **zero-cost abstractions** ensure that high-level features don’t come at a runtime performance cost. The **Cargo** package manager and build tool simplify dependency management, testing, and documentation, making the developer experience both modern and efficient.

Another standout feature is Rust’s emphasis on **concurrency without fear**, achieved through its strict compile-time guarantees that prevent data races by design. It also offers **traits and generics** for flexible, reusable code and integrates well with **C via FFI (Foreign Function Interface)**, making it practical for embedding or extending existing systems. With **comprehensive tooling**, a **vibrant ecosystem (crates.io)**, and an active community, Rust strikes a rare balance between low-level control and high-level ergonomics — making it a favorite for building operating systems, web servers, game engines, and other performance-critical applications.
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

