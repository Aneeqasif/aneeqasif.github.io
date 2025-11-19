# Font Warmup Helper (Archived Usage Note)

This document records why the `scheduleFontWarmup` helper was removed from `Layout.astro`, how the module behaves, and the exact steps to bring it back. The inline loader is gone to keep the head lean. The helper source remains checked in at `src/scripts/font-warmup.ts`, is not imported anywhere else in the project today, and this note (`docs/fonts-warmup-trick.md`) is the canonical reference for its archived usage.

## When to Use It

- Code-heavy articles that lean on a custom monospace (Iosevka).
- Situations where `font-display: optional` keeps first paint fast, yet you want the branded font ready before users scroll into long code blocks.
- Scenarios where you can tolerate a small, best-effort client-side script in exchange for fewer mid-read font swaps.

## Why It Was Parked

| Concern                     | Detail                                                                 |
|-----------------------------|-------------------------------------------------------------------------|
| Runtime safety              | The earlier inline loader used `Astro.resolve`, which broke the build. |
| Minimal benefit at present  | `display=optional` + system fallbacks already prevent flashes.         |
| Page head simplicity        | Removing the warmup script avoided one more module fetch on load.      |

## Module Overview

The helper module (`src/scripts/font-warmup.ts`) exports two entry points:

- `scheduleFontWarmup(requests: FontWarmupRequest[], timeout = 2000)`: Schedules a warmup after `window.load` using `requestIdleCallback` (with a timeout shim).
- `warmFonts(requests: FontWarmupRequest[])`: Immediately calls `document.fonts.load` for the specified family/weight/style combos.

Key details:

- A per-descriptor cache prevents redundant loads.
- Errors are swallowed, with a console warning under the `[font-warmup]` tag.
- Requests default to weight `400` and style `normal`.

## Helper Source Snapshot

```aneeqasif.github.io/src/scripts/font-warmup.ts#L1-160
/**
 * Lightweight runtime helper to warm custom web fonts after the initial paint.
 *
 * Example:
 * ```ts
 * import { scheduleFontWarmup } from "@/scripts/font-warmup";
 *
 * scheduleFontWarmup([
 *   { family: "Iosevka", weights: ["400", "500", "700"] },
 *   { family: "Roboto", weights: [400, 500], styles: ["italic"] },
 * ]);
 * ```
 */

type FontWeight = string | number;

export interface FontWarmupRequest {
	family: string;
	weights?: FontWeight[];
	styles?: string[];
	stretch?: string;
	testString?: string;
}

const warmedFonts = new Set<string>();

function keyOf(request: FontWarmupRequest, weight: FontWeight, style: string): string {
	return `${request.family}|${weight}|${style}|${request.stretch}|${request.testString ?? ""}`;
}

async function warmSingle(request: FontWarmupRequest, weight: FontWeight, style: string): Promise<void> {
	if (typeof document === "undefined" || typeof document.fonts === "undefined") {
		return;
	}

	const cacheKey = keyOf(request, weight, style);
	if (warmedFonts.has(cacheKey)) {
		return;
	}

	const descriptorParts = [`${style} ${weight} 1em ${JSON.stringify(request.family)}`];

	if (request.stretch) {
		descriptorParts.splice(1, 0, request.stretch);
	}

	try {
		await document.fonts.load(descriptorParts.join(" "), request.testString);
		warmedFonts.add(cacheKey);
	} catch (error) {
		// Ignore load errors: this is a best-effort warmup.
		console.warn("[font-warmup] Failed to load font:", descriptorParts.join(" "), error);
	}
}

async function warmRequest(request: FontWarmupRequest): Promise<void> {
	const weights = request.weights?.length ? request.weights : ["400"];
	const styles = request.styles?.length ? request.styles : ["normal"];

	const loaders = styles.flatMap((style) => weights.map((weight) => warmSingle(request, weight, style)));
	await Promise.all(loaders);
}

export function warmFonts(requests: FontWarmupRequest[]): Promise<void> {
	if (typeof document === "undefined" || typeof document.fonts === "undefined") {
		return Promise.resolve();
	}

	return Promise.all(requests.map((request) => warmRequest(request))).then(() => void 0);
}

type IdleHandle = number;

type IdleCallback = (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void;

interface IdleScheduler {
	(callback: IdleCallback, options?: { timeout: number }): IdleHandle;
	cancel(handle: IdleHandle): void;
}

const idleScheduler: IdleScheduler = (() => {
	if (typeof window !== "undefined" && typeof (window as typeof window & { requestIdleCallback?: IdleScheduler })["requestIdleCallback"] === "function") {
		const win = window as typeof window & { requestIdleCallback: IdleScheduler; cancelIdleCallback: (handle: IdleHandle) => void };
		return Object.assign(
			(callback: IdleCallback, options?: { timeout: number }) => win.requestIdleCallback(callback, options),
			{ cancel: (handle: IdleHandle) => win.cancelIdleCallback(handle) },
		);
	}

	return Object.assign(
		(callback: IdleCallback, options?: { timeout: number }) => {
			const timeout = options?.timeout ?? 1_000;
			let start = Date.now();
			return window.setTimeout(() => {
				callback({
					didTimeout: true,
					timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
				});
			}, Math.min(timeout, 1_500));
		},
		{ cancel: (handle: IdleHandle) => window.clearTimeout(handle) },
	);
})();

export function scheduleFontWarmup(requests: FontWarmupRequest[], timeout = 2_000): void {
	if (typeof window === "undefined") {
		return;
	}

	const runWarmup = () => {
		void warmFonts(requests);
	};

	if (document.readyState === "complete") {
		idleScheduler(runWarmup, { timeout });
		return;
	}

	const onLoad = () => {
		idleScheduler(runWarmup, { timeout });
	};

	window.addEventListener("load", onLoad, { once: true });
}

export default warmFonts;
```

## Re-Enabling the Warmup

1. **Import dynamically inside the layout head (or a page-specific layout).**

   ```aneeqasif.github.io/src/layouts/Layout.astro#L150-L166
   <script type="module">
     import("@/scripts/font-warmup")
       .then(({ scheduleFontWarmup }) => {
         scheduleFontWarmup([
           { family: "Iosevka", weights: ["400", "500", "700"] },
         ]);
       })
       .catch((err) => {
         console.warn("font-warmup import failed:", err);
       });
   </script>
   ```

   Without re-adding a loader like the snippet above, the helper module remains dormant and no runtime bundles reference it.

2. **Pair with non-blocking CSS.** Keep the `@fontsource/...css?display=optional` imports so the warmup becomes a progressive enhancement.

3. **Scope usage to code-heavy layouts.** If only certain templates benefit, wrap the script in an `{Astro.props.enableFontWarmup && …}` guard or inject via a page-level slot.

## Tuning Options

- **Weights/Styles:** Pass additional weights (`"300"`, `"600"`) or styles (`"italic"`) as needed.
- **Stretch/Test String:** Use `stretch` or `testString` when relying on condensed/expanded variants or scripts that need better glyph coverage.
- **Timeout:** Increase the `scheduleFontWarmup` timeout if you need to defer the warmup during heavy route transitions.

## Observability Checklist

- Inspect the network panel for `fontsource` requests after the idle callback fires.
- Watch the console for the `font-warmup` warning to catch 4xx/5xx fetch issues.
- Verify code blocks render with Iosevka by comparing computed styles before and after the warmup.

---

Keep this note handy if we regress on perceived code readability or reintroduce the helper for specific content verticals.