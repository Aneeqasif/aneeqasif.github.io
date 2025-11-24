<script lang="ts">
import { onDestroy, onMount, tick } from "svelte";
import { fade, scale } from "svelte/transition";
import SeriesPanel from "./SeriesPanel.svelte";

export let currentPart: number;
export let totalParts: number;
export let seriesName: string;
export let allSeriesPosts: any[] = []; // Posts in this series
export let currentSlug: string; // Current post slug

let showModal = false;
let isHovered = false;
let isLoaded = false; // Track if page has loaded
let isClicked = false; // Track if button is clicked
let isAnimating = false; // Track if we're in the middle of animation
let modalContentElement: HTMLDivElement | null = null; // Reference to modal content
let modalOverlayElement: HTMLDivElement | null = null; // Reference to modal overlay
let widgetContainerElement: HTMLDivElement | null = null; // Reference to widget container
const MODAL_PADDING = 24; // 1.5rem baseline for spacing
let listenersAttached = false;
let measurementRaf: number | null = null;

onMount(() => {
	// Trigger slide animation once on page load
	setTimeout(() => {
		isLoaded = true;
	}, 100);

	// Global click handler to close modal when clicking outside
	function handleGlobalClick(event: MouseEvent) {
		if (!showModal || !modalContentElement) return;

		// Check if click is outside modal content
		if (!modalContentElement.contains(event.target as Node)) {
			closeModal();
		}
	}

	// Add listener to window for global click detection
	window.addEventListener("click", handleGlobalClick);

	return () => {
		// Cleanup on unmount
		window.removeEventListener("click", handleGlobalClick);
	};
});

onDestroy(() => {
	resetModalMeasurements();
	if (typeof document !== "undefined") {
		document.body.style.overflow = "";
	}
});

function openModal(event: MouseEvent) {
	event.preventDefault();
	event.stopPropagation();

	if (showModal) return;

	// Show modal immediately - no delay
	isClicked = true;
	isHovered = false;
	showModal = true;
	document.body.style.overflow = "hidden";
	queueModalMeasurements();
}

function closeModal() {
	showModal = false;
	// Don't reset measurements or overflow here - wait for outro
	detachModalListeners();
	if (measurementRaf) {
		cancelAnimationFrame(measurementRaf);
		measurementRaf = null;
	}
}

function onModalOutroEnd() {
	resetModalMeasurements();
	if (typeof document !== "undefined") {
		document.body.style.overflow = "";
	}
	// Reset click state so cards slide out again AFTER modal is gone
	isClicked = false;
}

function handleKeydown(e: KeyboardEvent) {
	if (e.key === "Escape" && showModal) {
		closeModal();
	}
}

function handlePostClick(event: MouseEvent, postSlug: string) {
	// Always close modal immediately for better UX
	closeModal();

	// If clicking on current post, prevent default navigation (since we are already here)
	if (postSlug === currentSlug) {
		event.preventDefault();
	}
	// Otherwise, let the link navigate normally
}

function getScrollableAncestor(element: HTMLElement | null): HTMLElement {
	let current = element?.parentElement ?? null;
	while (current && current !== document.body) {
		const style = getComputedStyle(current);
		const overflow = `${style.overflow}${style.overflowX}${style.overflowY}`;
		if (/(auto|scroll|hidden)/.test(overflow)) {
			return current;
		}
		current = current.parentElement;
	}
	return document.documentElement;
}

function attachModalListeners() {
	if (listenersAttached) return;
	listenersAttached = true;
	window.addEventListener("resize", queueModalMeasurements);
	document.addEventListener("scroll", queueModalMeasurements, true);
}

function detachModalListeners() {
	if (!listenersAttached) return;
	listenersAttached = false;
	window.removeEventListener("resize", queueModalMeasurements);
	document.removeEventListener("scroll", queueModalMeasurements, true);
}

function queueModalMeasurements() {
	if (!showModal) return;
	if (measurementRaf) {
		cancelAnimationFrame(measurementRaf);
	}
	measurementRaf = requestAnimationFrame(() => {
		measurementRaf = null;
		updateModalMeasurements();
	});
}

