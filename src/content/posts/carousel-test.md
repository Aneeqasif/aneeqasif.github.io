---
title: Carousel Test
published: 2025-01-20
description: 'Testing the new image carousel component'
image: ''
tags: [Test, Carousel]
category: 'Test'
draft: false
lang: ''
pinned: false
---

# Carousel Component Test


This post tests the new carousel component for displaying images in a slideshow format.

## Basic Carousel

:::carousel
![Gen AI Data Engineering](/Certs/gen-ai-data-engineering-1.png)
![IBM Data Science Professional Certificate](/Certs/IBM Data science Professional certificate-1.png)
![Large Language Models with Semantic Search](/Certs/Large Langu age Models w ith Semantic Search-1.png)
![Certificate](/Certs/out-1.png)
:::

## Carousel with Autoplay

This carousel will automatically advance every 4 seconds (default interval):

:::carousel{autoplay}
![Prompt Engineering Basics](/Certs/prompt engineering basics-1.png)
![SP GenAI Data Engineering](/Certs/sp-genai-data-engineering-1.png)
![Certificate](/Certs/Out-1.png)
:::

## Carousel with Custom Interval

This carousel autoplays with a 6-second interval:

:::carousel{autoplay interval="6000"}
![Gen AI Data Engineering](/Certs/gen-ai-data-engineering-1.png)
![IBM Data Science Professional Certificate](/Certs/IBM Data science Professional certificate-1.png)
![Prompt Engineering Basics](/Certs/prompt engineering basics-1.png)
![SP GenAI Data Engineering](/Certs/sp-genai-data-engineering-1.png)
:::

## Carousel with Reference Image

Use the `ref` attribute to specify which image's dimensions to use (1-based index). The carousel will size itself to match that image:

:::carousel{ref="2"}
![Small Certificate](/Certs/out-1.png)
![Large Certificate](/Certs/gen-ai-data-engineering-1.png)
![Another Certificate](/Certs/prompt engineering basics-1.png)
:::

In this example, `ref="2"` means the carousel dimensions are based on the second image (gen-ai-data-engineering-1.png).

## Carousel with Scale Factor

Use the `scale` attribute (0 to 1) to scale down the carousel:

:::carousel{scale="0.2"}
![Gen AI Data Engineering](/Certs/gen-ai-data-engineering-1.png)
![IBM Data Science Professional Certificate](/Certs/IBM Data science Professional certificate-1.png)
![Certificate](/Certs/Out-1.png)
:::

This carousel is scaled .

---

## Marquee/Badge Strip

A continuously scrolling strip of badges/logos with hover effects:

:::marquee{speed="40" height="80px"}
/badges/ibm-data-science-professional-certificate-v3.png :: https://www.google.com/search?q=ibm+data+science+professional+certificate
/badges/ibm-data-analyst-professional-certificate-v3.png :: https://www.google.com/search?q=ibm+data+analyst+professional+certificate
/badges/applied-data-science-specialization-v2.png :: https://www.google.com/search?q=applied+data+science+specialization
/badges/generative-ai-for-data-analysts-specialization.png :: https://www.google.com/search?q=generative+ai+for+data+analysts
/badges/machine-learning-with-python-v2.png :: https://www.google.com/search?q=machine+learning+with+python
/badges/Intel-ai-in-the-cloud.png :: https://www.google.com/search?q=intel+ai+in+the+cloud
:::

Marquee scrolling right with larger gap:

:::marquee{speed="125" height="100px" direction="right" gap="3rem"}
/badges/machine-learning-with-python-v2.png
/badges/Intel-ai-in-the-cloud.png :: https://example.com
/badges/generative-ai-for-data-analysts-specialization.png
/badges/applied-data-science-specialization-v2.png :: https://www.credly.com/badges/example3
:::

---

## Features

- **Navigation**: Hover over left/right edges to reveal navigation arrows
- **Keyboard**: Use arrow keys to navigate when carousel is focused
- **Touch**: Swipe left/right on mobile devices
- **Caption**: Image alt text displays below the carousel
- **Counter**: Shows current slide number (e.g., "2 / 4")
- **Autoplay**: Optional auto-advancement with customizable interval
- **Reference sizing**: Use `ref="n"` to base dimensions on the nth image
- **Scale**: Use `scale="0.5"` to scale the carousel (0 to 1)

### Marquee Features
- **Continuous scroll**: Seamless infinite loop animation
- **Hover pause**: Animation pauses when hovering over the strip
- **Item hover**: Individual items scale up on hover
- **Clickable**: Items with `href` are clickable links
- **Edge fade**: Gradient transparency on edges
- **Customizable**: `speed`, `height`, `gap`, `direction` attributes
