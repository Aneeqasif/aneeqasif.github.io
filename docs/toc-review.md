# TOC Overlay Review

## Findings
- No outstanding issues after the latest pass. The TOC custom element now bootstraps via `requestAnimationFrame`, so reduced-motion users still get the active indicator/flash pairing, and the selector typing matches the anchor nodes it returns.

## Positive Notes
- The tweaked offsets keep both floating controls visually anchored to the post column, and the mobile uplift gives them breathing room above bottom-gesture zones.
- `initTocOverlay()` still tears down listeners on every Swup transition, so the gating logic doesn’t leak handlers or leave stale `wrapperRef`s in place.
- Panel focus management remains solid: opening moves focus into the dialog, closing returns it to the toggle, and Escape/outer clicks stay wired up after each navigation.

## Suggested Follow-Up Checks
- Give the reduced-motion scenario a quick manual run to confirm observers and indicator alignment after a Swup swap.
- Run through keyboard-only navigation (Space/Enter to open, Shift+Tab/Tab cycles, Escape to close) to ensure the new positioning hasn’t introduced focus traps.
