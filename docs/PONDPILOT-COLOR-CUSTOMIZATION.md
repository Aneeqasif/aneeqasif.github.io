# PondPilot Color Customization Guide 🎨

How to change SQL syntax highlighting **colors** in PondPilot widgets.

## 🎯 Where to Edit

**File:** `src/scripts/pondpilot-init.ts` (around line 171)

## 📋 Available Color Mappings

These are the colors extracted from your Shiki theme:

```typescript
themeColors.syntaxKeyword      // Color for: SELECT, FROM, WHERE, JOIN
themeColors.syntaxIdentifier   // Color for: table/column names
themeColors.syntaxNumber       // Color for: 123, 45.67
themeColors.syntaxString       // Color for: 'hello', "world"
themeColors.syntaxComment      // Color for: -- comments
themeColors.syntaxSpecial      // Color for: COUNT(*), SUM()
```

## 🔧 How to Remap Colors

### Current Setup (Default - All Colors Match Shiki)

```typescript
// Syntax colors from generated theme file
...themeColors,
```

### Example 1: Use Keyword Color for Strings

```typescript
// Instead of ...themeColors, write explicitly:
syntaxKeyword: themeColors.syntaxKeyword,       // SELECT → pink
syntaxIdentifier: themeColors.syntaxIdentifier, // columns → blue
syntaxNumber: themeColors.syntaxNumber,         // 123 → blue
syntaxString: themeColors.syntaxKeyword,        // 'text' → pink (same as keywords!)
syntaxComment: themeColors.syntaxComment,       // -- → gray
syntaxSpecial: themeColors.syntaxSpecial,       // COUNT → blue
```

### Example 2: Swap Keyword and String Colors

```typescript
syntaxKeyword: themeColors.syntaxString,   // SELECT uses string color
syntaxString: themeColors.syntaxKeyword,   // 'text' uses keyword color
// ... rest stay the same
syntaxIdentifier: themeColors.syntaxIdentifier,
syntaxNumber: themeColors.syntaxNumber,
syntaxComment: themeColors.syntaxComment,
syntaxSpecial: themeColors.syntaxSpecial,
```

### Example 3: Use Custom Hex Colors

```typescript
syntaxKeyword: "#FF6B6B",      // Custom red for SELECT
syntaxString: "#4ECDC4",       // Custom cyan for 'strings'
syntaxComment: "#95A5A6",      // Custom gray for comments
// Use theme colors for the rest:
syntaxIdentifier: themeColors.syntaxIdentifier,
syntaxNumber: themeColors.syntaxNumber,
syntaxSpecial: themeColors.syntaxSpecial,
```

### Example 4: Make Everything Same Color (Monochrome)

```typescript
const monoColor = themeColors.syntaxIdentifier; // Pick one color
syntaxKeyword: monoColor,
syntaxIdentifier: monoColor,
syntaxNumber: monoColor,
syntaxString: monoColor,
syntaxComment: monoColor,
syntaxSpecial: monoColor,
```

### Example 5: High Contrast (Fewer Colors)

```typescript
// Only 3 colors: keyword, identifier, comment
syntaxKeyword: themeColors.syntaxKeyword,       // SELECT, FROM
syntaxString: themeColors.syntaxKeyword,        // 'strings' same as keywords
syntaxSpecial: themeColors.syntaxKeyword,       // COUNT same as keywords
syntaxIdentifier: themeColors.syntaxIdentifier, // table/columns
syntaxNumber: themeColors.syntaxIdentifier,     // numbers same as identifiers
syntaxComment: themeColors.syntaxComment,       // comments stay gray
```

## 🎨 Current Theme Colors (github-dark)

```typescript
syntaxKeyword: "#F97583"      // Pink
syntaxIdentifier: "#79B8FF"   // Blue
syntaxNumber: "#79B8FF"       // Blue (same as identifiers)
syntaxString: "#9ECBFF"       // Light blue
syntaxComment: "#6A737D"      // Gray
syntaxSpecial: "#79B8FF"      // Blue (same as identifiers)
```

## 🧪 How to Test Your Changes

1. **Edit** `src/scripts/pondpilot-init.ts` (line ~171)
2. **Save** the file
3. **Refresh** browser (Ctrl+Shift+R or Cmd+Shift+R)
4. **Check** your PondPilot widgets
5. **Adjust** if needed and refresh again

## 🔍 See Current Colors

To see what colors Shiki extracted from your theme:

```bash
cat src/generated/theme-colors.ts
```

This shows the hex codes for each token type.

## 💡 Pro Tips

### Tip 1: Test One Change at a Time
```typescript
// Change just strings first, see if you like it:
syntaxString: themeColors.syntaxKeyword,
...themeColors,  // Keep rest as default
```

### Tip 2: Use Browser DevTools
1. Open DevTools (F12)
2. Inspect SQL text in PondPilot
3. Look at the computed color
4. Try different hex codes in the inspector
5. Once you find one you like, put it in the code

