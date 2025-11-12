/**
 * PondPilot Widget Initialization
 *
 * Supports:
 * - Shared DuckDB instance across all widgets
 * - Optional .duckdb file loading from frontmatter
 * - Theme auto-detection with PondPilot v1.4.0 registerTheme API
 */

import { themeColors } from "../generated/theme-colors";

type DuckDBBundle = {
	mainWorker: string;
	mainModule: string;
	pthreadWorker: string;
};

type DuckDBModule = {
	getJsDelivrBundles: () => unknown;
	selectBundle: (bundles: unknown) => Promise<DuckDBBundle>;
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

type PondPilotThemeConfig = {
	bgColor: string;
	textColor: string;
	borderColor: string;
	editorBg: string;
	editorText: string;
	editorFocusBg: string;
	controlsBg: string;
	primaryBg: string;
	primaryText: string;
	primaryHover: string;
	secondaryBg: string;
	secondaryText: string;
	secondaryHover: string;
	mutedText: string;
	errorText: string;
	errorBg: string;
	errorBorder: string;
	tableHeaderBg: string;
	tableHeaderText: string;
	tableHover: string;
	outputBg: string;
	syntaxKeyword: string;
	syntaxString: string;
	syntaxNumber: string;
	syntaxComment: string;
	syntaxSpecial: string;
	syntaxIdentifier: string;
	fontFamily: string;
	editorFontFamily: string;
	fontSize: string;
	editorFontSize: string;
	buttonFontSize: string;
	metadataFontSize: string;
};

const MONO_FONT_STACK =
	"Iosevka, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace";
const DUCKDB_WASM_URL =
	"https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.31.1-dev1.0/+esm";

let duckdbModulePromise: Promise<DuckDBModule> | null = null;
let duckdbInstancePromise: Promise<DuckDBInstance> | null = null;
let pondPilotConfigured = false;
let lastDbFilePath: string | undefined;
let lastConfiguredDbPath: string | undefined;
let themeObserver: MutationObserver | null = null;

async function waitForPondPilotReady(
	maxAttempts = 40,
	intervalMs = 50,
): Promise<boolean> {
	for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
		if (typeof window.PondPilot !== "undefined") {
			return true;
		}
		await new Promise((resolve) => setTimeout(resolve, intervalMs));
	}
	return false;
}

