# PondPilot + Swup Integration Fix

## Problem

PondPilot customizations were not loading when navigating between pages using Swup (your page transition library):

- ✅ **Direct URL access**: Customizations loaded correctly
- ❌ **Home → Post navigation**: Vanilla theme appeared, no customizations

## Root Cause

1. **PondPilot has `data-no-auto-init`** to prevent race condition (from previous fix)
2. **Init script runs once** on `DOMContentLoaded`
3. **Swup replaces DOM** during navigation, but init script doesn't run again
4. **New widgets created** without configuration or initialization

## Solution

Split PondPilot initialization into two phases:

### Phase 1: Configure (runs once)
- Set up theme colors
- Configure DuckDB instance
- Register custom theme
- **Stored in `pondPilotConfigured` flag**

### Phase 2: Initialize Widgets (runs on every page)
- Call `window.PondPilot.init()` to render widgets
- Apply dark/light mode classes
- **Runs on DOMContentLoaded AND Swup `page:view` event**

## Implementation

### Updated `src/scripts/pondpilot-init.ts`

```typescript
// Track configuration state
let pondPilotConfigured = false;

function configurePondPilot() {
  // Configure theme, DuckDB, custom themes
  window.PondPilot.config({ ... });
}

async function initPondPilotWidgets() {
  // Initialize widgets on current page
  window.PondPilot.init();
}

async function initPondPilot() {
  if (!pondPilotConfigured) {
    configurePondPilot();
    pondPilotConfigured = true;
  }
  await initPondPilotWidgets();
}

// First page load
document.addEventListener("DOMContentLoaded", initPondPilot);

// Swup navigation
window.swup.hooks.on("content:replace", () => {
  window.PondPilot.destroy(); // Clean up old widgets
});

window.swup.hooks.on("page:view", () => {
  initPondPilotWidgets(); // Re-initialize on new page
});
```

## How It Works

### First Page Load (Direct URL)
1. DOMContentLoaded fires
2. `configurePondPilot()` runs (theme + DuckDB)
3. `initPondPilotWidgets()` runs
4. Widgets appear with custom theme ✅

### Navigation (Home → Post via Swup)
1. User clicks link
2. Swup replaces DOM content
3. `content:replace` hook: Destroy old widgets
4. `page:view` hook: `initPondPilotWidgets()` runs
5. New widgets appear with custom theme ✅

## Key Changes

### Before (Broken)
```typescript
// Runs ONCE on DOMContentLoaded
async function initPondPilot() {
  window.PondPilot.config({ ... });
  window.PondPilot.init();
}

document.addEventListener("DOMContentLoaded", initPondPilot);
// ❌ No Swup integration
```

### After (Working)
```typescript
// Configuration runs ONCE
// Widget initialization runs on EVERY page
async function initPondPilot() {
  if (!pondPilotConfigured) {
    configurePondPilot(); // ONCE
    pondPilotConfigured = true;
  }
  await initPondPilotWidgets(); // EVERY PAGE
}

// First load
document.addEventListener("DOMContentLoaded", initPondPilot);

// Swup navigation
window.swup.hooks.on("page:view", () => {
  initPondPilotWidgets(); // ✅ Runs on every navigation
});
```

## Testing

### Test Case 1: Direct URL Access
1. Clear browser cache
2. Navigate directly to post with PondPilot widget
3. **Expected**: Custom theme visible immediately

### Test Case 2: Home → Post Navigation
1. Start on homepage
2. Click link to post with PondPilot widget
3. **Expected**: Custom theme visible (no vanilla flash)

### Test Case 3: Post → Post Navigation
1. Start on post with PondPilot widget
2. Click link to another post with PondPilot widget
3. **Expected**: Old widgets cleaned up, new widgets with custom theme

## Related Fixes

### 1. Race Condition Fix (Previous)
- Added `data-no-auto-init` to prevent vanilla theme on fresh deploy
- File: `src/layouts/Layout.astro` line 165

### 2. Mobile UX Fix (Previous)
- Added horizontal scroll for code (`white-space: pre`)
- File: `src/styles/custom/pondpilot.css`

### 3. Gallery Mobile Fix (Previous)
- Maintained 2-column grid on mobile
- File: `src/styles/custom/gallery.css`

## Debug Tips

### Check if PondPilot is configured
```javascript
// In browser console
console.log(window.PondPilot.getConfig());
// Should show custom theme "site-theme"
```

### Check if widgets are initialized
```javascript
// In browser console
document.querySelectorAll('.pondpilot-widget').length
// Should match number of code blocks on page
```

### Check Swup integration
```javascript
// In browser console
console.log(window.swup?.hooks);
// Should show hooks object
```

### Enable verbose logging
Check console for:
- `[PondPilot] Using theme colors:` (once on first load)
- `[PondPilot] Configuration complete` (once on first load)
- `[PondPilot] Widgets initialized` (on every page)
- `[PondPilot] Swup integration enabled` (once on first load)

## Known Limitations

1. **DuckDB Instance**: Shared across all widgets (by design for performance)
2. **TypeScript Warnings**: Non-breaking warnings about dynamic imports
3. **Theme Observer**: Only one global observer (efficient, but could conflict if multiple theme systems exist)

## Files Modified

1. ✅ `src/scripts/pondpilot-init.ts` - Added Swup integration
2. ✅ `src/layouts/Layout.astro` - Already has `data-no-auto-init`
3. ✅ `src/styles/custom/pondpilot.css` - Already has squared bottom corners on focus

## Deployment Checklist

- [x] Updated init script with Swup hooks
- [x] TypeScript type definitions updated
- [x] Tested direct URL access
- [x] Tested Swup navigation (home → post)
- [x] Tested Swup navigation (post → post)
- [x] Verified no memory leaks (widgets destroyed on page change)
- [x] Verified theme changes apply to new widgets

## Status

🚀 **Ready to deploy!**

All issues resolved:
- ✅ Direct URL access works
- ✅ Swup navigation works
- ✅ No memory leaks
- ✅ Theme changes apply globally
- ✅ Mobile UX optimized
