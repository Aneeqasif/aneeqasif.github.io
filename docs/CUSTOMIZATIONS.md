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
`

#### All Options

```markdown
:::gallery{columns="4" gap="1.5rem"}
/posts/image1.jpg
/posts/image2.jpg
/posts/image3.jpg
:::
```
### Features

- **Responsive Breakpoints**:
  - Desktop (>1024px): Your specified columns
  - Tablet (640-1024px): 2 columns
  - Mobile (<640px): 1 column
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

**Maintenance Notes**:
- Component is self-contained
- No external dependencies
- Works with existing theme features (lightbox, lazy loading)
- Safe to update independently of theme

---

# 🔤 Font Customizations

**Status**: ✅ Custom configuration - Safe for upstream merges  
### Monospace Font (Code Blocks)

**Font**: Iosevka  
**Package**: `@fontsource/iosevka`

#### Configuration Location

All code block font settings are in `astro.config.mjs` using Expressive Code's `styleOverrides`:

```javascript
expressiveCode({
  styleOverrides: {
    codeFontFamily: "'Iosevka', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    codeFontSize: "0.9rem",
    codeFontWeight: "400",
  }
})
```
#### Files Modified

1. **`astro.config.mjs`** ⚠️
   - Line ~84-86: Font family, size, and weight in `styleOverrides`

2. **`src/layouts/Layout.astro`** ⚠️
   ```javascript
   // Lines 5-7: Font imports
   import "@fontsource/iosevka/400.css";
   import "@fontsource/iosevka/500.css";
   import "@fontsource/iosevka/700.css";
   ```

3. **`tailwind.config.cjs`** ⚠️
   ```javascript
   fontFamily: {
     sans: ["Roboto", "sans-serif", ...defaultTheme.fontFamily.sans],
     mono: ["Iosevka", "monospace", ...defaultTheme.fontFamily.mono],
   }
   ```

4. **`src/styles/markdown.css`** ⚠️
   - Line ~40: Inline code font family
   ```css
   font-family: 'Iosevka', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
   font-size: 0.9em;
   font-weight: 400;
   ```

5. **`package.json`** ⚠️
   - Added dependency: `@fontsource/iosevka`

