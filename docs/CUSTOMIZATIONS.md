# Image Gallery Component

## 📸 Masonry-Style Image Gallery Widget

**Status**: ✅ Custom feature - Safe for upstream merges  
**Location**: `src/components/custom/ImageGallery.astro`  
**Plugin**: `src/plugins/custom/remark-gallery.ts`

### What It Does

Displays multiple images in a Pinterest/masonry-style layout that:
- ✅ Automatically arranges images in columns
- ✅ Maintains original aspect ratios
- ✅ Responsive (3 cols desktop, 2 tablet, 1 mobile)
- ✅ Hover effects (zoom + shadow)
- ✅ Lazy loading built-in
- ✅ Works with theme's existing lightbox

### Usage in Markdown

#### Basic Syntax

```markdown
:::gallery
/posts/image1.jpg
/posts/image2.jpg
/posts/image3.jpg
/posts/image4.jpg
:::
```

#### With Custom Columns

```markdown
:::gallery{columns="4"}
/posts/photo1.jpg
/posts/photo2.jpg
/posts/photo3.jpg
/posts/photo4.jpg
/posts/photo5.jpg
/posts/photo6.jpg
:::
```

#### With Custom Gap

```markdown
:::gallery{gap="2rem"}
/posts/img1.jpg
/posts/img2.jpg
/posts/img3.jpg
:::
```

#### All Options

```markdown
:::gallery{columns="4" gap="1.5rem"}
/posts/image1.jpg
/posts/image2.jpg
/posts/image3.jpg
:::
```

### Options

| Option    | Type   | Default | Description                         |
| --------- | ------ | ------- | ----------------------------------- |
| `columns` | number | `3`     | Number of columns on desktop        |
| `gap`     | string | `1rem`  | Space between images (any CSS unit) |

### Features

- **Responsive Breakpoints**:
  - Desktop (>1024px): Your specified columns
  - Tablet (640-1024px): 2 columns
  - Mobile (<640px): 1 column

- **Visual Effects**:
  - Hover: Lift + shadow + subtle zoom
  - Entrance animation: Staggered fade-in
  - Rounded corners: 0.75rem
  - Dark mode compatible

- **Performance**:
  - Lazy loading enabled
  - CSS-only masonry (no JS library)
  - Async image decoding

### Implementation Details

#### Files Modified (Minimal Conflict Risk)

1. **`astro.config.mjs`** ⚠️
   ```javascript
   // Line 27: Import added
   import { remarkGallery } from "./src/plugins/custom/remark-gallery.ts";
   
   // Line 115: Plugin added to remarkPlugins array
   remarkGallery, // CUSTOM: Image gallery support
   
   // Line 126: Component registered in rehypeComponents
   ImageGallery: (await import("./src/components/custom/ImageGallery.astro")).default,
   ```

2. **New Files Created** ✅ (Zero conflict risk)
   - `src/components/custom/ImageGallery.astro`
   - `src/plugins/custom/remark-gallery.ts`

### How It Works

1. **Markdown Parse**: Remark plugin detects `:::gallery` directives
2. **Extract Images**: Reads image paths from directive content
3. **Transform**: Converts to `<ImageGallery>` component with props
4. **Render**: Astro component renders masonry layout
5. **Enhance**: JavaScript adds entrance animations

### Testing

Test the component with:

```markdown
:::gallery
/posts/bike.jpg
/posts/coffee-cup.png
/posts/ride.jpg
/posts/right-hand-light.jpg
/posts/workstation-grey.jpg
:::
```

---

**Maintenance Notes**:
- Component is self-contained
- No external dependencies
- Works with existing theme features (lightbox, lazy loading)
- Safe to update independently of theme