async function updateModalMeasurements() {
	if (!showModal) return;
	await tick();
	if (!modalOverlayElement || !modalContentElement) {
		queueModalMeasurements();
		return;
	}
	const postContainer =
		document.getElementById("post-container") ||
		widgetContainerElement?.closest(".card-base");

	if (postContainer) {
		const rect = postContainer.getBoundingClientRect();
		const viewportHeight = window.innerHeight;

		// Calculate visible intersection
		const visibleTop = Math.max(rect.top, 0);
		const visibleBottom = Math.min(rect.bottom, viewportHeight);
		const visibleHeight = Math.max(0, visibleBottom - visibleTop);

		// Use fixed positioning relative to viewport
		modalOverlayElement.style.position = "fixed";
		modalOverlayElement.style.top = `${visibleTop}px`;
		modalOverlayElement.style.left = `${rect.left}px`;
		modalOverlayElement.style.width = `${rect.width}px`;
		modalOverlayElement.style.height = `${visibleHeight}px`;

		// Match border radius if possible, or use a default
		const style = window.getComputedStyle(postContainer);
		modalOverlayElement.style.borderRadius = style.borderRadius;

		// Adjust border radius if clipped
		if (rect.top < 0) {
			modalOverlayElement.style.borderTopLeftRadius = "0";
			modalOverlayElement.style.borderTopRightRadius = "0";
		}
		if (rect.bottom > viewportHeight) {
			modalOverlayElement.style.borderBottomLeftRadius = "0";
			modalOverlayElement.style.borderBottomRightRadius = "0";
		}

		// Reset padding vars as we are now constraining the container itself
		modalOverlayElement.style.removeProperty("--series-modal-padding-top");
		modalOverlayElement.style.removeProperty("--series-modal-padding-bottom");

		// Apply vertical offset to shift content up slightly
		const VERTICAL_OFFSET = 120;
		modalOverlayElement.style.paddingBottom = `${MODAL_PADDING + VERTICAL_OFFSET}px`;
		modalOverlayElement.style.paddingTop = `${MODAL_PADDING}px`;

		// Center content within the constrained overlay
		modalOverlayElement.style.alignItems = "center";
		modalOverlayElement.style.justifyContent = "center";

		// Max height for content should fit within the visible area, accounting for offset
		const maxHeight = visibleHeight - MODAL_PADDING * 2 - VERTICAL_OFFSET;
		modalContentElement.style.maxHeight = `${Math.max(200, maxHeight)}px`;
	} else {
		// Fallback to viewport positioning if no container found
		const scrollContainer = getScrollableAncestor(widgetContainerElement);
		const viewportHeight = window.innerHeight;
		const rect =
			scrollContainer === document.documentElement
				? { top: 0, bottom: viewportHeight }
				: scrollContainer.getBoundingClientRect();
		const containerTop = rect.top;
		const containerBottom = rect.bottom;
		const topPadding =
			containerTop < MODAL_PADDING
				? MODAL_PADDING - containerTop
				: MODAL_PADDING;
		const bottomPadding =
			containerBottom > viewportHeight - MODAL_PADDING
				? Math.max(
						MODAL_PADDING,
						containerBottom - (viewportHeight - MODAL_PADDING),
					)
				: MODAL_PADDING;
		const appliedTop = Math.max(topPadding, MODAL_PADDING);
		const appliedBottom = Math.max(bottomPadding, MODAL_PADDING);
		modalOverlayElement.style.setProperty(
			"--series-modal-padding-top",
			`${appliedTop + 105}px`,
		);
		modalOverlayElement.style.setProperty(
			"--series-modal-padding-bottom",
			`${appliedBottom}px`,
		);
		const containerHeight = containerBottom - containerTop;
		const visibleHeight = Math.min(
			viewportHeight - MODAL_PADDING * 2,
			containerHeight - appliedTop - appliedBottom,
		);
		const maxHeight = Math.max(280, visibleHeight);
		modalContentElement.style.maxHeight = `${Math.floor(maxHeight)}px`;
	}
	attachModalListeners();
}

