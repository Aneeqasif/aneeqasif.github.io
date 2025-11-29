---
author: M. Aneeq Asif
category: Demo
description: How code blocks look in Markdown using Expressive Code.
draft: false
published: 2026-09-09
series:
  name: testing blog
  part: 1
tags:
- demo
- testing
title: Basic Markdown
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

- See [go to section two](#section-two) and then return via the back
  links below.
- See the table. [Tables with Numbering](#tables-with-numbering)

Here is a link back to the first section:

[Back to Section One](#section-one)

A link **without** an explicit description (description should default
to the target text):

With out title [Section One](#section-one)

### Section One

A reciprocal link back to itself (useful for testing idempotence):

[Back to Section One](#section-one)

## Slug & Heading Tests

We now test headings and links that stress slug generation.

[My heading (v2)](#my-heading-v2)

## Intro & Usage

The following link target includes punctuation and mixed case:

So this [C++ Memory Model](#c-memory-model)

## C++ Memory Model

Heading to test plus signs and spaces. The link above should correctly
point here.

## My heading (v2)

A heading with parentheses and version information.

Back link to `Intro & Usage`:

[Intro & Usage](#intro--usage)

## Tables and Named Anchors

This link should resolve to the named table below:

[My simple table down below](#name--of-my-table-v1)

### Tables with Numbering

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

# Testing Heading Tags and folds

## Heading with attach tag <span class="tag" tag-name="ATTACH"><span class="smallcaps">ATTACH</span></span>

This heading's tag will not be visible.

## A heading with tags <span class="tag" tag-name="Demo"><span class="smallcaps">Demo</span></span> <span class="tag" tag-name="Markup"><span class="smallcaps">Markup</span></span> <span class="tag" tag-name="ATTACH"><span class="smallcaps">ATTACH</span></span> <span class="tag" tag-name="Fold"><span class="smallcaps">Fold</span></span>

this heading has tags, one hidden one and it is foldable.

## A foldable heading <span class="tag" tag-name="Fold"><span class="smallcaps">Fold</span></span>

this heading is foldable and initialy expanded state

## Folded heading <span class="tag" tag-name="folded"><span class="smallcaps">folded</span></span>

this is also foldable but initialy collapsed

## Section Two <span class="tag" tag-name="folded"><span class="smallcaps">folded</span></span>

this is also foldable but initialy collapsed

# Exported Markdown & HTML Snippets

The following block is exported as raw Markdown inside Org. It should
pass through untouched and be rendered as-is in Markdown output.

## Example Blocks

An example block showing a text table from a tool

<div class="font-mono example-block__label">Output:</div>
<div class="example-block__wrapper">
<div class="font-mono example-block__content">+-------------+---------------------------+
| schema_name |       function_name       |
+-------------+---------------------------+
|  pg_catalog |     shobj_description     |
|  pg_catalog |         pg_typeof         |
|  pg_catalog |     pg_type_is_visible    |
|  pg_catalog | pg_ts_template_is_visible |
|  pg_catalog |  pg_ts_parser_is_visible  |
+-------------+---------------------------+
</div></div>

Raw HTML export (should be passed through untouched):

<span style="None">The &#x27;toml&#x27; package isn&#x27;t installed. To load settings from pyproject.toml or ~/.jupysql/config, install with: pip install toml</span>

[^1]: This is the footnote content.
