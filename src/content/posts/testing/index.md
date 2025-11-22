---
author: M. Aneeq Asif
category: Demo
description: How code blocks look in Markdown using Expressive Code.
draft: false
published: 2026-09-09
tags:
- demo
- testing
title: how i blog in emacs
---

This is a sentence with a footnote[^1].

# Overview

This file is a **comprehensive** testbed for the custom Org → GFM Lua
filter. It exercises:

- Metadata capture via top level `#+KEY: VALUE` lines go to markdown
  yaml frontmatter
- Internal Org links (converted from `spurious-link` spans to GFM links)
- Accurate Heading slugs with special characters handling
- Named tables and code blocks (`#+NAME`) → HTML anchor spans
- Code-block attributes (`:mdparams`, `:lang`, `:name`, etc.) passed
  through as Markdown fence attributes
- Org exports (`#+BEGIN_EXPORT markdown`, `#+begin_export html`)
  literally to the markdown.

Use this file as a regression test when changing the filter.

# Basic Internal Links

See [go to section two](#section-two) and then return via the back links
below.

# A heading with tags <span class="tag" tag-name="Demo"><span class="smallcaps">Demo</span></span> <span class="tag" tag-name="Markup"><span class="smallcaps">Markup</span></span>

# A heading with tag that should be hidden <span class="tag" tag-name="ATTACH"><span class="smallcaps">ATTACH</span></span>

# Section Two

Here is a link back to the first section:

[Back to Section One](#section-one)

A link **without** an explicit description (description should default
to the target text):

With out title [Section One](#section-one)

# Section One

A reciprocal link back to itself (useful for testing idempotence):

[Back to Section One](#section-one)

# Slug & Heading Tests

We now test headings and links that stress slug generation.

[My heading (v2)](#my-heading-v2)

# Intro & Usage

The following link target includes punctuation and mixed case:

So this [C++ Memory Model](#c-memory-model)

# C++ Memory Model

Heading to test plus signs and spaces. The link above should correctly
point here.

# My heading (v2)

A heading with parentheses and version information.

Back link to `Intro & Usage`:

[Intro & Usage](#intro--usage)

# Tables and Named Anchors

This link should resolve to the named table below:

[My simple table down below](#name--of-my-table-v1)

## Tables with Numbering

Named table (tests `#+NAME` → `<span id="...">` anchor, with complex
name):

<span id="name--of-my-table-v1" class="anchor-target"></span>

| Header 1 | Header 2 |
|----------|----------|
| Data 1   | Data 2   |

Named code block (also testing `#+NAME` anchors for `CodeBlock`):

<span id="name--of-my-code-v2" class="anchor-target"></span>

```python
print("Hello")

```

A reference link that should point to the table anchor above:

[This takes me to code block](#name--of-my-code-v2)

<div class="font-mono" style="font-weight: bold; margin: 0; padding-left: 1.2rem; padding-bottom: 1rem;">Output:</div>
<div class="font-mono" style="white-space: pre;padding-left: 1.2rem; line-height:1.4;">
None
</div>

# Cross-Section Links and Attachments

# Heading A <span class="tag" tag-name="ATTACH"><span class="smallcaps">ATTACH</span></span>

Links to previous sections and headings:

- [Tables with Numbering](#tables-with-numbering)

# Exported Markdown & HTML Snippets

The following block is exported as raw Markdown inside Org. It should
pass through untouched and be rendered as-is in Markdown output.

:::steps

1. Install dependencies
2. Configure your environment
3. Run the app

:::

An example block showing a text table from a tool

<div class="font-mono" style="font-weight: bold; margin: 0; padding-left: 1.2rem; padding-bottom: 1rem;">Output:</div>
<div class="font-mono" style="white-space: pre;padding-left: 1.2rem; line-height:1.4;">
+-------------+---------------------------+
| schema_name |       function_name       |
+-------------+---------------------------+
|  pg_catalog |     shobj_description     |
|  pg_catalog |         pg_typeof         |
|  pg_catalog |     pg_type_is_visible    |
|  pg_catalog | pg_ts_template_is_visible |
|  pg_catalog |  pg_ts_parser_is_visible  |
+-------------+---------------------------+
</div>

Raw HTML export (should be passed through untouched):

<span style="None">The &#x27;toml&#x27; package isn&#x27;t installed. To load settings from pyproject.toml or ~/.jupysql/config, install with: pip install toml</span>

# Code Blocks with mdparams and Attributes

The next block has complex `:mdparams` and other attributes. The filter
should:

- Put `js` as the language
- Inline all attributes into the fence header
- Leave attribute order and values intact

```javascript showLineNumbers=false collapse={1-5, 12-14, 21-24} /\/ho.*\// "given text" {"1":5} del={"2":7-8} ins={"3":10-12}
function demo() {
  // Mark any given text inside lines
  return 'Multiple matches of the given text are supported';
}
echo "Test" > /home/test.txt
// All this boilerplate setup code will be collapsed
import { someBoilerplateEngine } from '@example/some-boilerplate'
import { evenMoreBoilerplate } from '@example/even-more-boilerplate'

```

Here is some simple JavaScript code with `:del` and `:ins` attributes:

```javascript org-language=js del={"2":7-8} ins={"3":10-12}
console.log('This code is syntax highlighted!')

```

Here is a separator to visually break sections in the output:

------------------------------------------------------------------------

Code block attributes are transferred as-is from Org header args:

```javascript org-language=js frame=none
console.log('Title attribute example')

```

This line mimics a “title” attribute in the rendered Markdown:

`js title`"my-test-file.js"

Shell code block without any special attributes:

```bash org-language=sh
echo "This terminal frame has no title"

```

Diff block that should be highlighted as JavaScript due to `:lang js`:

```diff lang=js
  function thisIsJavaScript() {
    // This entire block gets highlighted as JavaScript,
    // and we can still add diff markers to it!
-   console.log('Old code to be removed')
+   console.log('New and shiny code!')
  }

```

A block that uses `:mdparams "given text"` to mark text inside lines:

```javascript "given text" org-language=js
function demo() {
  // Mark any given text inside lines
  return 'Multiple matches of the given text are supported';
}

```

# Jupyter / Session-Based Code and Example Output

Jupyter-like block with a Python session and simple text output:

```python session=py kernel=devenv exports=both
print("hi there")

```

<div class="font-mono" style="font-weight: bold; margin: 0; padding-left: 1.2rem; padding-bottom: 1rem;">Output:</div>
<div class="font-mono" style="white-space: pre;padding-left: 1.2rem; line-height:1.4;">
hi there
</div>

More complex Jupyter block that produces a table-like textual result and
an image:

```python session=py kernel=devenv exports=both results=file file=output.png
import matplotlib.pyplot as plt
import polars as pl

df = pl.DataFrame({
    "col1": [1, 2, 3],
    "col2": ["a", "b", "c"],
    "col3": [10.5, 20.1, 30.2],
    "col4": [True, False, True],
    "col5": [100, 200, 300],
    "col6": ["x", "y", "z"],
    "col7": [0.1, 0.2, 0.3],
})

print(df)

```

<div class="font-mono" style="font-weight: bold; margin: 0; padding-left: 1.2rem; padding-bottom: 1rem;">Output:</div>
<div class="font-mono" style="white-space: pre;padding-left: 1.2rem; line-height:1.4;">
shape: (3, 7)
┌──────┬──────┬──────┬───────┬──────┬──────┬──────┐
│ col1 ┆ col2 ┆ col3 ┆ col4  ┆ col5 ┆ col6 ┆ col7 │
│ ---  ┆ ---  ┆ ---  ┆ ---   ┆ ---  ┆ ---  ┆ ---  │
│ i64  ┆ str  ┆ f64  ┆ bool  ┆ i64  ┆ str  ┆ f64  │
╞══════╪══════╪══════╪═══════╪══════╪══════╪══════╡
│ 1    ┆ a    ┆ 10.5 ┆ true  ┆ 100  ┆ x    ┆ 0.1  │
│ 2    ┆ b    ┆ 20.1 ┆ false ┆ 200  ┆ y    ┆ 0.2  │
│ 3    ┆ c    ┆ 30.2 ┆ true  ┆ 300  ┆ z    ┆ 0.3  │
└──────┴──────┴──────┴───────┴──────┴──────┴──────┘
</div>

See [go to section two](#section-two)

```python session=py kernel=devenv exports=both
import matplotlib.pyplot as plt
x = [1, 2, 3, 4]
y = [2, 4, 6, 8]
plt.plot(x, y)
plt.savefig('output.svg')

# import polars as pl

# df = pl.DataFrame({
#     "col1": [1, 2, 3],
#     "col2": ["a", "b", "c"],
#     "col3": [10.5, 20.1, 30.2],
#     "col4": [True, False, True],
#     "col5": [100, 200, 300],
#     "col6": ["x", "y", "z"],
#     "col7": [0.1, 0.2, 0.3],
# })

# print(df)

```

![](.ob-jupyter/d1194631226c0b51c10bf2748939fde83e6bd9e3.png)

<div class="font-mono" style="font-weight: bold; margin: 0; padding-left: 1.2rem; padding-bottom: 1rem;">Output:</div>
<div class="font-mono" style="white-space: pre;padding-left: 1.2rem; line-height:1.4;">
shape: (3, 7)
┌──────┬──────┬──────┬───────┬──────┬──────┬──────┐
│ col1 ┆ col2 ┆ col3 ┆ col4  ┆ col5 ┆ col6 ┆ col7 │
│ ---  ┆ ---  ┆ ---  ┆ ---   ┆ ---  ┆ ---  ┆ ---  │
│ i64  ┆ str  ┆ f64  ┆ bool  ┆ i64  ┆ str  ┆ f64  │
╞══════╪══════╪══════╪═══════╪══════╪══════╪══════╡
│ 1    ┆ a    ┆ 10.5 ┆ true  ┆ 100  ┆ x    ┆ 0.1  │
│ 2    ┆ b    ┆ 20.1 ┆ false ┆ 200  ┆ y    ┆ 0.2  │
│ 3    ┆ c    ┆ 30.2 ┆ true  ┆ 300  ┆ z    ┆ 0.3  │
└──────┴──────┴──────┴───────┴──────┴──────┴──────┘
</div>

```python results=output noweb=yes noweb-prefix=no exports=both

import duckdb
duckdb.sql("""SELECT *,
  CASE WHEN n % 2 = 0 THEN 'Even' ELSE 'Odd' END AS parity
FROM (SELECT * FROM generate_series(1, 10000000) AS t(n))
WHERE n % 99999 = 0 LIMIT 4;""").show()

```

<div class="font-mono" style="font-weight: bold; margin: 0; padding-left: 1.2rem; padding-bottom: 1rem;">Output:</div>
<div class="font-mono" style="white-space: pre;padding-left: 1.2rem; line-height:1.4;">
┌────────┬─────────┐
│   n    │ parity  │
│ int64  │ varchar │
├────────┼─────────┤
│  99999 │ Odd     │
│ 199998 │ Even    │
│ 299997 │ Odd     │
│ 399996 │ Even    │
└────────┴─────────┘
</div>

[^1]: This is the footnote content.
