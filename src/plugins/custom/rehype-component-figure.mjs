import { h } from "hastscript";

/**
 * CUSTOM COMPONENT: Enhanced Figure rehype component
 * Renders images with sizing, floating, blur, hue effects, shadow, and grid layouts
 *
 * Properties:
 * - images: JSON string of [{src, alt}] array
 * - width: CSS width value
 * - height: CSS height value
 * - float: "left" or "right"
 * - grid: number of columns for multi-image grid
 * - blur: boolean - blur until hover
 * - hue: boolean - invert + hue-rotate to match theme
 * - shadow: boolean - add drop shadow
 * - caption: string - figure caption (for single image)
 * - customClass: additional CSS classes
 */
export function FigureComponent(properties, children) {
  // Parse images from JSON string
  let images = [];
  try {
    images = JSON.parse(properties.images || "[]");
  } catch (e) {
    console.error("[FigureComponent] Failed to parse images:", e);
    return h("div", { class: "text-red-500" }, [
      "[Invalid figure: failed to parse images]",
    ]);
  }

  if (images.length === 0) {
    return h("div", { class: "hidden" }, ["[Empty figure]"]);
  }

  const width = properties.width || "";
  const height = properties.height || "";
  const float = properties.float || "";
  const grid = properties.grid || "";
  const hasBlur = properties.blur === true || properties.blur === "true";
  const hasHue = properties.hue === true || properties.hue === "true";
  const hasShadow = properties.shadow === true || properties.shadow === "true";
  const caption = properties.caption || "";
  const customClass = properties.customClass || "";

  // Build container classes
  const containerClasses = ["enhanced-figure"];

  if (float === "left") containerClasses.push("float-left");
  if (float === "right") containerClasses.push("float-right");
  if (hasBlur) containerClasses.push("blur-effect");
  if (hasHue) containerClasses.push("hue-effect");
  if (hasShadow) containerClasses.push("shadow-effect");
  if (grid) containerClasses.push("grid-layout");
  if (customClass) containerClasses.push(customClass);

  // Build inline styles for dimensions
  const styles = [];
  if (width) styles.push(`--figure-width: ${width}`);
  if (height) styles.push(`--figure-height: ${height}`);
  if (grid) styles.push(`--figure-grid-cols: ${grid}`);

  // Create image elements (with individual captions for grid)
  const imageElements = images.map((img, index) => {
    const imgProps = {
      src: img.src,
      alt: img.alt || "",
      loading: "lazy",
      decoding: "async",
      class: "enhanced-figure__img",
    };

    const wrapperChildren = [h("img", imgProps)];

    // For grid layout, add individual caption under each image if alt exists
    if (grid && img.alt) {
      wrapperChildren.push(
        h("figcaption", { class: "enhanced-figure__grid-caption" }, img.alt)
      );
    }

    return h("div", { class: "enhanced-figure__img-wrapper" }, wrapperChildren);
  });

  // Build the figure content
  const figureContent = [];

  // For grid layout, wrap images in a grid container
  if (grid && images.length > 1) {
    figureContent.push(
      h("div", { class: "enhanced-figure__grid" }, imageElements)
    );
  } else {
    // Single image or no grid - just add images directly
    figureContent.push(...imageElements);
  }

  // Add caption if present (for single image figures)
  if (caption && !grid) {
    figureContent.push(
      h("figcaption", { class: "enhanced-figure__caption" }, caption)
    );
  }

  // Return the figure element
  return h(
    "figure",
    {
      class: containerClasses.join(" "),
      style: styles.length > 0 ? styles.join("; ") : undefined,
    },
    figureContent
  );
}
