# Gallery Feature - Quick Reference

## Usage
```markdown
:::gallery
/posts/image1.jpg
/posts/image2.jpg
:::

:::gallery{columns="4" gap="2rem"}
/posts/image1.jpg
:::
```

## Files Created
- `src/plugins/custom/remark-gallery.ts` - Parses syntax
- `src/plugins/custom/rehype-component-gallery.mjs` - Generates HTML
- `src/styles/custom.css` - Main import (imports `custom/gallery.css`)
- `src/styles/custom/gallery.css` - Gallery styles

## Files Modified (Re-add after theme updates)
**`astro.config.mjs`** (4 lines):
```js
import { remarkGallery } from "./src/plugins/custom/remark-gallery.ts";
import { ImageGalleryComponent } from "./src/plugins/custom/rehype-component-gallery.mjs";
// In remarkPlugins: remarkGallery,
// In components: ImageGallery: ImageGalleryComponent,
```

**`src/layouts/Layout.astro`** (1 line):
```js
import "@/styles/custom.css";
```

## Customization
Edit `src/styles/custom/gallery.css` for visual changes.