function detectTheme(): "light" | "dark" {
	return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function isFirefox(): boolean {
	return navigator.userAgent.toLowerCase().includes("firefox");
}

async function loadDuckDBModule(): Promise<DuckDBModule> {
	if (!duckdbModulePromise) {
		duckdbModulePromise = (
			import(/* @vite-ignore */ DUCKDB_WASM_URL) as Promise<unknown>
		).then((module) => module as DuckDBModule);
	}
	return duckdbModulePromise;
}

function collectThemeTokens(): PondPilotThemeConfig {
	const rootStyles = getComputedStyle(document.documentElement);
	const read = (name: string, fallback: string) => {
		const value = rootStyles.getPropertyValue(name).trim();
		return value || fallback;
	};

	const resolver = document.createElement("div");
	resolver.style.position = "absolute";
	resolver.style.opacity = "0";
	resolver.style.pointerEvents = "none";
	resolver.style.zIndex = "-1";
	resolver.style.width = "0";
	resolver.style.height = "0";
	const resolverHost = document.body ?? document.documentElement;
	resolverHost.appendChild(resolver);

	const resolveColor = (varName: string, fallback: string) => {
		resolver.style.color = fallback;
		resolver.style.color = `var(${varName})`;
		const computed = getComputedStyle(resolver).color;
		return computed || fallback;
	};

	const bgFallback = resolveColor("--codeblock-bg", "#0f172a");
	const topbarFallback = resolveColor("--codeblock-topbar-bg", "#1e293b");
	const textFallback = resolveColor(
		"--pondpilot-text-color",
		themeColors.syntaxIdentifier,
	);
	const primaryBg = resolveColor("--pondpilot-primary-bg", topbarFallback);
	const secondaryBg = resolveColor("--pondpilot-secondary-bg", topbarFallback);

	const theme: PondPilotThemeConfig = {
		bgColor: resolveColor("--pondpilot-bg-color", bgFallback),
		textColor: textFallback,
		borderColor: resolveColor(
			"--pondpilot-border-color",
			"rgba(255,255,255,0.08)",
		),
		editorBg: resolveColor("--pondpilot-editor-bg", bgFallback),
		editorText: resolveColor("--pondpilot-editor-text", textFallback),
		editorFocusBg: resolveColor(
			"--pondpilot-editor-focus-bg",
			topbarFallback,
		),
		controlsBg: resolveColor("--pondpilot-controls-bg", topbarFallback),
		primaryBg,
		primaryText: resolveColor(
			"--pondpilot-primary-text",
			themeColors.syntaxKeyword,
		),
		primaryHover: resolveColor("--pondpilot-primary-hover", primaryBg),
		secondaryBg,
		secondaryText: resolveColor(
			"--pondpilot-secondary-text",
			textFallback,
		),
		secondaryHover: resolveColor(
			"--pondpilot-secondary-hover",
			secondaryBg,
		),
		mutedText: resolveColor("--pondpilot-muted-text", themeColors.syntaxComment),
		errorText: resolveColor("--pondpilot-error-text", "#f87171"),
		errorBg: resolveColor(
			"--pondpilot-error-bg",
			"rgba(248, 113, 113, 0.12)",
		),
		errorBorder: resolveColor(
			"--pondpilot-error-border",
			"rgba(248, 113, 113, 0.32)",
		),
		tableHeaderBg: resolveColor(
			"--pondpilot-table-header-bg",
			topbarFallback,
		),
		tableHeaderText: resolveColor(
			"--pondpilot-table-header-text",
			themeColors.syntaxKeyword,
		),
		tableHover: resolveColor("--pondpilot-table-hover", topbarFallback),
		outputBg: resolveColor("--pondpilot-output-bg", topbarFallback),
		syntaxKeyword: themeColors.syntaxKeyword,
		syntaxString: themeColors.syntaxString,
		syntaxNumber: themeColors.syntaxNumber,
		syntaxComment: themeColors.syntaxComment,
		syntaxSpecial: themeColors.syntaxSpecial,
		syntaxIdentifier: themeColors.syntaxIdentifier,
		fontFamily: read(
			"--pondpilot-font-family",
			"MiSans, Inter, 'Helvetica Neue', Arial, sans-serif",
		),
		editorFontFamily: read("--pondpilot-editor-font-family", MONO_FONT_STACK),
		fontSize: read("--pondpilot-font-size", "1rem"),
		editorFontSize: read("--pondpilot-editor-font-size", "1rem"),
		buttonFontSize: read("--pondpilot-button-font-size", "13px"),
		metadataFontSize: read("--pondpilot-metadata-font-size", "14px"),
	};

	resolver.remove();
	return theme;
}

function registerSiteTheme(theme: PondPilotThemeConfig) {
	if (typeof window.PondPilot.registerTheme === "function") {
		window.PondPilot.registerTheme("site-theme", {
			extends: "dark",
			config: theme,
		});
		return;
	}

	window.PondPilot.config({
		customThemes: {
			"site-theme": {
				extends: "dark",
				config: theme,
			},
		},
	});
}

async function createDuckDBInstance(dbFilePath?: string): Promise<DuckDBInstance> {
	const duckdbModule = await loadDuckDBModule();
	const bundles = duckdbModule.getJsDelivrBundles();

	let bundle: DuckDBBundle;

	if (isFirefox()) {
		const allBundles = bundles as Record<string, DuckDBBundle>;
		bundle = allBundles?.eh ?? (await duckdbModule.selectBundle(bundles));
		console.log("[PondPilot] Using DuckDB eh bundle for Firefox");
	} else {
		bundle = await duckdbModule.selectBundle(bundles);
		console.log("[PondPilot] Using default DuckDB bundle");
	}

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

async function getDuckDBInstance(dbFilePath?: string): Promise<DuckDBInstance> {
	const pathChanged = dbFilePath !== lastDbFilePath;

	if (!duckdbInstancePromise || pathChanged) {
		lastDbFilePath = dbFilePath;
		duckdbInstancePromise = createDuckDBInstance(dbFilePath);
	}

	return duckdbInstancePromise;
}

function syncWidgetsToTheme(): void {
	const newTheme = detectTheme();
	document.querySelectorAll(".pondpilot-widget").forEach((widget) => {
		widget.classList.remove("dark", "light");
		widget.classList.add(newTheme);
	});
}

function ensureThemeObserver(): void {
	if (themeObserver) {
		return;
	}

	themeObserver = new MutationObserver(syncWidgetsToTheme);
	themeObserver.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});
}

async function configurePondPilot(dbFilePath?: string): Promise<void> {
	const pathChanged = dbFilePath !== lastConfiguredDbPath;
	const duckdbPromise = getDuckDBInstance(dbFilePath);
	const duckdbModule = await loadDuckDBModule();
	const themeConfig = collectThemeTokens();

	if (!pondPilotConfigured || pathChanged) {
		console.log("[PondPilot] Using theme colors:", themeColors);
	}

	registerSiteTheme(themeConfig);

	window.PondPilot.config({
		autoInit: false,
		duckdbInstance: duckdbPromise,
		duckdbModule,
		theme: "site-theme",
		showPoweredBy: false,
		customThemes: {
			"site-theme": {
				extends: "dark",
				config: themeConfig,
			},
		},
	});

	pondPilotConfigured = true;
	lastConfiguredDbPath = dbFilePath;
	console.log("[PondPilot] Configuration complete");
}

async function initPondPilot(): Promise<void> {
	try {
		const pondPilotReady = await waitForPondPilotReady();
		if (!pondPilotReady) {
			console.error("[PondPilot] Widget not loaded");
			return;
		}

		const dbFilePath = window.PONDPILOT_DB_FILE;
		const needsConfigure =
			!pondPilotConfigured || dbFilePath !== lastConfiguredDbPath;

		if (needsConfigure) {
			await configurePondPilot(dbFilePath);
		}

		window.PondPilot.init();
		syncWidgetsToTheme();
		ensureThemeObserver();
		console.log("[PondPilot] Widgets initialized");
	} catch (error) {
		console.error("[PondPilot] Initialization failed:", error);
	}
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => {
		void initPondPilot();
	});
} else {
	void initPondPilot();
}

export { initPondPilot };
