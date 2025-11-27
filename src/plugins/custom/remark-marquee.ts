/**
 * CUSTOM PLUGIN: Remark directive for marquee/badge strip
 * Safe for upstream merges - doesn't modify theme core
 *
 * Usage in Markdown:
 * :::marquee{speed="30" height="60px"}
 * /badges/badge1.png :: https://example.com
 * /badges/badge2.png :: https://example.com
 * /badges/badge3.png
 * :::
 *
 * Format per line: src :: href
 * - src: image path (required)
 * - href: link URL (optional)
 *
 * Attributes:
 * - speed: pixels per second (default: 30)
 * - height: strip height (default: 60px)
 * - gap: space between items (default: 2rem)
 * - direction: "left" or "right" (default: left)
 * - pauseOnHover: pause animation on hover (default: true)
 */

import type { Root } from "mdast";
import { visit } from "unist-util-visit";

interface MarqueeItem {
  src: string;
  href: string;
}

/**
 * Parse a line like: /path/to/image.png :: https://example.com
 * Or just: /path/to/image.png
 */
function parseMarqueeItem(line: string): MarqueeItem | null {
  const trimmed = line.trim();

  // Skip empty lines
  if (!trimmed) {
    return null;
  }

  // Must look like an image path (starts with / or . or contains image extension)
  const looksLikePath =
    trimmed.startsWith("/") ||
    trimmed.startsWith("./") ||
    /\.(png|jpg|jpeg|gif|svg|webp)/i.test(trimmed);

  if (!looksLikePath) {
    return null;
  }

  // Split by double-colon separator
  const separatorIndex = trimmed.indexOf("::");

  let src: string;
  let href: string;

  if (separatorIndex === -1) {
    // No separator, just src
    src = trimmed;
    href = "";
  } else {
    src = trimmed.substring(0, separatorIndex).trim();
    href = trimmed.substring(separatorIndex + 2).trim();
  }

  // Validate src
  if (!src) {
    return null;
  }

  return { src, href };
}

/**
 * Recursively collect all text and links from a node tree.
 * Returns an array of strings, preserving the order of text and URLs.
 * This handles the case where markdown auto-links URLs, splitting a line like:
 *   "/path/to/image.png :: https://example.com"
 * into separate text and link nodes.
 */
function collectAllText(node: any): string[] {
  const texts: string[] = [];

  function walk(n: any) {
    // Handle auto-linked URLs - the markdown parser converts URLs to link nodes
    if (n.type === "link" && n.url) {
      texts.push(n.url);
      return; // Don't recurse into children, we've captured the URL
    }

    if (n.type === "text" && n.value) {
      texts.push(n.value);
    }
    if (n.children && Array.isArray(n.children)) {
      for (const child of n.children) {
        walk(child);
      }
    }
  }

  walk(node);
  return texts;
}

/**
 * Reconstruct lines from collected text fragments.
 * Handles the case where URLs are auto-linked and become separate items.
 *
 * Input: ['/path/image.png :: ', 'https://example.com', '\n/path2.png']
 * Output: ['/path/image.png :: https://example.com', '/path2.png']
 */
function reconstructLines(textFragments: string[]): string[] {
  // Join all fragments to get the full content, preserving exact structure
  const fullContent = textFragments.join("");

  // Split by newlines to get individual lines
  return fullContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);
}

export function remarkMarquee() {
  return (tree: Root) => {
    visit(tree, (node: any) => {
      if (node.type !== "containerDirective") return;
      if (node.name !== "marquee") return;

      // Collect all text content from the directive
      const allTexts = collectAllText(node);

      // Reconstruct lines, handling auto-linked URLs
      const lines = reconstructLines(allTexts);

      // Parse each line for marquee items
      const items: MarqueeItem[] = [];
      for (const line of lines) {
        const item = parseMarqueeItem(line);
        if (item) {
          items.push(item);
        }
      }

      // Get optional attributes with defaults
      const speed = node.attributes?.speed || "30";
      const height = node.attributes?.height || "60px";
      const gap = node.attributes?.gap || "2rem";
      const direction = node.attributes?.direction || "left";
      const pauseOnHover =
        node.attributes?.pauseOnHover !== "false" &&
        node.attributes?.pauseOnHover !== false;

      if (!node.data) {
        node.data = {};
      }

      // Transform to our custom component
      node.data.hName = "Marquee";
      node.data.hProperties = {
        items: JSON.stringify(items),
        speed: speed,
        height: height,
        gap: gap,
        direction: direction,
        pauseOnHover: pauseOnHover.toString(),
      };

      // Clear children since we've extracted the data
      node.children = [];
    });
  };
}
