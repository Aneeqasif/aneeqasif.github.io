# Theme Customization Guidelines

## Goal
Customize the Fuwari Astro theme while minimizing merge conflicts when pulling upstream updates.

## Core Principle
**Extend, don't modify.** Add new files and override styles rather than editing core theme files.

---

## ✅ Safe Customization Areas (Low Conflict Risk)

### 1. Configuration Files (Expected to be customized)
- ✅ `src/config.ts` - Your site configuration
- ✅ `astro.config.mjs` - Site URL and deployment settings only
- ✅ `tailwind.config.cjs` - Extend the theme, don't replace defaults
- ✅ `package.json` - Only change name/version, avoid touching scripts/deps

### 2. Content Files (Your content)
- ✅ `src/content/posts/*` - All your blog posts
- ✅ `src/content/spec/*` - Your About and custom pages
- ✅ `public/posts/*` - Your post images
- ✅ `public/favicon/*` - Your favicon files
- ✅ `src/assets/images/*` - Your custom images

### 3. Custom Additions (New files)
- ✅ `src/styles/custom.css` - Your custom styles (create if needed)
- ✅ `src/components/custom/*` - Your custom components
- ✅ `src/plugins/custom/*` - Your custom plugins
- ✅ Any new directories you create

---

## ⚠️ Moderate Risk Areas (Customize carefully)

### 4. Style Overrides
**Strategy**: Use CSS custom properties and Tailwind extensions

```css
/* src/styles/custom.css - Create this file */
:root {
  --custom-accent: #your-color;
  /* Override CSS variables instead of modifying base styles */
}

/* Add new utility classes without touching existing ones */
.your-custom-class {
  /* your styles */
}
```

**In `tailwind.config.cjs`**:
```js
module.exports = {
  theme: {
    extend: {  // Use 'extend', don't replace 'theme'
      colors: {
        'custom-blue': '#...',
      },
      fontFamily: {
        mono: ['Your Font', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [
    // Add your plugins, don't remove existing ones
  ],
}
```

### 5. Layout Modifications
**Strategy**: Create wrapper components instead of editing layouts directly

```astro
---
// src/layouts/CustomLayout.astro
import Layout from './Layout.astro';
---

<Layout>
  <!-- Your customizations -->
  <slot />
  <!-- Your additions -->
</Layout>
```

---

## ❌ High Risk Areas (Avoid modifying)

### 6. Core Theme Files (Will cause conflicts)
- ❌ `src/layouts/*.astro` - Core layout structure
- ❌ `src/components/**/*.astro` - Theme components
- ❌ `src/utils/**/*.ts` - Utility functions
- ❌ `src/plugins/**/*.ts` - Theme plugins (except your custom folder)
- ❌ `src/pages/**/*.astro` - Page templates
- ❌ Core style files in `src/styles/` (except your custom.css)

**If you MUST modify these:**
1. Document the exact changes
2. Keep changes minimal and isolated
3. Add comments: `/* CUSTOM: your-change-description */`
4. Be prepared to manually merge conflicts

---

## 🔧 Safe Customization Patterns

### Pattern 1: CSS Variable Overrides
```css
/* src/styles/custom.css */
:root {
  --primary: 250 100% 50%;  /* Override theme color */
  --card-bg: 255 255 255;
}

[data-theme='dark'] {
  --card-bg: 18 18 18;
}
```

### Pattern 2: Tailwind Extensions
```js
// tailwind.config.cjs
module.exports = {
  theme: {
    extend: {
      // Add to existing, don't replace
      typography: (theme) => ({
        DEFAULT: {
          css: {
            // Your custom typography
          },
        },
      }),
    },
  },
}
```

### Pattern 3: Component Composition
```astro
---
// src/components/custom/EnhancedPostCard.astro
import PostCard from '../PostCard.astro';
---

<div class="your-wrapper">
  <PostCard {...props} />
  <!-- Your enhancements -->
</div>
```

### Pattern 4: Plugin Extensions
```ts
// src/plugins/custom/my-remark-plugin.ts
export function myCustomPlugin() {
  // Your plugin logic
}
```

Then add to `astro.config.mjs`:
```js
import { myCustomPlugin } from './src/plugins/custom/my-remark-plugin.ts';

export default defineConfig({
  markdown: {
    remarkPlugins: [
      // Existing plugins...
      myCustomPlugin,  // Add yours at the end
    ],
  },
});
```

---

## 📋 Pre-Merge Checklist

Before pulling upstream updates:

1. **Commit all your changes**
   ```bash
   git add .
   git commit -m "feat: your changes"
   ```

2. **Review your modifications**
   ```bash
   git diff origin/master src/layouts/
   git diff origin/master src/components/
   ```

3. **Document risky changes**
   - List modified core files in `docs/CUSTOMIZATIONS.md`
   - Note line numbers and what was changed

4. **Backup your config**
   ```bash
   cp src/config.ts src/config.backup.ts
   ```

5. **Set up upstream remote** (first time only)
   ```bash
   git remote add upstream https://github.com/saicaca/fuwari.git
   git fetch upstream
   ```

