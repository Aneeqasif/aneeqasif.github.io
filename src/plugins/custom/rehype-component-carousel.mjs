/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * CUSTOM COMPONENT: Creates an Image Carousel rehype component.
 * Safe for upstream merges - doesn't modify theme core
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.images - JSON stringified array of {src, alt} objects.
 * @param {string} [properties.autoplay='false'] - Whether to autoplay.
 * @param {string} [properties.interval='4000'] - Autoplay interval in ms.
 * @param {string} [properties.ref=''] - Reference image index (1-based) for dimensions.
 * @param {string} [properties.scale='1'] - Scale factor (0 to 1) for the carousel.
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created Carousel component.
 */
export function CarouselComponent(properties, children) {
	const imagesJson = properties.images || "[]";
	const autoplay = properties.autoplay === "true";
	const interval = properties.interval || "4000";
	const ref = properties.ref || "";
	const scale = properties.scale || "1";

	let images = [];
	try {
		images = JSON.parse(imagesJson);
	} catch (e) {
		return h("div", { class: "hidden" }, [
			"Invalid directive. Carousel requires valid images.",
		]);
	}

	if (images.length === 0) {
		return h("div", { class: "hidden" }, [
			"Invalid directive. Carousel requires at least one image.",
		]);
	}

	const carouselId = `carousel-${Math.random().toString(36).substr(2, 9)}`;
	const totalImages = images.length;

	// Create slides
	const slides = images.map((img, index) => {
		return h(
			"div",
			{
				class: "carousel-slide",
				"data-index": index,
			},
			[
				h("img", {
					src: img.src,
					alt: img.alt || `Slide ${index + 1}`,
					loading: index === 0 ? "eager" : "lazy",
					decoding: "async",
				}),
			],
		);
	});

	// Create navigation arrows
	const prevButton = h(
		"button",
		{
			class: "carousel-nav carousel-prev",
			type: "button",
			"aria-label": "Previous slide",
			"data-carousel-prev": "",
		},
		[
			h("span", { class: "arrow-wrapper" }, [
				h(
					"svg",
					{
						width: "24",
						height: "24",
						viewBox: "0 0 24 24",
						fill: "currentColor",
					},
					[
						h("path", {
							d: "m10.8 12l3.9 3.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-4.6-4.6q-.15-.15-.212-.325T8.425 12t.063-.375t.212-.325l4.6-4.6q.275-.275.7-.275t.7.275t.275.7t-.275.7z",
						}),
					],
				),
			]),
		],
	);

	const nextButton = h(
		"button",
		{
			class: "carousel-nav carousel-next",
			type: "button",
			"aria-label": "Next slide",
			"data-carousel-next": "",
		},
		[
			h("span", { class: "arrow-wrapper" }, [
				h(
					"svg",
					{
						width: "24",
						height: "24",
						viewBox: "0 0 24 24",
						fill: "currentColor",
					},
					[
						h("path", {
							d: "M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z",
						}),
					],
				),
			]),
		],
	);

	// Create slides container
	const slidesContainer = h("div", { class: "carousel-slides" }, slides);

	// Create caption element
	const caption = h(
		"div",
		{
			class: "carousel-caption",
			"aria-live": "polite",
		},
		[images[0].alt || ""],
	);

	// Create counter
	const counter = h(
		"div",
		{
			class: "carousel-counter",
			"aria-live": "polite",
		},
		[
			h("span", { class: "carousel-current" }, ["1"]),
			h("span", { class: "carousel-separator" }, [" / "]),
			h("span", { class: "carousel-total" }, [String(totalImages)]),
		],
	);

	// Build data attributes and styles
	const dataAttrs = {
		class: "carousel",
		"data-carousel-id": carouselId,
		"data-autoplay": autoplay.toString(),
		"data-interval": interval,
		"data-total": totalImages.toString(),
		role: "region",
		"aria-roledescription": "carousel",
		"aria-label": "Image carousel",
	};

	// Apply scale via CSS custom property
	if (scale && scale !== "1") {
		dataAttrs.style = `--carousel-scale: ${scale};`;
	}

	// Add ref if specified
	if (ref) {
		dataAttrs["data-ref"] = ref;
	}

	// Create main carousel container
	return h("div", dataAttrs, [
		h("div", { class: "carousel-viewport" }, [
			slidesContainer,
			prevButton,
			nextButton,
			counter,
		]),
		caption,
	]);
}
