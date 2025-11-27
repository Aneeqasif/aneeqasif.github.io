/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * CUSTOM COMPONENT: Creates a Marquee/Badge Strip rehype component.
 * Safe for upstream merges - doesn't modify theme core
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.items - JSON stringified array of {src, href} objects.
 * @param {string} [properties.speed='30'] - Animation speed in pixels per second.
 * @param {string} [properties.height='60px'] - Height of the marquee strip.
 * @param {string} [properties.gap='2rem'] - Gap between items.
 * @param {string} [properties.direction='left'] - Direction: "left" or "right".
 * @param {string} [properties.pauseOnHover='true'] - Whether to pause on hover.
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created Marquee component.
 */
export function MarqueeComponent(properties, children) {
  const itemsJson = properties.items || "[]";
  const speed = properties.speed || "30";
  const height = properties.height || "60px";
  const gap = properties.gap || "2rem";
  const direction = properties.direction || "left";
  const pauseOnHover = properties.pauseOnHover !== "false";

  let items = [];
  try {
    items = JSON.parse(itemsJson);
  } catch (e) {
    return h("div", { class: "hidden" }, [
      "Invalid directive. Marquee requires valid items.",
    ]);
  }

  if (items.length === 0) {
    return h("div", { class: "hidden" }, [
      "Invalid directive. Marquee requires at least one item.",
    ]);
  }

  const marqueeId = `marquee-${Math.random().toString(36).substr(2, 9)}`;

  // Create a single marquee item
  const createItem = (item, index) => {
    const imgElement = h("img", {
      src: item.src,
      loading: "lazy",
      decoding: "async",
      "data-no-lightbox": "true",
    });

    // Wrap in anchor if href provided
    if (item.href) {
      return h(
        "a",
        {
          class: "marquee-item",
          href: item.href,
          target: "_blank",
          rel: "noopener noreferrer",
        },
        [imgElement]
      );
    }

    return h(
      "span",
      {
        class: "marquee-item",
      },
      [imgElement]
    );
  };

  // Create items - we'll duplicate in JS for proper seamless loop
  const trackContent = items.map((item, index) => createItem(item, index));

  // Create the track that moves
  const track = h(
    "div",
    {
      class: "marquee-track",
      "data-items": JSON.stringify(items),
    },
    trackContent
  );

  // Create main marquee container
  // Create main marquee container
  return h(
    "div",
    {
      class: "marquee",
      "data-marquee-id": marqueeId,
      "data-speed": speed,
      "data-direction": direction,
      "data-pause-on-hover": pauseOnHover.toString(),
      style: `--marquee-height: ${height}; --marquee-gap: ${gap};`,
    },
    [track]
  );
}
