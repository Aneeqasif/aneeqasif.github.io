/**
 * PondPilot Widget Initialization
 *
 * Supports:
 * - Shared DuckDB instance across all widgets
 * - Optional .duckdb file loading from frontmatter
 * - Theme auto-detection
 */

import { themeColors } from "../generated/theme-colors";

// Type declarations
declare global {
	interface Window {
		PondPilot: {
			config: (options: Record<string, unknown>) => void;
			init: (selector?: string, overrides?: Record<string, unknown>) => void;
		};
		PONDPILOT_DB_FILE?: string;
	}
}

type DuckDBModule = {
	getJsDelivrBundles: () => unknown;
	selectBundle: (bundles: unknown) => Promise<{
		mainWorker: string;
		mainModule: string;
		pthreadWorker: string;
	}>;
	ConsoleLogger: new (level: number) => unknown;
	LogLevel: { WARNING: number };
	AsyncDuckDB: new (logger: unknown, worker: Worker) => DuckDBInstance;
	DuckDBDataProtocol: { HTTP: number };
};

type DuckDBInstance = {
	instantiate: (mainModule: string, pthreadWorker: string) => Promise<void>;
	registerFileURL: (
		name: string,
		url: string,
		protocol: number,
		force: boolean,
	) => Promise<void>;
	open: (config: { path: string }) => Promise<void>;
	connect: () => Promise<unknown>;
};

/**
 * Detect current theme from site's dark mode class
 */