function resetModalMeasurements() {
	detachModalListeners();
	if (measurementRaf) {
		cancelAnimationFrame(measurementRaf);
		measurementRaf = null;
	}
	modalOverlayElement?.style.removeProperty("--series-modal-padding-top");
	modalOverlayElement?.style.removeProperty("--series-modal-padding-bottom");
	modalOverlayElement?.style.removeProperty("padding-top");
	modalOverlayElement?.style.removeProperty("padding-bottom");
	modalOverlayElement?.style.removeProperty("top");
	modalOverlayElement?.style.removeProperty("left");
	modalOverlayElement?.style.removeProperty("width");
	modalOverlayElement?.style.removeProperty("height");
	modalOverlayElement?.style.removeProperty("position");
	modalOverlayElement?.style.removeProperty("border-radius");
	modalContentElement?.style.removeProperty("maxHeight");
}
function portal(node: HTMLElement) {
	let target = document.body;
	target.appendChild(node);
	return {
		destroy() {
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		},
	};
}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="series-widget-container mb-8" bind:this={widgetContainerElement}>
	<div class="widget-wrapper">
		<!-- Stacked Cards Widget -->
		<button
			class="series-widget"
			class:hovered={isHovered && !isClicked && !isAnimating}
			class:loaded={isLoaded && !isClicked}
			class:clicked={isClicked}
			disabled={isAnimating || showModal}
			on:click={openModal}
			on:mouseenter={() => !isClicked && !isAnimating && !showModal && (isHovered = true)}
			on:mouseleave={() => (isHovered = false)}
			aria-label="View series progress"
		>
			<!-- Main Card (Front) -->
			<div class="card main-card">
				<span class="fraction">{currentPart}/{totalParts}</span>
			</div>

			<!-- Card 2 (Behind) -->
			<div class="card back-card card-2"></div>

			<!-- Card 3 (Behind) -->
			<div class="card back-card card-3"></div>
		</button>

		<!-- Series label -->
		<div class="series-label">
			<button type="button" class="series-text link-lg" on:click={openModal}>Series</button>
			<span class="series-name text-75">{seriesName}</span>
		</div>
	</div>
</div>

<!-- Modal -->

