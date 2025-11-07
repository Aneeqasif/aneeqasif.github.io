# Comments Feature

## Summary
- Added Waline-powered comments below licenses on post pages.
- Centralized runtime options (server URL, language, toggles) in `src/config/comments/waline.ts`.
- Restyled the widget for theme parity, reaction-first layout, and Swup friendliness.

## Modified Files
- `package.json`
- `pnpm-lock.yaml`
- `src/config/comments/waline.ts`
- `src/components/WalineComments.svelte`
- `src/pages/posts/[...slug].astro`
- `src/styles/custom/waline.css`
- `docs/comments-feature.md`

## Extras (Configurable)
- `login`, `meta`, and `requiredMeta` for guest vs. authenticated flows.
- `comment`, `pageview`, `reaction`, `pageSize`, and `wordLimit` behaviour.
- Language + locale strings (e.g. placeholder, headings) via `walineClientConfig`.
- Theme variables and layout tweaks in `src/styles/custom/waline.css`.
- Future hooks for emoji packs, uploaders, and moderation plugins.
