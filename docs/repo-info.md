# Repository Information

## Overview
- Static blog theme based on Astro 5 (template name: Fuwari) with a demo configuration (`siteConfig` in `src/config.ts`).
- Ships with smooth page transitions via Swup, light/dark theme support, responsive layout, and Pagefind-powered search.
- Content lives in `src/content/` and is built into a static site suitable for CDNs or providers like Vercel, Netlify, or GitHub Pages.

## Tooling & Dependencies
- Requires Node.js 20+ and pnpm 9+ (`packageManager` locked to `pnpm@9.14.4`).
- Core stack: Astro, Svelte islands (`@astrojs/svelte`), Tailwind CSS (with typography plugin), Stylus, and Pagefind for search indexing.
- Markdown enhancements via Remark and Rehype plugins: math (KaTeX), GitHub-style admonitions, custom directives, automatic TOCs, linkable headings, reading-time and excerpt generators, plus Expressive Code for rich code blocks.
- UI assets leverage Iconify icon sets and Overlayscrollbars; Photoswipe adds image lightbox support.

## npm Scripts (pnpm)
- `pnpm dev` / `pnpm start`: run Astro dev server on `localhost:4321`.
- `pnpm build`: build the production site and run Pagefind to index `dist` for search.
- `pnpm preview`: serve the production build locally.
- `pnpm check` and `pnpm type-check`: Astro diagnostics and TypeScript isolated declaration checks.
- `pnpm format` / `pnpm lint`: Biome formatter and linter over `src/`.
- `pnpm new-post <slug>`: scaffolds a Markdown post with frontmatter via `scripts/new-post.js` (creates directories as needed).
- `pnpm astro ...`: expose the Astro CLI for additional commands.

## Content Model & Structure
- Collections defined in `src/content/config.ts`: `posts` (typed frontmatter with optional draft, tags, category, prev/next metadata) and `spec` for miscellaneous pages.
- Example posts and guides live under `src/content/posts/`, with a separate `spec/about.md` used by the About page.
- Layouts in `src/layouts/` (`Layout.astro`, `MainGridLayout.astro`) orchestrate global structure, while components under `src/components/` cover navigation, post metadata, widgets, and controls.
- `src/utils/` holds helper utilities for content metadata, dates, settings, and URL logic.

## Configuration Highlights
- Global site settings, navbar links, profile card, licensing, and Expressive Code theme defined in `src/config.ts`.
- Astro config (`astro.config.mjs`) wires integrations (Tailwind, Swup, Iconify, Expressive Code, Svelte) and custom Markdown pipeline (remark/rehype plugins, admonition/GitHub card components, anchor appending). Custom rollup warning suppression ensures cleaner build logs.
- Internationalization support in `src/i18n/` with language maps (EN plus ES, ID, JA, KO, TH, TR, VI, ZH-CN, ZH-TW). `getTranslation` falls back to English if the requested locale is missing.
- Styling combines Tailwind utilities (`styles/main.css`) with supplementary Stylus files (`styles/variables.styl`, `markdown-extend.styl`) and Expressive Code overrides.

## What to Customize (User-Facing Configuration)

### Essential Configuration Files
1. **`src/config.ts`** - **PRIMARY CONFIGURATION FILE**
   - `siteConfig`: Site title, subtitle, language, theme color (hue), banner image, TOC settings, favicon
   - `navBarConfig`: Navigation bar links (Home, Archive, About, external links)
   - `profileConfig`: Avatar image, name, bio, social media links
   - `licenseConfig`: Content license display (CC BY-NC-SA, etc.)
   - `expressiveCodeConfig`: Code block theme

2. **`astro.config.mjs`**
   - `site`: Your production URL (currently `https://fuwari.vercel.app/`)
   - `base`: Base path for deployment (e.g., `/blog/` for GitHub Pages)
   - `trailingSlash`: URL trailing slash behavior

### Content to Replace
1. **`src/content/posts/`** - Replace demo posts with your own blog posts
   - Delete or replace: `draft.md`, `expressive-code.md`, `markdown-extended.md`, `markdown.md`, `video.md`, `guide/index.md`
   - Create new posts with `pnpm new-post <slug>`

2. **`src/content/spec/about.md`** - Your About page content

3. **`src/assets/images/`** - Replace demo assets
   - `demo-avatar.png`: Your profile avatar
   - `demo-banner.png`: Your site banner (if enabled)

4. **`public/favicon/`** - Add your favicon files

### Optional Customization
- **`src/styles/`** - Adjust colors, fonts, spacing (especially `variables.styl`)
- **`tailwind.config.cjs`** - Extend Tailwind theme
- **`src/i18n/languages/`** - Edit or add translations for UI text
- **`package.json`** - Update `name`, `version` for your site

## Core Theme Files (Don't Modify Unless Extending)
These files implement the theme's functionality and should generally be left alone unless you're making theme-level changes:

### Layouts & Components
- `src/layouts/`: Page layout structure
- `src/components/`: UI components (Navbar, Footer, PostCard, Search, etc.)
- `src/pages/`: Route templates and dynamic page generation

### Logic & Utilities
- `src/utils/`: Content processing, date formatting, URL handling
- `src/plugins/`: Remark/Rehype markdown processors
- `src/constants/`: Internal constants and presets
- `src/types/`: TypeScript type definitions

### Build Configuration
- `astro.config.mjs`: Integration config (Tailwind, Svelte, Swup, etc.) - modify carefully
- `svelte.config.js`, `postcss.config.mjs`, `tsconfig.json`: Build tooling
- `biome.json`: Code formatting rules
- `pagefind.yml`: Search indexing configuration

## Quick Start Checklist
1. ✅ Edit `src/config.ts` with your site info, profile, and navigation
2. ✅ Update `site` URL in `astro.config.mjs`
3. ✅ Replace images in `src/assets/images/`
4. ✅ Replace content in `src/content/spec/about.md`
5. ✅ Delete demo posts in `src/content/posts/`
6. ✅ Create your first post: `pnpm new-post my-first-post`
7. ✅ Add your favicon to `public/favicon/`
8. ✅ Update `README.md` with your project info
9. ✅ Test locally: `pnpm dev`
10. ✅ Build and deploy: `pnpm build` then deploy `dist/` folder

## Additional Notes
- Documentation translations live under `docs/README.*.md`; `docs/README.es.md` etc. mirror the main README in multiple languages.
- `public/favicon/` contains assets referenced by default favicons when the custom list in `siteConfig` is empty.
- `vercel.json` is present for quick deployment defaults, and `pagefind.yml` customizes search indexing behavior.
- Project enforces pnpm usage (`preinstall` script) to avoid inconsistent lockfiles.