{#if showModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="series-modal-overlay" use:portal bind:this={modalOverlayElement} transition:fade={{ duration: 100 }} on:outroend={onModalOutroEnd}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="modal-content" bind:this={modalContentElement} transition:scale={{ duration: 100, start: 0.70 }}>
			<button class="close-btn btn-plain" on:click={closeModal} aria-label="Close modal">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
			</button>

			<div class="modal-body">
				<!-- Reuse SeriesPanel component with filtered series -->
				<SeriesPanel 
					sortedPosts={allSeriesPosts}
					filterSeriesName={seriesName}
					hideDate={true}
					hideTags={true}
					currentPartNumber={currentPart}
					onPostClick={handlePostClick}
				/>
		</div>
	</div>
</div>
{/if}

<style>
	.series-widget-container {
		display: flex;
		justify-content: flex-start;
		margin-bottom: 2rem;
	}

	.widget-wrapper {
		display: flex;
		align-items: center;
		gap: 2.8rem; /* More space between widget and text */
	}

	.series-widget {
		position: relative;
		width: 110px; /* Smaller */
		height: 70px; /* Smaller */
		cursor: pointer;
		border: none;
		background: transparent;
		padding: 0;
		display: flex;
		align-items: center;
		transition: transform 0.5s ease; /* Slow hover zoom */
	}

	.series-widget:disabled {
		cursor: default;
		pointer-events: auto;
	}

	/* Remove click/active animation */
	.series-widget:active:not(:disabled) {
		transform: none;
	}

	/* Slow hover zoom */
	.series-widget:hover:not(:disabled) {
		transform: scale(1.05);
	}

	.card {
		position: absolute;
		border-radius: 9px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0px 10px rgba(0, 0, 0, 0.4); /* Deeper shadow */
		transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.main-card {
		width: 95px;
		height: 70px;
		background: var(--primary);
		z-index: 3;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
	}

	.fraction {
		font-family: var(--series-widget-font, 'Iosevka', ui-monospace, 'Iosevka Web', 'SFMono-Regular', Menlo, Monaco, Consolas, 'Lucida Console', 'Courier New', monospace);
		font-size: 2.2rem; /* Smaller */
		font-weight: bold;
		color: #1a1a1a;
	}

	.back-card {
		background: var(--primary);
		opacity: 1; /* Solid, not transparent */
	}

	/* All cards vertically centered, progressively smaller with MORE spacing */
	.card-2 {
		width: 84px; /* 91% of main */
		height: 62px; /* 91% of main */
		z-index: 2;
		left: 0;
		top: 50%;
		transform: translateY(-50%) translateX(0);
	}

	.card-3 {
		width: 74px; /* 82% of main */
		height: 50px; /* 82% of main */
		z-index: 1;
		left: 0;
		top: 50%;
		transform: translateY(-50%) translateX(0);
	}

	/* Animation on load - slide out with MORE spacing */
	.series-widget.loaded .card-2 {
		transform: translateY(-50%) translateX(20px); /* More space */
	}

	.series-widget.loaded .card-3 {
		transform: translateY(-50%) translateX(38px); /* More space */
	}

	/* Clicked state - cards tuck in and stay tucked */
	.series-widget.clicked .card-2,
	.series-widget.clicked .card-3 {
		transform: translateY(-50%) translateX(0) !important;
		opacity: 0;
	}

	/* Hover effect - cards hide (only when not clicked) */
	.series-widget.hovered .card-2,
	.series-widget.hovered .card-3 {
		transform: translateY(-50%) translateX(0) !important;
		opacity: 0;
	}

	/* Series label */
	.series-label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-family: var(--post-body-font);
	}

	.series-text {
		font-size: 1.2rem; /* Bigger text */
		font-weight: 800; /* Bold */
		color: var(--primary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		background: none;
		border: none;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
	}

	:global(.series-link) {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.35rem 0.55rem;
		margin: 0;
		border-radius: 0.65rem;
		transition: color 0.2s ease, transform 0.2s ease;
	}

	:global(.series-link)::before {
		content: "";
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background-color: color-mix(in srgb, var(--btn-plain-bg-hover) 80%, transparent);
		transform: scale(0.88);
		opacity: 0;
		transition: transform 0.2s ease, opacity 0.2s ease, background-color 0.2s ease;
		z-index: -1;
	}

	:global(.series-link:hover)::before,
	:global(.series-link:focus-visible)::before {
		transform: scale(1);
		opacity: 1;
		background-color: color-mix(in srgb, var(--btn-plain-bg-hover) 65%, var(--primary) 35%);
	}

	:global(.series-link:active)::before {
		transform: scale(0.94);
	}

	.series-text:focus-visible {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}

	.series-name {
		font-size: 1rem; /* Smaller text */
		font-weight: 400;
	}

	/* Modal Styles - Full viewport coverage */
	/* Use :global to ensure modal escapes component scope and any parent constraints */
	:global(.series-modal-overlay) {
		/* Position fixed relative to viewport, not container */
		position: fixed;
		inset: 0; /* top: 0; right: 0; bottom: 0; left: 0; */

		/* Ensure it's above everything including headers/navbars */
		z-index: 99999;

		/* Dark backdrop */
		background: rgba(0, 0, 0, 0.5);

		/* Flex for centering modal content */
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: var(--series-modal-padding-top, 1.5rem) 1rem var(--series-modal-padding-bottom, 1.5rem) 1rem;

		/* Allow scrolling if content is tall */
		overflow-y: auto;

    	backdrop-filter: blur(6px); /* Adjust blur intensity (e.g., 5px) as needed */
    	-webkit-backdrop-filter: blur(6px); /* Safari support */

		/* Rounded corners to match container aesthetic */
		border-radius: var(--radius-large);
	}

	.modal-content {
		background: var(--card-bg);
		border-radius: var(--radius-large);
		max-width: 600px; /* Narrower */
		width: 100%;
		max-height: 85vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		/* NO ANIMATION - causes flicker */
		position: relative;
		z-index: 10000;

    outline: 1px solid color-mix(in srgb, var(--card-bg) 93%, white); /* Lightened outline based on --card-bg */
	}

	.close-btn {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 9999px;
		cursor: pointer;
	}

	.close-btn svg {
		width: 24px;
		height: 24px;
		stroke: currentColor; /* Use currentColor to inherit from parent */
		stroke-width: 2;
	}

	.modal-body {
		padding: 2rem 1.5rem 1.5rem 1.5rem; /* Leave room for floating close button */
		overflow-y: auto;
		flex: 1;
	}

	/* Remove extra padding from SeriesPanel when in modal */
	.modal-body :global(.card-base) {
		padding: 0 !important;
		background: transparent !important;
		box-shadow: none !important;
	}

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		:global(.series-modal-overlay) {
			padding: var(--series-modal-padding-top, 1.5rem) 0.75rem var(--series-modal-padding-bottom, 1.5rem) 0.75rem;
		}

		.modal-content {
			max-width: 100%;
			max-height: 90vh;
		}

		.modal-body {
			padding: 2rem 1rem 1rem 1rem;
		}

		.widget-wrapper {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}
	}
</style>
