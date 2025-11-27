/**
 * CUSTOM SCRIPT: Marquee/Badge Strip functionality
 * Safe for upstream merges - doesn't modify theme core
 *
 * Creates seamless infinite scroll by duplicating items
 */

function initMarquee(marquee: HTMLElement): void {
	const track = marquee.querySelector<HTMLElement>(".marquee-track");
	if (!track) return;

	const speed = Number.parseFloat(marquee.dataset.speed || "30");

	// Get original items
	const originalItems = Array.from(track.querySelectorAll(".marquee-item"));
	if (originalItems.length === 0) return;

	// Wait for all images to load before calculating
	const images = track.querySelectorAll<HTMLImageElement>("img");
	let loadedCount = 0;
	const totalImages = images.length;

	const setupMarquee = () => {
		// Clear any existing clones
		const clones = track.querySelectorAll("[data-clone]");
		clones.forEach((clone) => {
			clone.remove();
		});

		// Calculate dimensions
		const viewportWidth = marquee.clientWidth;
		const trackStyle = getComputedStyle(track);
		const gapPx = Number.parseFloat(trackStyle.gap || "0");

		// Measure original width (sum of items + gaps between them)
		const originalTrackWidth = track.scrollWidth;

		// The width of one complete set including the gap that will exist between this set and the next
		// This is the exact distance we need to scroll to loop seamlessly
		const singleSetWidth = originalTrackWidth + gapPx;

		// We need enough duplicates so that when we scroll by singleSetWidth,
		// the remaining content still covers the viewport.
		// Remaining Width = Total Width - SingleSetWidth
		// We need: Total Width - SingleSetWidth >= ViewportWidth
		// Since Total Width ≈ SingleSetWidth * (1 + duplicates)
		// Then: SingleSetWidth * duplicates >= ViewportWidth
		const duplicatesNeeded = Math.ceil(viewportWidth / singleSetWidth);

		// Clone items enough times
		for (let i = 0; i < duplicatesNeeded; i++) {
			originalItems.forEach((item) => {
				const clone = item.cloneNode(true) as HTMLElement;
				clone.setAttribute("data-clone", "true");
				track.appendChild(clone);
			});
		}

		// Calculate animation duration based on the distance we scroll (singleSetWidth)
		const duration = singleSetWidth / speed;

		// Set CSS variables
		track.style.setProperty("--marquee-duration", `${duration}s`);
		track.style.setProperty("--marquee-scroll-end", `-${singleSetWidth}px`);

		// Reset animation
		track.style.animation = "none";
		// Force reflow
		void track.offsetHeight;
		track.style.animation = "";
	};

	const checkAllLoaded = () => {
		loadedCount++;
		if (loadedCount >= totalImages) {
			setupMarquee();
		}
	};

	if (totalImages === 0) {
		setupMarquee();
	} else {
		images.forEach((img) => {
			if (img.complete && img.naturalWidth > 0) {
				checkAllLoaded();
			} else {
				img.addEventListener("load", checkAllLoaded, { once: true });
				img.addEventListener(
					"error",
					() => {
						// Remove broken images
						const parent = img.closest(".marquee-item");
						if (parent) {
							parent.remove();
						}
						checkAllLoaded();
					},
					{ once: true },
				);
			}
		});
	}

	// Recalculate on resize
	let resizeTimer: number | null = null;
	const resizeHandler = () => {
		if (resizeTimer) clearTimeout(resizeTimer);
		resizeTimer = window.setTimeout(setupMarquee, 200);
	};

	window.addEventListener("resize", resizeHandler);
}

function initAllMarquees(): void {
	const marquees = document.querySelectorAll<HTMLElement>(
		".marquee[data-marquee-id]",
	);
	marquees.forEach(initMarquee);
}

// Initialize on DOM ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initAllMarquees);
} else {
	initAllMarquees();
}

// Support for Swup page transitions
document.addEventListener("swup:contentReplaced", initAllMarquees);

// Handle astro:page-load for View Transitions
document.addEventListener("astro:page-load", initAllMarquees);

export { initAllMarquees };
