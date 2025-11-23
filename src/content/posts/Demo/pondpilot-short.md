---
title: PondPilot Short
published: 2024-11-09
description: "Demonstrating interactive SQL queries with DuckDB in the browser using PondPilot widget"
tags: ["SQL", "DuckDB", "Interactive", "Demo" , "programming", "computers"]
category: "Demo"
draft: false
duckdb: ""
pinned: true
---

# PondPilot Interactive SQL Demo

Run SQL queries directly in your browser using DuckDB WASM. All widgets share a single DuckDB instance.

## Features

✅ **Shared DuckDB instance** - All widgets on the page share the same instance  
✅ **Persistent state** - Tables created in one widget are accessible in all others  
✅ **Load .duckdb files** - Specify `duckdb: "/data/file.duckdb"` in frontmatter to preload data  
✅ **Theme auto-detection** - Matches your site's dark/light mode automatically  
✅ **Editable/Read-only** - Control editing with `data-editable` parameter  
✅ **Keyboard shortcuts** - `Ctrl+Enter` or `Cmd+Enter` to run queries  
✅ **No backend needed** - Everything runs in your browser

## Quick Start

Click "Run" or press `Ctrl+Enter` (or `Cmd+Enter` on Mac):

```sql {pw}
SELECT
    'Hello, World!' as greeting,
    42 as answer,
    CURRENT_DATE as today;
```


<!-- ## Shared Instance Test -->

<!-- Create a table in one widget: -->

<!-- ```sql {pw} -->
<!-- CREATE TABLE products AS  -->
<!-- SELECT * FROM (VALUES  -->
<!--     (1, 'Laptop', 999.99, 'Electronics'), -->
<!--     (2, 'Mouse', 25.50, 'Electronics'), -->
<!--     (3, 'Desk', 199.99, 'Furniture'), -->
<!--     (4, 'Chair', 149.99, 'Furniture') -->
<!-- ) AS t(id, name, price, category); -->
<!-- ``` -->

<!-- Query it in another (proves shared instance): -->

<!-- ```sql {pw} -->
<!-- SELECT  -->
<!--     category, -->
<!--     COUNT(*) as item_count, -->
<!--     ROUND(AVG(price), 2) as avg_price -->
<!-- FROM products  -->
<!-- GROUP BY category; -->
<!-- ``` -->

<!-- ## Read-Only Widget -->

<!-- Make widgets read-only with `data-editable="false"`: -->

<!-- ```sql {pw data-editable="false"} -->
<!-- SELECT name, price FROM products WHERE price > 100 ORDER BY price DESC; -->
<!-- ``` -->

<!-- ## Window Functions -->

<!-- ```sql {pw} -->
<!-- WITH data AS ( -->
<!--     SELECT * FROM (VALUES  -->
<!--         ('Alice', 85), ('Bob', 92), ('Charlie', 78),  -->
<!--         ('Diana', 95), ('Eve', 88) -->
<!--     ) AS t(name, score) -->
<!-- ) -->
<!-- SELECT  -->
<!--     name, -->
<!--     score, -->
<!--     RANK() OVER (ORDER BY score DESC) as rank, -->
<!--     ROUND(AVG(score) OVER (), 2) as avg_score -->
<!-- FROM data -->
<!-- ORDER BY score DESC; -->
<!-- ``` -->

<!-- ## Features Summary -->

<!-- ✅ **Single shared instance** - All widgets share the same DuckDB instance   -->
<!-- ✅ **Persistent state** - Tables created in one widget are accessible in all others   -->
<!-- ✅ **Load .duckdb files** - Add `duckdb: "/data/file.duckdb"` in frontmatter to preload data   -->
<!-- ✅ **Theme auto-detection** - Matches your site's dark/light mode   -->
<!-- ✅ **Editable/Read-only** - Control editing with `data-editable="true"/"false"`   -->
<!-- ✅ **Keyboard shortcuts** - `Ctrl+Enter` or `Cmd+Enter` to run   -->
<!-- ✅ **No backend needed** - Everything runs in your browser -->

<!-- ## Usage -->

<!-- ### Basic Widget -->

<!-- ```markdown -->
<!-- \`\`\`sql {pw} -->
<!-- SELECT 'Hello, World!' as message; -->
<!-- \`\`\` -->
<!-- ``` -->

<!-- ### Read-Only Widget -->

<!-- ```markdown -->
<!-- \`\`\`sql {pw data-editable="false"} -->
<!-- SELECT * FROM products; -->
<!-- \`\`\` -->
<!-- ``` -->

<!-- ### Load .duckdb File -->

<!-- Add to your post's frontmatter: -->

<!-- ```yaml -->
<!-- --- -->
<!-- title: "SQL Tutorial" -->
<!-- duckdb: "/data/sample.duckdb" -->
<!-- --- -->
<!-- ``` -->

<!-- Put `sample.duckdb` in the `public/data/` folder. All widgets on that page will have access to the preloaded database! -->

<!-- ## Supported Parameters -->

<!-- - **`data-editable`** - `"true"` (default) or `"false"` - Control if SQL can be edited -->
<!-- - **`data-theme`** - `"light"`, `"dark"`, or `"auto"` - Override theme (auto-detected by default) -->