6. **Pull and merge**
   ```bash
   git fetch upstream
   git merge upstream/main --no-commit --no-ff
   # Review conflicts, resolve, then commit
   ```

---

## 🎯 Customization Strategy

### For Visual Changes:
1. **Colors**: Use CSS variables in `:root` and `[data-theme='dark']`
2. **Fonts**: Extend Tailwind config, don't replace
3. **Spacing**: Use Tailwind utilities, create new ones if needed
4. **Layout tweaks**: Wrap components, don't edit them

### For Functional Changes:
1. **New features**: Create in `src/components/custom/`
2. **Modified behavior**: Extend existing, don't replace
3. **New routes**: Add to `src/pages/custom/`
4. **Plugins**: Create in `src/plugins/custom/`

### For Content:
1. **Always safe**: All content files are yours
2. **Keep separate**: Use `public/posts/` for images, not `public/demo/`

---

## 📝 Example: Safe Font Change

**❌ BAD (High conflict risk)**:
```js
// tailwind.config.cjs
fontFamily: {
  mono: ['JetBrains Mono', 'monospace'],  // Replaces defaults
}
```

**✅ GOOD (Low conflict risk)**:
```js
// tailwind.config.cjs
fontFamily: {
  mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],  // Extends
}
```

Or better yet:
```css
/* src/styles/custom.css */
code, pre {
  font-family: 'JetBrains Mono', var(--font-mono) !important;
}
```

---

## 🚨 Conflict Resolution Priority

When conflicts occur:

1. **Config files**: Keep your version (src/config.ts)
2. **Content files**: Keep your version (src/content/*)
3. **Core theme files**: Carefully merge, prefer upstream changes
4. **Style files**: Merge both if possible
5. **Package.json**: Use upstream deps, keep your scripts if custom

---

## 📦 Recommended File Structure

```
.
├── src/
│   ├── config.ts                    ✅ Your config
│   ├── content/                     ✅ Your content
│   ├── assets/images/               ✅ Your images
│   ├── styles/
│   │   ├── custom.css               ✅ Your custom styles
│   │   └── ...                      ❌ Don't touch theme styles
│   ├── components/
│   │   ├── custom/                  ✅ Your components
│   │   └── ...                      ❌ Don't touch theme components
│   ├── plugins/
│   │   ├── custom/                  ✅ Your plugins
│   │   └── ...                      ⚠️ Extend carefully
│   └── ...                          ❌ Avoid modifying
├── public/
│   ├── posts/                       ✅ Your post images
│   ├── favicon/                     ✅ Your favicons
│   └── ...
├── docs/
│   ├── CUSTOMIZATIONS.md            ✅ Document your changes
│   └── MIGRATION.md                 ✅ Your notes
└── ...
```

---

## 🔄 Update Workflow

```bash
# 1. Check your status
git status

# 2. Commit your work
git add .
git commit -m "feat: describe your changes"

# 3. Fetch upstream
git fetch upstream

# 4. Check what changed upstream
git log HEAD..upstream/main --oneline

# 5. Merge (or rebase if preferred)
git merge upstream/main

# 6. Resolve conflicts if any
# - For config: keep yours
# - For core files: prefer upstream, re-apply your changes
# - Test thoroughly after merge

# 7. Test the site
pnpm dev

# 8. Commit merge
git commit -m "chore: merge upstream updates"
```

---

## 💡 Golden Rules

1. **Configuration over modification** - Change config, not code
2. **Extension over replacement** - Add new, don't edit existing
3. **Composition over inheritance** - Wrap, don't rewrite
4. **Documentation is mandatory** - Comment every core file edit
5. **Test before committing** - `pnpm dev` and `pnpm build` must work
6. **Small, atomic commits** - One feature per commit
7. **Upstream first** - Check if theme update solves your need before customizing

---

## 📚 Resources

- Theme repo: https://github.com/saicaca/fuwari
- Astro docs: https://docs.astro.build/
- Tailwind docs: https://tailwindcss.com/docs
- Git merge strategies: https://git-scm.com/docs/git-merge

---

## ✅ Quick Reference: What's Safe?

| File/Folder | Modify? | Reason |
|-------------|---------|--------|
| `src/config.ts` | ✅ YES | Expected to be customized |
| `src/content/*` | ✅ YES | Your content |
| `public/posts/*` | ✅ YES | Your assets |
| `tailwind.config.cjs` | ⚠️ EXTEND | Extend theme, don't replace |
| `astro.config.mjs` | ⚠️ MINIMAL | Only site URL and base |
| `src/styles/custom.css` | ✅ CREATE | Your custom styles |
| `src/components/custom/*` | ✅ CREATE | Your components |
| `src/layouts/*` | ❌ AVOID | Core theme structure |
| `src/components/*` | ❌ AVOID | Core theme components |
| `src/utils/*` | ❌ AVOID | Core theme utilities |
| `package.json` deps | ❌ AVOID | Use theme versions |

---

**Remember**: Every line of theme code you modify is a potential merge conflict. Think twice, extend once! 🎨