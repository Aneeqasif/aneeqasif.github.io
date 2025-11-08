# TOC Overlay Review

## Findings
- `src/styles/custom/toc-overlay.css`: the overrides that lifted `.text-50`/`.text-30` to fully opaque colors are commented out. Because the markup in `TOC.astro` still applies those utility classes, the entries render at 50% and 30% opacity inside the translucent panel. That regression reintroduces the readability issue the earlier fix addressed. Either drop the utility classes or restore explicit color rules for the overlay panel.

## Open Questions
- Do we still want the TOC text tone to trail the body copy? If the intent is to keep a slightly muted state, we could replace the utility classes with custom values that keep accessibility contrast while still signalling hierarchy.

## Positive Notes
- `initTocOverlay()` fully tears down event listeners via `cleanupTocOverlay()`, so Swup navigations won't leak handlers.
- The overlay panel uses a masked scroll region and respects reduced motion, which keeps the UX smooth for both mouse and keyboard users.
- The custom element in `TOC.astro` guards against conflicting auto/manual scrolling, ensuring the indicator stays in sync with user interaction.
- `flashHeading()` now uses the shared `FLASH_DURATION` constant so the JavaScript timing stays aligned with the 2.0 s CSS animation.

## Suggested Follow-Up Checks
- Manually test toggle via keyboard (Space/Enter, Escape while focus remains inside the panel) after tweaking colors again.
- Scroll through long articles and jump across headings to confirm the halo animation completes and that the panel text remains legible in both light and dark themes.