function detectTheme(): "light" | "dark" {
	return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * Detect if browser is Firefox
 */
function isFirefox(): boolean {
	return navigator.userAgent.toLowerCase().includes("firefox");
}

/**
 * Initialize DuckDB with optional .duckdb file
 */
async function initDuckDBWithFile(
	dbFilePath?: string,
): Promise<DuckDBInstance> {
	const browserType = isFirefox() ? "Firefox" : "Chrome/Other";
	console.log(`[PondPilot] Initializing DuckDB for ${browserType}`);

	// Dynamic import of DuckDB WASM from CDN
	const duckdbModule = (await import(
		"https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.31.1-dev1.0/+esm"
	)) as unknown as DuckDBModule;

	const bundles = duckdbModule.getJsDelivrBundles();

	// For Firefox, manually select the 'eh' (exception handling) bundle
	// For others, use automatic bundle selection
	let bundle: {
		mainWorker: string;
		mainModule: string;
		pthreadWorker: string;
	};

	if (isFirefox()) {
		// Firefox: Use eh (exception handling) bundle
		// biome-ignore lint/suspicious/noExplicitAny: DuckDB bundles structure
		const allBundles = bundles as any;
		bundle = allBundles.eh;
		console.log("[PondPilot] Using DuckDB eh bundle for Firefox");
	} else {
		// Chrome/Safari: Use automatic bundle selection
		bundle = await duckdbModule.selectBundle(bundles);
		console.log("[PondPilot] Using default DuckDB bundle");
	}

	// Create worker with importScripts pattern (works in both Chrome and Firefox)
	const workerUrl = URL.createObjectURL(
		new Blob([`importScripts("${bundle.mainWorker}");`], {
			type: "text/javascript",
		}),
	);
	const worker = new Worker(workerUrl);
	URL.revokeObjectURL(workerUrl);

	const logger = new duckdbModule.ConsoleLogger(duckdbModule.LogLevel.WARNING);
	const db = new duckdbModule.AsyncDuckDB(logger, worker);
	await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

	// If a .duckdb file is specified, register and open it
	if (dbFilePath) {
		const dbUrl = new URL(dbFilePath, window.location.href).href;
		const fileName = dbFilePath.split("/").pop() || "data.duckdb";

		console.log(`[PondPilot] Loading database file: ${fileName}`);

		await db.registerFileURL(
			fileName,
			dbUrl,
			duckdbModule.DuckDBDataProtocol.HTTP,
			false,
		);
		await db.open({ path: fileName });
	}

	return db;
}

/**
 * Initialize PondPilot
 */
async function initPondPilot(): Promise<void> {
	try {
		if (typeof window.PondPilot === "undefined") {
			console.error("[PondPilot] Widget not loaded");
			return;
		}

		// Check if a .duckdb file is specified (set by Layout.astro from frontmatter)
		const dbFilePath = window.PONDPILOT_DB_FILE;

		// Initialize DuckDB (with or without file)
		const dbPromise = initDuckDBWithFile(dbFilePath);

		// Use pre-generated theme colors (extracted at build time)
		console.log("[PondPilot] Using theme colors:", themeColors);

		// Get computed CSS variables for backgrounds
		const rootStyles = getComputedStyle(document.documentElement);
		const getCssVar = (name: string) => rootStyles.getPropertyValue(name).trim();
		const codeblockBg = getCssVar("--codeblock-bg");
		const codeblockTopbarBg = getCssVar("--codeblock-topbar-bg");
		const pondpilotBg = getCssVar("--pondpilot-bg-color") || codeblockBg;
		const pondpilotEditorBg = getCssVar("--pondpilot-editor-bg") || codeblockBg;
		const pondpilotOutputBg = getCssVar("--pondpilot-output-bg") || codeblockTopbarBg;
		const pondpilotTableHeaderBg =
			getCssVar("--pondpilot-table-header-bg") || pondpilotOutputBg;
		const pondpilotTableHeaderText =
			getCssVar("--pondpilot-table-header-text") || themeColors.syntaxKeyword;

		// Configure PondPilot with extracted theme
		window.PondPilot.config({
			duckdbInstance: dbPromise,
			theme: "dark", // Base theme
			showPoweredBy: false,
			customThemes: {
				"site-theme": {
					extends: "dark",
					config: {
						// Backgrounds from CSS variables
						bgColor: pondpilotBg || codeblockBg,
						editorBg: pondpilotEditorBg || codeblockBg,
						outputBg: pondpilotOutputBg || codeblockTopbarBg,
						tableHeaderBg: pondpilotTableHeaderBg || pondpilotOutputBg,
						tableHeaderText: pondpilotTableHeaderText,

						// Syntax colors - YOU CAN REMAP THESE!
						// Example: Use keyword color for strings
						syntaxKeyword: themeColors.syntaxKeyword, // SELECT, FROM, WHERE
						syntaxIdentifier: themeColors.syntaxIdentifier, // table/column names
						syntaxNumber: themeColors.syntaxNumber, // 123, 45.67
						syntaxString: themeColors.syntaxKeyword, // 🎨 REMAPPED: uses keyword color!
						syntaxComment: themeColors.syntaxComment, // -- comments
						syntaxSpecial: themeColors.syntaxSpecial, // COUNT, SUM

						// Or use custom hex colors:
						// syntaxString: "#FF6B6B",  // Custom red for strings
						// syntaxKeyword: "#4ECDC4", // Custom cyan for keywords

						// Typography
						editorFontFamily:
							"Iosevka, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
						editorFontSize: "1.0rem",
						fontSize: "1.0rem",
					},
				},
			},
		});

		// Apply the custom theme
		window.PondPilot.config({ theme: "site-theme" });

		// Initialize all widgets
		window.PondPilot.init();

		// Watch for theme changes
		const observer = new MutationObserver(() => {
			const newTheme = detectTheme();
			document.querySelectorAll(".pondpilot-widget").forEach((widget) => {
				widget.classList.remove("dark", "light");
				widget.classList.add(newTheme);
			});
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		console.log("[PondPilot] Initialization complete");
	} catch (error) {
		console.error("[PondPilot] Initialization failed:", error);
	}
}

// Initialize on DOM ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initPondPilot);
} else {
	initPondPilot();
}

// Export for Swup to call after page transitions
export { initPondPilot };