### Tip 3: Match Your Brand Colors
```typescript
syntaxKeyword: "#FF6B6B",     // Your brand red
syntaxIdentifier: "#4ECDC4",  // Your brand cyan
syntaxString: "#FED766",      // Your brand yellow
```

### Tip 4: Check Contrast
Make sure colors are readable on your background:
- Light backgrounds → use darker colors
- Dark backgrounds → use brighter colors

## 🔄 Reset to Defaults

To go back to using all Shiki colors:

```typescript
// Replace explicit assignments with:
...themeColors,
```

## 🎨 Change Base Theme Colors

To use a completely different color scheme:

**Option 1: Change Shiki Theme**
1. Edit `src/config.ts` line 89:
   ```typescript
   theme: "dracula",  // Try: nord, monokai, github-light
   ```
2. Restart dev server
3. Colors auto-regenerate from new theme

**Option 2: Override Individual Colors** (shown above)
- Keep current theme
- Just remap specific tokens in `pondpilot-init.ts`

## 📖 Quick Reference

### What Each Token Colors

| Token              | SQL Examples                                  |
| ------------------ | --------------------------------------------- |
| `syntaxKeyword`    | `SELECT`, `FROM`, `WHERE`, `JOIN`, `GROUP BY` |
| `syntaxIdentifier` | `users`, `order_id`, `customer_name`          |
| `syntaxString`     | `'hello'`, `"world"`, `'2024-01-01'`          |
| `syntaxNumber`     | `123`, `45.67`, `0.5`                         |
| `syntaxComment`    | `-- this is a comment`                        |
| `syntaxSpecial`    | `COUNT(*)`, `SUM()`, `AVG()`, `MAX()`         |

### Example SQL Query Breakdown

```sql
-- Get top customers              ← syntaxComment
SELECT                             ← syntaxKeyword
  customer_id,                     ← syntaxIdentifier
  COUNT(*) AS order_count,         ← syntaxSpecial (COUNT), syntaxIdentifier (order_count)
  'Active' AS status               ← syntaxString ('Active'), syntaxKeyword (AS)
FROM orders                        ← syntaxKeyword (FROM), syntaxIdentifier (orders)
WHERE total > 100                  ← syntaxKeyword (WHERE), syntaxIdentifier (total), syntaxNumber (100)
```

## 🎯 Common Customizations

### Professional Look (Subtle Colors)
```typescript
syntaxKeyword: "#7AA2F7",      // Soft blue
syntaxIdentifier: "#9ECE6A",   // Soft green
syntaxString: "#E0AF68",       // Soft orange
syntaxComment: "#565F89",      // Muted gray
syntaxNumber: "#FF9E64",       // Soft coral
syntaxSpecial: "#BB9AF7",      // Soft purple
```

### High Contrast (Bold Colors)
```typescript
syntaxKeyword: "#FF0066",      // Hot pink
syntaxIdentifier: "#00FFFF",   // Cyan
syntaxString: "#FFFF00",       // Yellow
syntaxComment: "#666666",      // Gray
syntaxNumber: "#00FF00",       // Green
syntaxSpecial: "#FF6600",      // Orange
```

### Minimal (2 Colors Only)
```typescript
const primary = "#6B9FFF";
const secondary = "#888888";
syntaxKeyword: primary,
syntaxIdentifier: primary,
syntaxString: primary,
syntaxNumber: primary,
syntaxSpecial: primary,
syntaxComment: secondary,
```

## 🆘 Troubleshooting

**Q: Changes not showing?**
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- Check browser console for errors
- Make sure you saved the file

**Q: Want to see original Shiki colors?**
- Look at Expressive Code blocks on your site
- They use the same colors from `theme-colors.ts`

**Q: Colors look wrong in light mode?**
- Your site has theme switching
- Test in both light and dark modes
- Might need different colors for each

**Q: How to use OKLCH instead of hex?**
```typescript
syntaxKeyword: "oklch(0.65 0.2 330)",  // Pink in OKLCH
syntaxString: "oklch(0.70 0.15 200)",  // Blue in OKLCH
```

---

## 📁 Files Reference

| File                                      | Purpose                | Edit?               |
| ----------------------------------------- | ---------------------- | ------------------- |
| `src/scripts/pondpilot-init.ts`           | **Color remapping**    | ✅ YES - Edit here!  |
| `src/generated/theme-colors.ts`           | Theme colors           | ❌ Auto-generated    |
| `src/config.ts`                           | Base theme selection   | ✅ Change theme here |
| `src/plugins/vite-plugin-theme-colors.ts` | Color extraction logic | ⚠️ Advanced only     |

---

**Remember:** Edit `pondpilot-init.ts` (line ~171) to remap colors!

Save → Refresh → See changes instantly! 🚀
