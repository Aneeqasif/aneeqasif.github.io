/**
 * CUSTOM PLUGIN: Remark directive for image carousel
 * Safe for upstream merges - doesn't modify theme core
 *
 * Usage in Markdown:
 * :::carousel
 * ![Mountains](a.jpg)
 * ![Ocean](b.jpg)
 * ![Forest](c.jpg)
 * :::
 *
 * With autoplay option:
 * :::carousel{autoplay}
 * ![Mountains](a.jpg)
 * ![Ocean](b.jpg)
 * :::
 *
 * With interval (in ms):
 * :::carousel{autoplay interval="5000"}
 * ![Mountains](a.jpg)
 * ![Ocean](b.jpg)
 * :::
 *
 * With reference image for dimensions (1-based index):
 * :::carousel{ref="2"}
 * ![Small](a.jpg)
 * ![Large](b.jpg)  <!-- This image's dimensions will be used -->
 * ![Medium](c.jpg)
 * :::
 *
 * With scale factor (0 to 1):
 * :::carousel{scale="0.75"}
 * ![Mountains](a.jpg)
 * ![Ocean](b.jpg)
 * :::
 */

import type { Root } from "mdast";
import { visit } from "unist-util-visit";

interface CarouselImage {
  src: string;
  alt: string;
}

export function remarkCarousel() {
  return (tree: Root) => {
    visit(tree, (node: any) => {
      if (node.type !== "containerDirective") return;
      if (node.name !== "carousel") return;

      // Extract images from child nodes
      const images: CarouselImage[] = [];

      visit(node, "image", (imageNode: any) => {
        images.push({
          src: imageNode.url || "",
          alt: imageNode.alt || "",
        });
      });

      // Get optional attributes
      const autoplay =
        node.attributes?.autoplay !== undefined ||
        node.attributes?.autoplay === "" ||
        node.attributes?.autoplay === "true";
      const interval = node.attributes?.interval || "4000";
      const ref = node.attributes?.ref || "";
      const scale = node.attributes?.scale || "1";

      if (!node.data) {
        node.data = {};
      }

      // Transform to our custom component
      node.data.hName = "Carousel";
      node.data.hProperties = {
        images: JSON.stringify(images),
        autoplay: autoplay.toString(),
        interval: interval,
        ref: ref,
        scale: scale,
      };

      // Clear children since we've extracted the data
      node.children = [];
    });
  };
}
