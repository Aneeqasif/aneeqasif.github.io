# Chirpy Theme Customization Guide

> **Note**: This guide was created for Jekyll Chirpy Theme version 7.3.1 (August 2025).
> If you're using a newer version, please verify these instructions are still applicable
> as the theme structure may have changed. For architecture details, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Table of Contents

- [Chirpy Theme Customization Guide](#chirpy-theme-customization-guide)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
    - [What You'll Learn](#what-youll-learn)
    - [Prerequisites](#prerequisites)
  - [Quick Start Guide](#quick-start-guide)
    - [1. Set Up Your Development Environment](#1-set-up-your-development-environment)
    - [2. Make Your First Customization](#2-make-your-first-customization)
    - [3. Test Your Changes](#3-test-your-changes)
  - [Best Practices for Customization](#best-practices-for-customization)
    - [✅ Do's](#-dos)
    - [❌ Don'ts](#-donts)
    - [File Organization Strategy](#file-organization-strategy)
  - [Configuration Customization](#configuration-customization)
    - [Site Information](#site-information)
    - [Analytics and SEO](#analytics-and-seo)
    - [Feature Toggles](#feature-toggles)
    - [Custom Navigation](#custom-navigation)
  - [Customizing Colors and Themes](#customizing-colors-and-themes)
    - [Using Custom Color Schemes](#using-custom-color-schemes)
    - [Color Variables Reference](#color-variables-reference)
    - [Creating Your Own Theme](#creating-your-own-theme)
  - [Typography and Fonts](#typography-and-fonts)
    - [Changing Font Families](#changing-font-families)
    - [Font Size and Typography](#font-size-and-typography)
  - [Layout Customization](#layout-customization)
    - [Layout Dimensions](#layout-dimensions)
    - [Sidebar Customization](#sidebar-customization)
    - [Navigation and Menu](#navigation-and-menu)
  - [Adding Custom CSS](#adding-custom-css)
    - [Direct CSS Additions](#direct-css-additions)
    - [SCSS Modules](#scss-modules)
    - [Responsive Design](#responsive-design)
  - [Layout Extensions](#layout-extensions)
    - [Using Metadata Hooks](#using-metadata-hooks)
    - [Panel and Tail Includes](#panel-and-tail-includes)
    - [Custom Page Layouts](#custom-page-layouts)
  - [JavaScript Customization](#javascript-customization)
    - [Adding Custom Scripts](#adding-custom-scripts)
    - [Integrating with Theme JavaScript](#integrating-with-theme-javascript)
    - [Theme Event System](#theme-event-system)
  - [Content Enhancement](#content-enhancement)
    - [Custom Includes](#custom-includes)
    - [Shortcodes and Components](#shortcodes-and-components)
    - [Custom Post Features](#custom-post-features)
  - [Asset Management](#asset-management)
    - [Images and Media](#images-and-media)
    - [Custom Icons](#custom-icons)
    - [External Resources](#external-resources)
  - [Advanced Customizations](#advanced-customizations)
    - [Custom Collections](#custom-collections)
    - [Custom Plugins](#custom-plugins)
    - [Data Files](#data-files)
  - [Best Practices Summary](#best-practices-summary)
  - [Development Workflow](#development-workflow)
    - [Local Development](#local-development)
    - [Testing Customizations](#testing-customizations)
    - [Build Process](#build-process)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues and Solutions](#common-issues-and-solutions)
    - [Debug Mode](#debug-mode)
  - [Migration and Upgrades](#migration-and-upgrades)
    - [Preparing for Theme Updates](#preparing-for-theme-updates)
    - [After Theme Upgrades](#after-theme-upgrades)
  - [Summary](#summary)

## Introduction

This comprehensive guide helps you customize the Jekyll Chirpy theme effectively while maintaining compatibility with theme updates. The Chirpy theme is designed with customization in mind, providing multiple extension points and hooks to modify appearance and functionality without touching core theme files.

### What You'll Learn
- How to safely customize colors, fonts, and layouts
- Configuration options and their effects
- Adding custom functionality with JavaScript
- Creating reusable components and includes
- Best practices for maintainable customizations

### Prerequisites
- Basic knowledge of Jekyll and Liquid templating
- Understanding of HTML, CSS/SCSS, and JavaScript
- Familiarity with Git for version control

## Quick Start Guide

### 1. Set Up Your Development Environment

```bash
# Start development server
./tools/run.sh

# In another terminal, watch for asset changes
npm run watch:js
```

### 2. Make Your First Customization

Add custom styles to `assets/css/jekyll-theme-chirpy.scss`:

```scss
/* Your custom styles go at the bottom */
.my-custom-class {
  background: var(--card-bg);
  padding: 1rem;
  border-radius: 8px;
}
```

### 3. Test Your Changes

Visit `http://127.0.0.1:4000` to see changes live-reload automatically.

## Best Practices for Customization

### ✅ Do's
1. **Use the existing hook system** - Leverage `metadata-hook.html` and custom includes
2. **Keep customizations in `assets/` directory** - This ensures they're preserved during upgrades
3. **Use CSS custom properties** - Take advantage of the theme's variable system
4. **Document your changes** - Keep track of customizations in this file or comments
5. **Test both light and dark modes** - Ensure your customizations work in both themes
6. **Use semantic versioning** - Tag your customizations for easy rollback

### ❌ Don'ts
1. **Don't modify core theme files directly** - Use the customization system instead
2. **Don't hardcode colors** - Use CSS custom properties for theme compatibility
3. **Don't ignore responsive design** - Test on multiple screen sizes
4. **Don't skip the build process** - Always run `npm run build` before deployment
5. **Don't forget about accessibility** - Maintain proper contrast and semantic markup

### File Organization Strategy

Keep your customizations organized:
- `assets/css/jekyll-theme-chirpy.scss` - Main customization file
- `assets/css/_custom-mixins.scss` - Color schemes (already exists)  
- `_includes/metadata-hook.html` - Custom head content
- `assets/js/custom/` - Your custom JavaScript files

## Configuration Customization

### Site Information

Customize your site's basic information in `_config.yml`:

```yaml
# Basic site information
title: "Your Amazing Blog"
tagline: "Exploring Code, Life, and Everything Between"
description: >- 
  A passionate developer's journey through technology, sharing insights 
  about programming, open source, and digital creativity.

# Personal information
github:
  username: yourusername
twitter:
  username: yourhandle
social:
  name: "Your Full Name"
  email: "your.email@domain.com"
  links:
    - https://twitter.com/yourhandle
    - https://github.com/yourusername
    - https://linkedin.com/in/yourprofile

# Customize the site URL structure
url: "https://yourdomain.com"
baseurl: ""  # Keep empty for root domain

# Timezone setting
timezone: America/New_York  # Your timezone
```

### Analytics and SEO

Configure analytics and SEO features:

```yaml
# Analytics integration
analytics:
  google:
    id: "G-XXXXXXXXXX"  # Google Analytics 4
  goatcounter:
    id: "yourblog"      # Privacy-friendly alternative

# SEO verification
webmaster_verifications:
  google: "your-google-verification-code"
  bing: "your-bing-verification-code"

# Social media preview
social_preview_image: "/assets/img/preview.jpg"
avatar: "/assets/img/avatar.jpg"

# Page views (requires analytics setup)
pageviews:
  provider: google  # or goatcounter
```

### Feature Toggles

Enable or disable theme features:

```yaml
# Table of contents
toc: true  # Global TOC setting (can be overridden per post)

# Comments system
comments:
  provider: giscus  # Options: disqus, utterances, giscus
  giscus:
    repo: "yourusername/blog-comments"
    repo_id: "R_xxxxxxxxxxxxx"
    category: "Comments"
    category_id: "DIC_xxxxxxxxxxxxx"

# Progressive Web App
pwa:
  enabled: true
  cache:
    enabled: false  # Enable for offline support

# Theme mode preference
theme_mode: # Leave empty for auto-detection, or set 'light'/'dark'

# CDN for faster loading (optional)
cdn: "https://your-cdn-domain.com"
```

### Custom Navigation

Modify navigation tabs by editing files in `_tabs/`:

```markdown
---
# _tabs/portfolio.md
layout: page
icon: fas fa-briefcase
order: 5
---

# Portfolio

Your portfolio content here...
```

## Customizing Colors and Themes

### Using Custom Color Schemes

Your theme already includes custom colors in `assets/css/_custom-mixins.scss`. To modify them:

1. **Edit the existing mixins** to change colors
2. **Override specific variables** in your main stylesheet:

```scss
/* In assets/css/jekyll-theme-chirpy.scss */
:root {
  --primary-color: #your-color;
  --link-color: #your-link-color;
}
```

3. **Test both light and dark modes** to ensure consistency

### Color Variables Reference

Key color variables you can customize:

**Framework Variables:**
- `--main-bg` - Main content background
- `--text-color` - Primary text color  
- `--heading-color` - Headings (h1-h6)
- `--link-color` - Hyperlink color

**UI Components:**
- `--button-bg` - Button background
- `--card-bg` - Card/panel backgrounds
- `--sidebar-bg` - Sidebar background
- `--topbar-bg` - Top navigation background

**Content Areas:**
- `--toc-highlight` - Table of contents active item
- `--code-bg` - Code block background
- `--tag-border` - Tag border color

*See `assets/css/_custom-mixins.scss` for the complete list of available variables.*

### Creating Your Own Theme

For a completely custom look:

1. **Create new color mixins** in `_custom-mixins.scss`
2. **Apply custom effects** like gradients or shadows
3. **Test across all pages** (home, posts, archives, etc.)

Example approach:
```scss
@mixin my-brand-theme {
    --primary: #your-brand-color;
    --main-bg: #your-background;
    /* Add more variables as needed */
}
```

Then apply it in your main stylesheet using the existing media query structure.

## Typography and Fonts

### Changing Font Families

Your theme currently uses:
- **Headings:** Alkatra (serif)
- **Body text:** Default system fonts  
- **Code:** Iosevka Web (monospace)

To change fonts:

1. **Import new fonts** at the top of `assets/css/jekyll-theme-chirpy.scss`
2. **Override font families** using CSS selectors

Example:
```scss
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;600&display=swap');

body { font-family: 'Inter', sans-serif; }
h1, h2, h3, h4, h5, h6 { font-family: 'Inter', sans-serif; font-weight: 600; }
```

### Font Size and Typography

Adjust the base font size and typography scale:

```scss
html { font-size: 18px; } /* Default: 16px */
h1 { font-size: 2.5rem; }
/* etc. */
```

## Layout Customization

### Layout Dimensions

Override layout dimensions using `_sass/variables-hook.scss`:

```scss
/* _sass/variables-hook.scss */
$sidebar-width: 280px;          // Default: 260px
$topbar-height: 3.5rem;         // Default: 3rem
$radius-lg: 12px;               // Large radius (cards, images)
```

### Sidebar Customization

Customize sidebar appearance in your main stylesheet:

```scss
#sidebar {
    /* Custom background or styling */
    .site-title a {
        font-size: 1.5rem;
        /* Custom title styling */
    }
    
    .nav-link.active {
        background: var(--primary-color);
        color: white;
    }
}
```

### Navigation and Menu

Add new navigation tabs:

1. **Create new tab file:** `_tabs/projects.md`
2. **Set front matter:** layout, icon, order
3. **Add content**

Modify existing tabs by editing their respective files in `_tabs/` directory.



## Adding Custom CSS

### Direct CSS Additions

Add custom styles to `assets/css/jekyll-theme-chirpy.scss`:

```scss
/* Your custom styles go at the bottom */

/* Utility classes */
.gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.custom-card {
    background: var(--card-bg);
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### SCSS Modules

For better organization:

1. **Create component files** like `assets/css/_custom-components.scss`
2. **Import in main stylesheet:** `@import 'custom-components';`
3. **Keep related styles together**

### Responsive Design

Use mobile-first approach:

```scss
.my-component {
    /* Mobile styles */
    
    @media (min-width: 768px) {
        /* Tablet and up */
    }
    
    @media (min-width: 992px) {
        /* Desktop and up */
    }
}
```

## Layout Extensions

### Using Metadata Hooks

The theme provides `_includes/metadata-hook.html` for adding custom content to the HTML head:

```html
<!-- _includes/metadata-hook.html -->
<!-- Custom meta tags -->
<meta name="author" content="{{ site.social.name }}">

<!-- Custom fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- Custom CSS for specific needs -->
<style>
    .special-feature {
        /* Custom styles here */
    }
</style>

<!-- Custom JavaScript -->
<script>
    // Custom initialization code
    console.log('Custom theme loaded');
</script>
```

### Panel and Tail Includes

Use front matter to add includes to layouts:

```yaml
---
# Example: custom post layout
layout: default
panel_includes:
  - toc
  - custom-sidebar-widget
tail_includes:
  - related-posts
  - custom-footer-content
---
```

### Custom Page Layouts

Create specialized layouts by copying and modifying existing ones:

1. **Copy a base layout** (e.g., `_layouts/page.html`)
2. **Rename it** (e.g., `_layouts/portfolio.html`)  
3. **Customize the structure** and styling
4. **Use in your pages** with `layout: portfolio`

## JavaScript Customization

### Adding Custom Scripts

1. **Create JavaScript files** in `assets/js/custom/`:

```javascript
// assets/js/custom/my-features.js
document.addEventListener('DOMContentLoaded', function() {
    // Your custom functionality
    console.log('Custom features loaded');
    
    // Example: Add reading progress indicator
    addReadingProgress();
});

function addReadingProgress() {
    // Simple reading progress implementation
    const article = document.querySelector('article');
    if (!article) return;
    
    // Create and style progress bar
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed; top: 0; left: 0; width: 0%;
        height: 3px; background: var(--primary-color);
        z-index: 1000; transition: width 0.1s;
    `;
    document.body.appendChild(progressBar);
    
    // Update on scroll
    window.addEventListener('scroll', function() {
        const winScroll = document.documentElement.scrollTop;
        const height = article.offsetHeight - window.innerHeight;
        const scrolled = Math.min((winScroll / height) * 100, 100);
        progressBar.style.width = scrolled + '%';
    });
}
```

2. **Include in metadata-hook.html**:

```html
<script src="{{ '/assets/js/custom/my-features.js' | relative_url }}"></script>
```

### Integrating with Theme JavaScript

Hook into existing theme features:

```javascript
// Listen for theme changes
window.addEventListener('themechange', function(e) {
    console.log('Theme changed to:', e.detail.mode);
    // Update your custom elements
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
    }
});
```

### Theme Event System

Create simple event communication:

```javascript
// Custom event bus
const EventBus = {
    on: function(event, callback) {
        document.addEventListener(event, callback);
    },
    emit: function(event, data) {
        document.dispatchEvent(new CustomEvent(event, { detail: data }));
    }
};

// Usage
EventBus.on('customEvent', function(e) {
    console.log('Event received:', e.detail);
});

EventBus.emit('customEvent', { message: 'Hello!' });
```

## Content Enhancement

### Custom Includes

Create reusable components for your content:

1. **Alert/Callout Component**:

```html
<!-- _includes/custom/alert.html -->
{% assign type = include.type | default: 'info' %}
{% assign icon_map = 'info:fa-info-circle,warning:fa-exclamation-triangle,success:fa-check-circle,danger:fa-times-circle' | split: ',' %}
{% assign icon = 'fa-info-circle' %}

{% for mapping in icon_map %}
    {% assign pair = mapping | split: ':' %}
    {% if pair[0] == type %}
        {% assign icon = pair[1] %}
        {% break %}
    {% endif %}
{% endfor %}

<div class="custom-alert alert-{{ type }}">
    <div class="alert-icon">
        <i class="fas {{ icon }}"></i>
    </div>
    <div class="alert-content">
        {% if include.title %}
            <h4 class="alert-title">{{ include.title }}</h4>
        {% endif %}
        <div class="alert-message">
            {{ include.content | markdownify }}
        </div>
    </div>
</div>

<style>
    .custom-alert {
        display: flex;
        align-items: flex-start;
        padding: 1rem;
        margin: 1.5rem 0;
        border-radius: 8px;
        border-left: 4px solid;
        
        .alert-icon {
            margin-right: 1rem;
            font-size: 1.2rem;
            margin-top: 0.1rem;
        }
        
        .alert-title {
            margin: 0 0 0.5rem 0;
            font-size: 1.1rem;
            font-weight: 600;
        }
        
        .alert-message {
            margin: 0;
            
            p:last-child {
                margin-bottom: 0;
            }
        }
        
        &.alert-info {
            background: var(--prompt-info-bg);
            border-color: var(--prompt-info-icon-color);
            
            .alert-icon {
                color: var(--prompt-info-icon-color);
            }
        }
        
        &.alert-warning {
            background: var(--prompt-warning-bg);
            border-color: var(--prompt-warning-icon-color);
            
            .alert-icon {
                color: var(--prompt-warning-icon-color);
            }
        }
        
        &.alert-success {
            background: var(--prompt-tip-bg);
            border-color: var(--prompt-tip-icon-color);
            
            .alert-icon {
                color: var(--prompt-tip-icon-color);
            }
        }
        
        &.alert-danger {
            background: var(--prompt-danger-bg);
            border-color: var(--prompt-danger-icon-color);
            
            .alert-icon {
                color: var(--prompt-danger-icon-color);
            }
        }
    }
</style>
```

**Usage in posts**:

```markdown
{% include custom/alert.html 
   type="warning" 
   title="Important Note" 
   content="Make sure to backup your data before proceeding with this tutorial." %}

{% include custom/alert.html 
   type="success" 
   content="✅ This feature has been successfully implemented!" %}
```

2. **Code Snippet Component**:

```html
<!-- _includes/custom/code-snippet.html -->
{% assign lang = include.lang | default: 'text' %}
{% assign title = include.title %}
{% assign highlight_lines = include.highlight %}

<div class="custom-code-snippet">
    {% if title %}
        <div class="code-title">
            <span class="code-title-text">{{ title }}</span>
            {% if include.link %}
                <a href="{{ include.link }}" class="code-link" target="_blank">
                    <i class="fas fa-external-link-alt"></i>
                </a>
            {% endif %}
        </div>
    {% endif %}
    
    <div class="code-wrapper">
        {% if highlight_lines %}
            {% highlight {{ lang }} linenos %}
{{ include.code }}
            {% endhighlight %}
        {% else %}
            {% highlight {{ lang }} %}
{{ include.code }}
            {% endhighlight %}
        {% endif %}
    </div>
</div>

<style>
    .custom-code-snippet {
        margin: 1.5rem 0;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--border-color);
        
        .code-title {
            background: var(--card-header-bg);
            padding: 0.75rem 1rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.9rem;
            font-weight: 500;
            
            .code-title-text {
                color: var(--heading-color);
            }
            
            .code-link {
                color: var(--link-color);
                text-decoration: none;
                
                &:hover {
                    color: var(--link-hover-color);
                }
            }
        }
        
        .code-wrapper {
            .highlight {
                margin: 0;
                border: none;
                border-radius: 0;
            }
        }
    }
</style>
```

### Shortcodes and Components

Create advanced components for rich content:

```html
<!-- _includes/custom/video-player.html -->
{% assign video_id = include.id %}
{% assign platform = include.platform | default: 'youtube' %}
{% assign title = include.title | default: 'Video' %}

<div class="custom-video-player" data-platform="{{ platform }}">
    {% if platform == 'youtube' %}
        <div class="video-wrapper">
            <iframe 
                src="https://www.youtube.com/embed/{{ video_id }}?rel=0&showinfo=0&modestbranding=1" 
                title="{{ title }}"
                frameborder="0" 
                allowfullscreen>
            </iframe>
        </div>
    {% elsif platform == 'vimeo' %}
        <div class="video-wrapper">
            <iframe 
                src="https://player.vimeo.com/video/{{ video_id }}?color=ffffff&title=0&byline=0&portrait=0" 
                title="{{ title }}"
                frameborder="0" 
                allowfullscreen>
            </iframe>
        </div>
    {% endif %}
    
    {% if include.caption %}
        <p class="video-caption">{{ include.caption }}</p>
    {% endif %}
</div>

<style>
    .custom-video-player {
        margin: 2rem 0;
        
        .video-wrapper {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 */
            height: 0;
            overflow: hidden;
            border-radius: 8px;
            
            iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        }
        
        .video-caption {
            text-align: center;
            font-style: italic;
            color: var(--text-muted-color);
            margin-top: 0.5rem;
            font-size: 0.9rem;
        }
    }
</style>
```

### Custom Post Features

Add special features to your posts:

```html
<!-- _includes/custom/post-series.html -->
{% assign series = site.data.series[include.series] %}
{% if series %}
    <div class="post-series">
        <h4 class="series-title">
            <i class="fas fa-list"></i>
            {{ series.title }}
        </h4>
        <p class="series-description">{{ series.description }}</p>
        
        <ol class="series-posts">
            {% for post_slug in series.posts %}
                {% assign post = site.posts | where: "slug", post_slug | first %}
                {% if post %}
                    <li class="series-post {% if post.url == page.url %}current{% endif %}">
                        {% if post.url == page.url %}
                            <span class="current-post">{{ post.title }}</span>
                            <span class="current-indicator">(current)</span>
                        {% else %}
                            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                        {% endif %}
                    </li>
                {% endif %}
            {% endfor %}
        </ol>
    </div>
{% endif %}

<style>
    .post-series {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1.5rem;
        margin: 2rem 0;
        
        .series-title {
            color: var(--primary-color);
            margin-bottom: 0.5rem;
            
            i {
                margin-right: 0.5rem;
            }
        }
        
        .series-description {
            color: var(--text-muted-color);
            margin-bottom: 1rem;
        }
        
        .series-posts {
            margin: 0;
            padding-left: 1.5rem;
            
            .series-post {
                margin: 0.5rem 0;
                
                &.current {
                    font-weight: 600;
                    
                    .current-post {
                        color: var(--primary-color);
                    }
                    
                    .current-indicator {
                        color: var(--text-muted-color);
                        font-size: 0.9rem;
                        margin-left: 0.5rem;
                    }
                }
                
                a {
                    color: var(--link-color);
                    text-decoration: none;
                    
                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
        }
    }
</style>
```

Create series data:

```yaml
# _data/series.yml
javascript-fundamentals:
  title: "JavaScript Fundamentals Series"
  description: "A comprehensive guide to mastering JavaScript from basics to advanced concepts."
  posts:
    - "javascript-variables-and-data-types"
    - "javascript-functions-and-scope"
    - "javascript-objects-and-arrays"
    - "javascript-async-programming"

web-development-basics:
  title: "Web Development Basics"
  description: "Learn the essential skills for modern web development."
  posts:
    - "html-semantic-markup"
    - "css-flexbox-grid"
    - "javascript-dom-manipulation"
```

Use in posts:

```markdown
---
title: "JavaScript Functions and Scope"
slug: "javascript-functions-and-scope"
---

{% include custom/post-series.html series="javascript-fundamentals" %}

Your post content here...
```

## Asset Management

### Images and Media

Organize and optimize your media assets:

```
assets/
├── img/
│   ├── posts/                  # Post-specific images
│   │   ├── 2024/
│   │   └── series/
│   ├── pages/                  # Page images
│   ├── icons/                  # Custom icons
│   ├── brand/                  # Logo and branding
│   └── avatar.jpg              # Profile image
├── video/                      # Video files
├── docs/                       # Downloadable documents
└── fonts/                      # Custom fonts
```

**Image optimization for performance**:

```html
<!-- _includes/custom/optimized-image.html -->
{% assign src = include.src %}
{% assign alt = include.alt | default: '' %}
{% assign lazy = include.lazy | default: true %}
{% assign sizes = include.sizes | default: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px' %}

<picture class="optimized-image">
    {% if include.webp %}
        <source srcset="{{ include.webp | relative_url }}" type="image/webp" sizes="{{ sizes }}">
    {% endif %}
    {% if include.avif %}
        <source srcset="{{ include.avif | relative_url }}" type="image/avif" sizes="{{ sizes }}">
    {% endif %}
    
    <img 
        src="{{ src | relative_url }}" 
        alt="{{ alt }}"
        {% if lazy %}loading="lazy"{% endif %}
        {% if include.width %}width="{{ include.width }}"{% endif %}
        {% if include.height %}height="{{ include.height }}"{% endif %}
        sizes="{{ sizes }}"
        class="{% if include.class %}{{ include.class }}{% endif %}"
    >
</picture>

{% if include.caption %}
    <figcaption class="image-caption">{{ include.caption }}</figcaption>
{% endif %}
```

**Usage**:

```markdown
{% include custom/optimized-image.html 
   src="/assets/img/posts/my-feature.jpg"
   webp="/assets/img/posts/my-feature.webp"
   alt="Description of the image"
   caption="This is an optimized image with multiple formats" %}
```

### Custom Icons

Create an icon system for consistent branding:

```scss
// assets/css/_custom-icons.scss
.custom-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    fill: currentColor;
    vertical-align: middle;
    
    &.icon-sm { width: 0.875em; height: 0.875em; }
    &.icon-lg { width: 1.25em; height: 1.25em; }
    &.icon-xl { width: 1.5em; height: 1.5em; }
}

// Icon variants
.icon-primary { color: var(--primary-color); }
.icon-secondary { color: var(--secondary-color); }
.icon-success { color: var(--success-color); }
.icon-warning { color: var(--warning-color); }
.icon-danger { color: var(--danger-color); }
```

### External Resources

Manage external dependencies efficiently:

```html
<!-- _includes/metadata-hook.html -->
<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://cdn.jsdelivr.net">

<!-- Resource hints for better performance -->
<link rel="dns-prefetch" href="//www.google-analytics.com">
<link rel="dns-prefetch" href="//fonts.googleapis.com">

<!-- Preload critical assets -->
<link rel="preload" href="{{ '/assets/css/jekyll-theme-chirpy.css' | relative_url }}" as="style">
<link rel="preload" href="{{ '/assets/js/dist/theme.min.js' | relative_url }}" as="script">
```

## Advanced Customizations

### Custom Collections

Add new content types to `_config.yml`:

```yaml
collections:
  projects:
    output: true
    permalink: /projects/:name/
  tutorials:
    output: true
    permalink: /tutorials/:name/

defaults:
  - scope:
      path: "_projects"
      type: projects
    values:
      layout: project
```

Create `_layouts/project.html`:

```html
---
layout: default
---

<article class="project">
    <h1>{{ page.title }}</h1>
    
    {% if page.tech_stack %}
    <div class="tech-stack">
        {% for tech in page.tech_stack %}
        <span class="tech-tag">{{ tech }}</span>
        {% endfor %}
    </div>
    {% endif %}
    
    {{ content }}
</article>
```

### Custom Plugins

Create simple Jekyll plugins in `_plugins/`:

```ruby
# _plugins/reading_time.rb
module Jekyll
  module ReadingTimeFilter
    def reading_time(content)
      words = content.split.size
      minutes = (words / 200.0).ceil
      "#{minutes} min read"
    end
  end
end

Liquid::Template.register_filter(Jekyll::ReadingTimeFilter)
```

Use in templates:

```html
<span class="reading-time">{{ content | reading_time }}</span>
```

### Data Files

Use `_data/` for dynamic content:

```yaml
# _data/projects.yml
- name: "My Project"
  url: "https://github.com/user/project"
  tech: ["JavaScript", "React"]
```

Display in templates:

```html
{% for project in site.data.projects %}
    <div class="project-card">
        <h3>{{ project.name }}</h3>
        <a href="{{ project.url }}">View Project</a>
    </div>
{% endfor %}
```

## Best Practices Summary

1. **Always test customizations** in a local environment first
2. **Use the theme's variables and hooks** instead of overriding core files  
3. **Back up your site** before making significant changes
4. **Document your changes** for future reference
5. **Keep customizations simple** and focused on your needs

The theme's architecture supports extensive customization while preserving upgrade compatibility. Start with small changes and gradually build up your custom features as you become more comfortable with the system.

For technical details about the theme's architecture, see [ARCHITECTURE.md](ARCHITECTURE.md).

Happy customizing! 🎨
