# Chirpy Theme Customization Guide

> **Note**: This guide was created for Jekyll Chirpy Theme version 7.3.1 (August 2025).
> If you're using a newer version, please verify these instructions are still applicable
> as the theme structure may have changed. Update this guide as needed.

## Table of Contents

- [Introduction](#introduction)
- [Best Practices for Customization](#best-practices-for-customization)
- [Customizing Colors](#customizing-colors)
- [Customizing Layout Dimensions](#customizing-layout-dimensions)
- [Adding Custom CSS](#adding-custom-css)
- [Customizing Layouts](#customizing-layouts)
- [Adding JavaScript Functionality](#adding-javascript-functionality)
- [Adding Custom Includes](#adding-custom-includes)
- [Working with Assets](#working-with-assets)
- [After Theme Upgrades](#after-theme-upgrades)

## Introduction

This guide helps you customize the Jekyll Chirpy theme in a way that survives theme upgrades. 
The main challenge when customizing a theme is that direct modifications to core theme files
are overwritten when you upgrade the theme. This guide shows you how to use the theme's
supported customization methods to avoid losing your changes.

## Best Practices for Customization

1. **Never modify core theme files directly** unless you're willing to re-apply those changes after each upgrade.
2. **Use the theme's hook files system** which is designed specifically for customization.
3. **Keep custom assets** in the `assets/` directory.
4. **Document your customizations** for future reference (in this file).

## Customizing Colors

### Light and Dark Mode Colors

The theme's colors are defined in SCSS variables in the `_sass/themes/` directory:
- `_sass/themes/_light.scss` - Light mode colors
- `_sass/themes/_dark.scss` - Dark mode colors

To customize colors without modifying these files directly:

1. Create or modify the file `assets/css/_custom-mixins.scss` with your custom color schemes:

```scss
@mixin custom-light-scheme {
    /* Override light mode colors here */
    --main-bg: #f8f9fa;
    --text-color: #333333;
    --link-color: #086dd1;
    /* Add more variables as needed */
}

@mixin custom-dark-scheme {
    /* Override dark mode colors here */
    --main-bg: rgb(20, 20, 22);
    --text-color: rgb(180, 180, 180);
    --link-color: rgb(150, 190, 255);
    /* Add more variables as needed */
}
```

2. Import this file in `assets/css/jekyll-theme-chirpy.scss`:

```scss
---
---

/* prettier-ignore */
@use 'main
{%- if jekyll.environment == 'production' -%}
  .bundle
{%- endif -%}
';

@import 'custom-mixins';
/* Other imports */

/* Apply custom color schemes */
html:not([data-mode]) {
  @include custom-light-scheme;
}

html[data-mode="dark"] {
  @include custom-dark-scheme;
}

/* Other custom CSS */
```

### Color Variables Reference

Here are some common color variables you might want to customize:

```scss
/* Framework colors */
--main-bg                  // Background of the main content area
--mask-bg                  // Background color for masks/overlays
--main-border-color        // Border color for dividers

/* Text colors */
--text-color               // Main text color
--text-muted-color         // Secondary, less prominent text
--heading-color            // Color for headings (h1-h6)
--blockquote-text-color    // Color for blockquote text

/* Link colors */
--link-color               // Color for hyperlinks
--link-underline-color     // Color for link underlines

/* Button colors */
--button-bg                // Background for buttons
--btn-border-color         // Button border color

/* Sidebar colors */
--sidebar-bg               // Sidebar background
--sidebar-muted-color      // Muted text in sidebar
--sidebar-active-color     // Active item in sidebar
```

## Customizing Layout Dimensions

Use the `_sass/variables-hook.scss` file to customize layout dimensions:

```scss
/* Sidebar dimensions */
$sidebar-width: 260px;
$sidebar-width-large: 320px;

/* Other dimensions */
$topbar-height: 3rem;
$footer-height: 5rem;
$main-content-max-width: 1250px;

/* Border radiuses */
$radius-sm: 6px;
$radius-lg: 8px;
```

## Adding Custom CSS

1. For large CSS additions, create files in `assets/css/` directory with names prefixed with underscore (e.g., `_custom-styles.scss`).

2. Import these files in `assets/css/jekyll-theme-chirpy.scss`:

```scss
---
---

/* prettier-ignore */
@use 'main
{%- if jekyll.environment == 'production' -%}
  .bundle
{%- endif -%}
';

@import 'custom-mixins';
@import 'custom-styles';

/* Add your direct CSS customizations here */
.my-custom-class {
  border-radius: 8px;
  padding: 10px;
}
```

## Customizing Layouts

### Using Layout Hooks

The Chirpy theme supports hook files for layouts. To customize a layout:

1. Identify which layout you want to customize (e.g., `_layouts/home.html`).

2. Create a corresponding hook file in `_includes/hooks/`:
   - For `home.html`, create `_includes/hooks/home-hook.html`
   - For `post.html`, create `_includes/hooks/post-hook.html`

3. Add your custom HTML to the hook file, and it will be included in the layout.

### Example: Adding Content to Home Page

Create `_includes/hooks/home-hook.html`:

```html
<div class="custom-home-section">
  <h2>Welcome to My Blog</h2>
  <p>This is a custom welcome message that will appear on the home page.</p>
</div>

<style>
  .custom-home-section {
    background-color: var(--card-bg);
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
</style>
```

## Adding JavaScript Functionality

1. Create your JavaScript files in `assets/js/custom/`:

```javascript
// assets/js/custom/my-feature.js
document.addEventListener('DOMContentLoaded', function() {
  // Your custom JavaScript code here
  console.log('Custom functionality loaded');
});
```

2. Include this JavaScript in your layouts using the `script_includes` front matter:

```yaml
---
layout: default
script_includes:
  - custom/my-feature
---
```

Or add it to `_includes/hooks/home-hook.html` (or another appropriate hook file):

```html
<script src="{{ '/assets/js/custom/my-feature.js' | relative_url }}"></script>
```

## Adding Custom Includes

1. Create custom include files in `_includes/custom/`:

```html
<!-- _includes/custom/author-bio.html -->
<div class="author-bio">
  <img src="{{ '/assets/img/avatar.jpg' | relative_url }}" alt="Author Avatar">
  <div class="author-info">
    <h3>{{ site.data.authors[include.author].name }}</h3>
    <p>{{ site.data.authors[include.author].bio }}</p>
  </div>
</div>
```

2. Use these includes in your layouts or hook files:

```liquid
{% include custom/author-bio.html author="main_author" %}
```

## Working with Assets

1. Store images in `assets/img/`
2. Store custom fonts in `assets/fonts/`
3. Store documents in `assets/docs/`

Example of using custom assets:

```html
<!-- In a markdown file or HTML include -->
<img src="{{ '/assets/img/custom/feature-image.jpg' | relative_url }}" 
     alt="Feature Image" class="rounded-9">

<a href="{{ '/assets/docs/sample.pdf' | relative_url }}">Download PDF</a>
```

## After Theme Upgrades

After upgrading the theme, you may need to:

1. Rebuild CSS and JS assets:
   ```bash
   npm run build
   git add assets/js/dist _sass/vendors -f
   git commit -m "chore: rebuild assets after theme upgrade"
   ```

2. Check if any core theme files you've customized have changed and re-apply your changes to the hook files.

3. Test your site thoroughly to ensure all customizations are still working.

4. Update this guide if the theme's customization methods have changed.

---

Remember, the key to maintainable customizations is to use the theme's built-in extension points rather than modifying core files directly. This approach ensures your changes survive theme upgrades.
