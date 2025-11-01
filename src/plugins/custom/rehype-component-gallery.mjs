/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * CUSTOM COMPONENT: Creates an Image Gallery rehype component.
 * Safe for upstream merges - doesn't modify theme core
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.images - Comma-separated list of image paths.
 * @param {string} [properties.columns='3'] - Number of columns.
 * @param {string} [properties.gap='1rem'] - Gap between images.
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created Image Gallery component.
 */
export function ImageGalleryComponent(properties, children) {
	const images = properties.images || "";
	const columns = properties.columns || "3";
	const gap = properties.gap || "1rem";

	if (!images) {
		return h("div", { class: "hidden" }, [
			"Invalid directive. Image gallery requires images.",
		]);
	}

	const imageList = images
		.split(",")
		.map((img) => img.trim())
		.filter(Boolean);
	const galleryId = `gallery-${Math.random().toString(36).substr(2, 9)}`;

	// Create gallery container
	const galleryItems = imageList.map((src, index) => {
		return h("div", { class: "gallery-item", "data-index": index }, [
			h("img", {
				src: src,
				alt: `Gallery image ${index + 1}`,
				loading: "lazy",
				decoding: "async",
			}),
		]);
	});

	return h(
		"div",
		{
			class: "image-gallery",
			"data-gallery-id": galleryId,
			style: `--gallery-columns: ${columns}; --gallery-gap: ${gap};`,
		},
		galleryItems,
	);
}
