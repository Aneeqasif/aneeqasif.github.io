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
