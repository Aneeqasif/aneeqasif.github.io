# Jekyll Chirpy Theme - Architecture Documentation

> **Note**: This architecture documentation was created for Jekyll Chirpy Theme version 7.3.1 (August 2025).
> This document provides a comprehensive overview of the codebase structure, components, and mechanisms.

## Table of Contents

1. [Overview](#overview)
2. [Core Architecture](#core-architecture)
3. [Directory Structure](#directory-structure)
4. [Configuration System](#configuration-system)
5. [Layout System](#layout-system)
6. [Styling Architecture](#styling-architecture)
7. [JavaScript Architecture](#javascript-architecture)
8. [Data Management](#data-management)
9. [Content Management](#content-management)
10. [Build System](#build-system)
11. [Asset Management](#asset-management)
12. [Plugin System](#plugin-system)
13. [Customization Hooks](#customization-hooks)
14. [Development Workflow](#development-workflow)

## Overview

The Jekyll Chirpy theme is a modern, responsive blog theme built on Jekyll static site generator. It follows a modular architecture with clear separation of concerns between layout, styling, JavaScript functionality, and content management.

### Key Features
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Dark/Light Theme**: Automatic theme switching with manual override
- **Modular JavaScript**: ES6 modules with Rollup bundling
- **SCSS Architecture**: Organized styling with theme variables
- **PWA Support**: Progressive Web App capabilities
- **SEO Optimized**: Built-in SEO tags and meta management
- **Internationalization**: Multi-language support

## Core Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Jekyll Static Site                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Layouts   │  │   Includes  │  │      Content        │  │
│  │             │  │             │  │  (_posts, _pages)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    SCSS     │  │ JavaScript  │  │       Data          │  │
│  │   Modules   │  │   Modules   │  │   (_data/*.yml)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │Build System │  │   Assets    │  │     Plugins         │  │
│  │(Rollup/npm) │  │  (Static)   │  │   (Ruby hooks)      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

### Core Jekyll Directories

```
├── _config.yml              # Main Jekyll configuration
├── _layouts/                # Page layout templates
│   ├── default.html         # Base layout with sidebar, topbar
│   ├── home.html           # Homepage with post listing
│   ├── post.html           # Individual post layout
│   ├── page.html           # Static page layout
│   ├── categories.html     # Category listing page
│   ├── tags.html           # Tag listing page
│   └── archives.html       # Archive page layout
├── _includes/              # Reusable template components
│   ├── head.html           # HTML head section
│   ├── sidebar.html        # Left navigation sidebar
│   ├── topbar.html         # Top navigation bar
│   ├── footer.html         # Site footer
│   ├── toc.html            # Table of contents
│   └── [various components]
├── _posts/                 # Blog post content (Markdown)
├── _drafts/                # Draft posts (not published)
├── _tabs/                  # Navigation tab pages
├── _data/                  # YAML data files
└── _site/                  # Generated static site (build output)
```

### Styling and Scripts

```
├── _sass/                  # SCSS source files
│   ├── main.scss           # Main SCSS entry point
│   ├── base/               # Base styles (typography, reset)
│   ├── components/         # UI components (buttons, cards)
│   ├── layout/             # Layout components (sidebar, topbar)
│   ├── pages/              # Page-specific styles
│   ├── themes/             # Theme variables (light/dark)
│   └── vendors/            # Third-party styles
├── _javascript/            # JavaScript source files
│   ├── [page-specific].js  # Entry points (home.js, post.js, etc.)
│   ├── theme.js            # Theme management
│   ├── modules/            # Modular components
│   │   ├── components/     # UI component scripts
│   │   └── layouts/        # Layout-specific scripts
│   └── pwa/                # Progressive Web App files
└── assets/                 # Static assets and compiled files
    ├── css/                # Compiled CSS
    ├── js/                 # Compiled JavaScript
    ├── img/                # Images
    └── lib/                # Third-party libraries
```

### Build and Configuration

```
├── package.json            # Node.js dependencies and scripts
├── rollup.config.js        # JavaScript bundling configuration
├── purgecss.js            # CSS purging configuration
├── Gemfile                 # Ruby gem dependencies
├── tools/                  # Development scripts
│   ├── run.sh             # Local development server
│   └── test.sh            # Build script
└── docs/                   # Documentation
```

## Configuration System

### Main Configuration (`_config.yml`)

The Jekyll configuration file controls the overall site behavior:

```yaml
# Core Settings
theme: jekyll-theme-chirpy
lang: en
timezone: Asia/Karachi
title: "Site Title"
tagline: "Site Tagline"

# SEO and Social
description: "Site description for SEO"
url: "https://yourdomain.com"
social:
  name: "Author Name"
  email: "email@domain.com"
  links: [...]

# Analytics
analytics:
  google:
    id: "GA-ID"
  goatcounter:
    id: "counter-id"

# Features
toc: true                   # Table of contents
theme_mode: [light|dark]    # Default theme
pwa:
  enabled: true             # Progressive Web App
  cache:
    enabled: false          # Offline caching
```

### Build Configuration

- **`package.json`**: Node.js build scripts and dependencies
- **`rollup.config.js`**: JavaScript bundling and minification
- **`purgecss.js`**: CSS optimization and unused style removal

## Layout System

### Layout Hierarchy

```
default.html (Base Layout)
├── compress.html (HTML compression)
├── sidebar.html (Navigation)
├── topbar.html (Top navigation)
├── main content area
│   ├── home.html (Homepage)
│   ├── post.html (Blog posts)
│   ├── page.html (Static pages)
│   └── [other layouts]
├── panel-wrapper (Right sidebar)
└── footer.html
```

### Layout Components

1. **Default Layout** (`_layouts/default.html`)
   - Base HTML structure
   - Includes sidebar, topbar, main content area
   - Handles theme mode detection
   - Manages responsive layout

2. **Home Layout** (`_layouts/home.html`)
   - Post listing with pagination
   - Pinned posts handling
   - Post preview cards

3. **Post Layout** (`_layouts/post.html`)
   - Article content display
   - Table of contents (TOC)
   - Post metadata (dates, authors, tags)
   - Related posts and navigation
   - Comment system integration

### Include System

Reusable components in `_includes/`:

- **`head.html`**: Meta tags, CSS/JS loading, favicons
- **`sidebar.html`**: Navigation menu, site info, theme toggle
- **`topbar.html`**: Breadcrumbs, search functionality
- **`toc.html`**: Automatic table of contents generation
- **`footer.html`**: Site footer with links and copyright

## Styling Architecture

### SCSS Structure

```
_sass/
├── main.scss               # Main entry point
├── main.bundle.scss        # Production bundle
├── abstracts/              # Variables, mixins, functions
├── base/                   # Reset, typography, base elements
├── components/             # Buttons, cards, forms, etc.
├── layout/                 # Sidebar, topbar, footer layouts
├── pages/                  # Page-specific styles
├── themes/                 # Light/dark theme variables
└── vendors/                # Third-party library styles
```

### Theme System

The theme uses CSS custom properties for dynamic theming:

```scss
// Light theme variables
:root {
  --text-color: #212529;
  --bg-color: #ffffff;
  --sidebar-bg: #f8f9fa;
  // ... other variables
}

// Dark theme variables
[data-mode="dark"] {
  --text-color: #e9ecef;
  --bg-color: #161618;
  --sidebar-bg: #1b1b1e;
  // ... other variables
}
```

### Responsive Design

- Mobile-first approach using Bootstrap 5 grid system
- Breakpoints: `576px`, `768px`, `992px`, `1200px`, `1400px`
- Responsive sidebar (collapsible on mobile)
- Adaptive typography and spacing

## JavaScript Architecture

### Module System

The JavaScript follows ES6 module architecture:

```
_javascript/
├── [page].js               # Entry points for each page type
├── theme.js                # Theme management (loaded synchronously)
├── modules/
│   ├── components/         # Individual UI components
│   │   ├── back-to-top.js
│   │   ├── clipboard.js
│   │   ├── img-popup.js
│   │   ├── mode-toggle.js
│   │   ├── toc.js
│   │   └── [others]
│   └── layouts/            # Layout-specific functionality
│       ├── basic.js        # Common functionality
│       ├── sidebar.js      # Sidebar interactions
│       └── topbar.js       # Topbar functionality
└── pwa/                    # Progressive Web App
    ├── app.js
    └── sw.js
```

### Page-Specific Entry Points

Each page type has its own JavaScript entry point:

- **`home.js`**: Homepage functionality (image loading, sidebar, topbar)
- **`post.js`**: Post page features (TOC, code copying, image popup)
- **`page.js`**: Static page functionality
- **`categories.js`**: Category collapse functionality
- **`misc.js`**: General utility functions

### Theme Management

The `theme.js` file handles light/dark theme switching:

```javascript
class Theme {
  static get DARK() { return 'dark'; }
  static get LIGHT() { return 'light'; }
  
  static init() { /* Initialize theme based on system/stored preference */ }
  static flip() { /* Toggle between light and dark */ }
  static notify() { /* Notify other components of theme change */ }
}
```

### Build Process

JavaScript is bundled using Rollup with:
- Babel for ES6+ transpilation
- Terser for minification
- Jekyll frontmatter injection
- Tree shaking for smaller bundles

## Data Management

### Data Files (`_data/`)

```
_data/
├── authors.yml             # Author information
├── contact.yml             # Contact method configuration
├── media.yml               # Media queries and breakpoints
├── share.yml               # Social sharing options
├── locales/                # Internationalization
│   ├── en.yml
│   ├── [other languages]
└── origin/                 # CDN and external resource configuration
    └── cors.yml
```

### Configuration Data

- **`contact.yml`**: Defines contact methods (GitHub, Twitter, email, RSS)
- **`share.yml`**: Social media sharing platform configuration
- **`origin/cors.yml`**: CDN endpoints for external libraries
- **`locales/`**: Translation strings for different languages

## Content Management

### Posts (`_posts/`)

Blog posts follow Jekyll naming convention:
```
YYYY-MM-DD-title.md
```

Front matter structure:
```yaml
---
title: "Post Title"
date: 2024-01-01 12:00:00 +0000
categories: [Category1, Category2]
tags: [tag1, tag2]
pin: true                   # Pin to top
hidden: false               # Hide from listings
image:
  path: /path/to/image.jpg
  alt: "Image description"
  lqip: data:image/jpeg;base64,... # Low quality placeholder
description: "Post description for SEO"
---
```

### Navigation Tabs (`_tabs/`)

Static navigation pages:
- `about.md`: About page
- `archives.md`: Post archives
- `categories.md`: Category listing
- `tags.md`: Tag listing

### Draft System (`_drafts/`)

Unpublished posts stored without date prefix. Use `jekyll serve --drafts` to preview.

## Build System

### Development Workflow

1. **Local Development**: `./tools/run.sh`
   - Starts Jekyll server with live reload
   - Watches for file changes
   - Serves on `http://127.0.0.1:4000`

2. **Asset Building**:
   ```bash
   npm run build:css        # Compile and purge CSS
   npm run build:js         # Bundle JavaScript
   npm run watch:js         # Watch mode for JS development
   npm run build           # Build all assets
   ```

3. **Production Build**: `./tools/test.sh`
   - Optimizes assets
   - Minifies code
   - Generates static site

### Build Pipeline

```
Source Files → Processing → Optimization → Output
     ↓             ↓            ↓          ↓
   SCSS    →    Sass     →   PurgeCSS  → CSS
JavaScript →   Rollup    →   Terser    → JS
  Markdown  →   Jekyll    →   Minify    → HTML
   Assets   →    Copy     →   Optimize  → Static
```

## Asset Management

### Static Assets (`assets/`)

```
assets/
├── css/
│   ├── jekyll-theme-chirpy.scss    # Main stylesheet
│   └── [custom styles]
├── js/
│   └── dist/                       # Compiled JavaScript
├── img/                            # Site images
└── lib/                            # Third-party libraries
```

### CDN Integration

External resources are configured in `_data/origin/cors.yml`:
- Font Awesome icons
- Bootstrap CSS (development)
- JavaScript libraries (Mermaid, GLightbox, etc.)
- Web fonts

### Image Handling

- Automatic lazy loading with polyfill
- LQIP (Low Quality Image Placeholder) support
- Image popup gallery with GLightbox
- Responsive image sizing

## Plugin System

### Ruby Plugins (`_plugins/`)

- **`posts-lastmod-hook.rb`**: Automatically updates `last_modified_at` based on Git history

### Jekyll Plugins (Gems)

Configured in `Gemfile`:
- `jekyll-seo-tag`: SEO meta tags
- `jekyll-archives`: Category and tag archives
- `jekyll-sitemap`: XML sitemap generation
- `jekyll-feed`: RSS/Atom feed

## Customization Hooks

### Layout Hooks

The theme provides hook points for customization without modifying core files:

1. **CSS Hooks**:
   - `assets/css/jekyll-theme-chirpy.scss`: Main style customization
   - `_sass/variables-hook.scss`: Variable overrides

2. **Layout Hooks**:
   - Create `_includes/hooks/[layout]-hook.html` for layout-specific additions
   - Example: `_includes/hooks/post-hook.html` for post page customizations

3. **JavaScript Hooks**:
   - Custom scripts can be added to `assets/js/`
   - Include in layouts via `script_includes` front matter

### Customization Best Practices

1. **Never modify theme core files directly**
2. **Use the provided hook system**
3. **Keep customizations in `assets/` directory**
4. **Document changes for future reference**

## Development Workflow

### File Organization

```
Development Files (Source)      →    Production Files (Output)
├── _javascript/               →    assets/js/dist/
├── _sass/                     →    assets/css/
├── _posts/ (Markdown)         →    _site/posts/ (HTML)
├── _includes/                 →    (embedded in layouts)
└── _layouts/                  →    (applied to content)
```

### Development Commands

```bash
# Start development server
./tools/run.sh

# Build production assets
npm run build

# Watch JavaScript changes
npm run watch:js

# Lint SCSS
npm run lint:scss

# Production build
./tools/test.sh
```

### Git Integration

- Last modified dates automatically updated via Git hooks
- Asset files excluded from repository (except source)
- Build artifacts ignored in `.gitignore`

---

## Summary

The Jekyll Chirpy theme follows a modern, modular architecture that separates concerns between:

1. **Content** (Markdown posts and pages)
2. **Presentation** (Liquid templates and SCSS)
3. **Behavior** (JavaScript modules)
4. **Configuration** (YAML data files)
5. **Build Process** (Node.js and Ruby toolchain)

This architecture enables:
- Easy customization without breaking core functionality
- Responsive, accessible design
- Modern web development practices
- Strong SEO and performance optimization
- Maintainable and scalable codebase

The theme provides extensive customization hooks while maintaining upgrade compatibility, making it suitable for both simple blogs and complex sites requiring custom functionality.
