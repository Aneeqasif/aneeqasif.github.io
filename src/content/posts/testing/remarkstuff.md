---
author: M. Aneeq Asif
category: Demo
description: Testing different remark directives.
draft: false
published: 2026-09-09
series:
  name: testing blog
  part: 2
tags:
- demo
- testing
title: Remark directive
---

# Remark Stuff <span class="tag" tag-name="fold"><span class="smallcaps">fold</span></span>

## Steps Counter

:::steps

1. **Install the required packages**

   Run the following command in your terminal:

   ```bash
   pnpm install @astrojs/sitemap @astrojs/rss
   ```

2. **Plan your feature**

   - Define requirements
   - Sketch the UI
   - Identify dependencies

3. **Create the component**

   Start with a basic structure and iterate.

4. **Add styling**

   Make it look good with CSS or Tailwind.
:::

And remember no spaces here between \`:::\` and steps keyword

:::steps

1.  Install dependencies
2.  Configure your environment
3.  Run the app

:::

## Github Cards

::github{repo="kawabata/ox-pandoc"}

## Carousel <span class="tag" tag-name="folded"><span class="smallcaps">folded</span></span>

:::tip
This size of carousel will adapt to max height and max width of the images.
:::

:::carousel
![Gen AI Data Engineering](/Certs/gen-ai-data-engineering-1.png)
![IBM Data Science Professional Certificate](/Certs/IBM Data science Professional certificate-1.png)
![Large Language Models with Semantic Search](/Certs/Large Langu age Models w ith Semantic Search-1.png)
![Certificate](/Certs/out-1.png)
:::

### AutoPlay

This carousel will automatically advance every 4 seconds (default
interval):

:::carousel{autoplay}
![Prompt Engineering Basics](/Certs/prompt engineering basics-1.png)
![SP GenAI Data Engineering](/Certs/sp-genai-data-engineering-1.png)
![Certificate](/Certs/Out-1.png)
:::

This carousel autoplays with a 6-second interval:

:::carousel{autoplay interval="6000"}
![Gen AI Data Engineering](/Certs/gen-ai-data-engineering-1.png)
![IBM Data Science Professional Certificate](/Certs/IBM Data science Professional certificate-1.png)
![Prompt Engineering Basics](/Certs/prompt engineering basics-1.png)
![SP GenAI Data Engineering](/Certs/sp-genai-data-engineering-1.png)
:::

### Use dimensions of a specific Image

:::carousel{ref="2"}
![Small Certificate](/Certs/out-1.png)
![Large Certificate](/Certs/gen-ai-data-engineering-1.png)
![Another Certificate](/Certs/prompt engineering basics-1.png)
:::

### Carousel with Scale Factor

Use the \`scale\` attribute (0 to 1) to scale down the carousel:

This carousel is scaled .

:::carousel{scale="0.2"}
![Gen AI Data Engineering](/Certs/gen-ai-data-engineering-1.png)
![IBM Data Science Professional Certificate](/Certs/IBM Data science Professional certificate-1.png)
![Certificate](/Certs/Out-1.png)
:::

- ****Navigation****: Hover over left/right edges to reveal navigation
  arrows
- ****Keyboard****: Use arrow keys to navigate when carousel is focused
- ****Touch****: Swipe left/right on mobile devices
- ****Caption****: Image alt text displays below the carousel
- ****Counter****: Shows current slide number (e.g., "2 / 4")
- ****Autoplay****: Optional auto-advancement with customizable interval
- ****Reference sizing****: Use \`ref="n"\` to base dimensions on the
  nth image
- ****Scale****: Use \`scale="0.5"\` to scale the carousel (0 to 1)

## Marquee

:::marquee{speed="40" height="100px" direction="right" gap="3rem"}
/badges/ibm-data-science-professional-certificate-v3.png :: https://www.google.com/search?q=ibm+data+science+professional+certificate
/badges/ibm-data-analyst-professional-certificate-v3.png :: https://www.google.com/search?q=ibm+data+analyst+professional+certificate
/badges/applied-data-science-specialization-v2.png :: https://www.google.com/search?q=applied+data+science+specialization
/badges/generative-ai-for-data-analysts-specialization.png :: https://www.google.com/search?q=generative+ai+for+data+analysts
/badges/machine-learning-with-python-v2.png :: https://www.google.com/search?q=machine+learning+with+python
/badges/Intel-ai-in-the-cloud.png :: https://www.google.com/search?q=intel+ai+in+the+cloud
:::

- ****Continuous scroll****: Seamless infinite loop animation
- ****Hover pause****: Animation pauses when hovering over the strip
- ****Item hover****: Individual items scale up on hover
- ****Clickable****: Items with \`href\` are clickable links
- ****Edge fade****: Gradient transparency on edges
- ****Customizable****: \`speed\`, \`height\`, \`gap\`, \`direction\`
  attributes

## Admonitions

Following types of admonitions are supported: `note` `tip` `important` `warning` `caution`

:::note
Highlights information that users should take into account, even when skimming.
:::

:::tip
Optional information to help a user be more successful.
:::

:::important
Crucial information necessary for users to succeed.
:::

:::warning
Critical content demanding immediate user attention due to potential risks.
:::

:::caution
Negative potential consequences of an action.
:::

### Custom Titles

The title of the admonition can be customized.

:::note[MY CUSTOM TITLE]
This is a note with a custom title.
:::

### Github Syntax

> [!NOTE]
> The GitHub syntax is also supported.

> [!TIP]
> The GitHub syntax is also supported.

## Spicy Figures

set width to 80%

:::figure{width="80%"}
![My workstation setup - where the magic happens](/posts/workstation-grey.jpg)
:::

### With Shadow
:::figure{width="70%" .shadow}
![Workstation with shadow effect](/posts/workstation-grey.jpg)
:::

image with full width

:::figure{width="100%"}
![Out for a ride](/posts/bike.jpg)
:::

### Float Right

:::figure{width="20%" float="right"}
![Morning coffee](/posts/coffee-cup.png)
:::

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum

### Float Left

:::figure{float="left"}
![Out for a ride](/posts/bike.jpg)
:::

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum


### Height-Based Sizing

:::figure{height="200px"}
![Ride into the sunset](/posts/ride.jpg)
:::

### Blur Effect (Hover to Reveal)

:::figure{.blur}
![Secret workstation photo - hover to reveal!](/posts/workstation-grey.jpg)
:::

### Hue effect


:::figure{.hue width="60%"}
![chart](/posts/output.svg)
:::

:::figure{.hue width="60%"}
![Magit screenshot - hover for original colors](/Certs/gen-ai-data-engineering-1.png)
:::

### Columns Grid


:::figure{grid=3 .shadow}
![Morning coffee ritual](/posts/coffee-cup.png)
![My workstation setup](/posts/workstation-grey.jpg)
![Beautiful light through window](/posts/right-hand-light.jpg)
:::

:::figure{grid=2 width="40%"}
![IBM Data Science Professional](/badges/ibm-data-science-professional-certificate-v3.png)
![IBM Data Analyst Professional](/badges/ibm-data-analyst-professional-certificate-v3.png)
![Applied Data Science Specialization](/badges/applied-data-science-specialization-v2.png)
:::
