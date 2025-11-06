---
title: Gallery Feature Test
published: 2025-11-01
description: 'Testing the new masonry-style image gallery component'
image: '/posts/workstation-grey.jpg'
tags: ['demo', 'draft']
category: 'Examples'
draft: false
---

This post demonstrates the new image gallery feature. The gallery uses a masonry/Pinterest-style layout that automatically arranges images beautifully.

## Basic Gallery

Here's a simple gallery with all your current post images:

:::gallery
/posts/bike.jpg
/posts/coffee-cup.png
/posts/ride.jpg
/posts/right-hand-light.jpg
/posts/workstation-grey.jpg
:::

## Features

The gallery component includes:

- ✅ **Responsive layout** - 3 columns on desktop, 2 on tablet, 1 on mobile
- ✅ **Maintains aspect ratios** - Images keep their original proportions
- ✅ **Hover effects** - Subtle lift and zoom on hover
- ✅ **Lazy loading** - Images load as you scroll
- ✅ **Dark mode support** - Looks great in both themes
- ✅ **Entrance animations** - Smooth fade-in effect

## Custom Columns

You can specify the number of columns on desktop:

:::gallery{columns="4"}
/posts/bike.jpg
/posts/coffee-cup.png
/posts/ride.jpg
/posts/right-hand-light.jpg
/posts/workstation-grey.jpg
:::

## Custom Gap

Adjust the spacing between images:

:::gallery{gap="2rem"}
/posts/bike.jpg
/posts/coffee-cup.png
/posts/ride.jpg
:::

## Two-Column Layout

Perfect for before/after comparisons:

:::gallery{columns="2" gap="1.5rem"}
/posts/bike.jpg
/posts/coffee-cup.png
:::

## How to Use

Simply wrap your image paths in a gallery directive:

\`\`\`markdown
:::gallery
/posts/image1.jpg
/posts/image2.jpg
/posts/image3.jpg
:::
\`\`\`

### With Options

\`\`\`markdown
:::gallery{columns="4" gap="2rem"}
/posts/image1.jpg
/posts/image2.jpg
:::
\`\`\`

## Technical Details

- **Layout**: CSS Multi-Column Layout (no JavaScript required)
- **Performance**: Lazy loading + async decoding
- **Compatibility**: Works with theme's existing image features
- **Responsive**: Automatically adjusts to screen size

Enjoy creating beautiful image galleries! 📸
