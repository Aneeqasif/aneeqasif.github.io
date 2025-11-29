/**
 * CUSTOM PLUGIN: Remark directive for enhanced figure/image handling
 * Safe for upstream merges - doesn't modify theme core
 *
 * Usage in Markdown:
 *
 * Basic with caption (alt text becomes caption):
 * :::figure{width="80%"}
 * ![This becomes the caption](/posts/photo.jpg)
 * :::
 *
 * Height-based sizing:
 * :::figure{height="300px"}
 * ![Caption](/posts/photo.jpg)
 * :::
 *
 * Float right/left:
 * :::figure{width="50%" float="right"}
 * ![Sunset](/posts/sunset.jpg)
 * :::
 *
 * Blur effect (reveals on hover):
 * :::figure{.blur}
 * ![Spoiler image](/posts/spoiler.jpg)
 * :::
 *
 * Hue rotation (adapts to page theme):
 * :::figure{.hue}
 * ![Diagram](/posts/diagram.jpg)
 * :::
 *
 * Grid layout for multiple images:
 * :::figure{grid=3}
 * ![Image 1](/posts/a.jpg)
 * ![Image 2](/posts/b.jpg)
 * ![Image 3](/posts/c.jpg)
 * :::
 */

import { visit } from "unist-util-visit";

interface ImageData {
  src: string;
  alt: string;
}

/**
 * Extract image nodes from the directive's children
 */
function extractImages(node: any): ImageData[] {
  const images: ImageData[] = [];

  visit(node, "image", (imgNode: any) => {
    images.push({
      src: imgNode.url || "",
      alt: imgNode.alt || "",
    });
  });

  return images;
}

/**
 * Extract text content that's not part of an image (for explicit captions)
 */
function extractTextContent(node: any): string {
  let text = "";

  visit(node, "text", (textNode: any) => {
    text += textNode.value;
  });

  return text.trim();
}

export function remarkFigure() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type !== "containerDirective") return;
      if (node.name !== "figure") return;

      const attrs = node.attributes || {};
      const images = extractImages(node);

      if (images.length === 0) {
        // No images found, skip
        return;
      }

      // Extract attributes
      const width = attrs.width || "";
      const height = attrs.height || "";
      const float = attrs.float || "";
      const grid = attrs.grid || "";

      // Extract classes (from .classname shortcut syntax)
      const classes = attrs.class ? attrs.class.split(" ") : [];
      const hasBlur = classes.includes("blur");
      const hasHue = classes.includes("hue");
      const hasShadow = classes.includes("shadow");

      // For single image, use alt as caption
      // For grid, each image can have its own caption from alt text
      const caption = images.length === 1 ? images[0].alt : "";

      // Prepare data for rehype component
      if (!node.data) {
        node.data = {};
      }

      node.data.hName = "Figure";
      node.data.hProperties = {
        images: JSON.stringify(images),
        width,
        height,
        float,
        grid,
        blur: hasBlur,
        hue: hasHue,
        shadow: hasShadow,
        caption,
        customClass: classes
          .filter((c: string) => c !== "blur" && c !== "hue" && c !== "shadow")
          .join(" "),
      };

      // Clear children - we've extracted what we need
      node.children = [];
    });
  };
}
