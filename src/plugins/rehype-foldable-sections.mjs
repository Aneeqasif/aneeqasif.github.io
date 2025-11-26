import { visit } from "unist-util-visit";

/**
 * Rehype plugin to make sections foldable based on heading tags.
 * Requires remark-sectionize to have run previously (creating <section> wrappers).
 *
 * Looks for sections where the first child is a heading (h1-h6)
 * containing a span with class "tag" and tag-name "Fold" or "folded".
 */
export function rehypeFoldableSections() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      // We only care about <section> elements
      if (node.tagName !== "section") return;

      // Check if the section has children
      if (!node.children || node.children.length === 0) return;

      // The first element child should be the heading
      const firstChild = node.children.find(
        (child) => child.type === "element"
      );
      if (
        !firstChild ||
        !["h1", "h2", "h3", "h4", "h5", "h6"].includes(firstChild.tagName)
      ) {
        return;
      }

      // Check for the specific tags in the heading
      let isFoldable = false;
      let defaultOpen = false;

      // Helper to find the tag span
      // We need to check both 'element' nodes (if parsed) and 'raw' nodes (if passed as HTML)
      visit(firstChild, (childNode) => {
        if (isFoldable) return; // Stop if already found

        if (
          childNode.type === "element" &&
          childNode.tagName === "span" &&
          childNode.properties &&
          childNode.properties.className &&
          Array.isArray(childNode.properties.className) &&
          childNode.properties.className.includes("tag")
        ) {
          const tagName =
            childNode.properties["tagName"] || childNode.properties["tag-name"];

          if (typeof tagName === "string") {
            const lowerTag = tagName.toLowerCase();
            if (lowerTag === "fold") {
              isFoldable = true;
              defaultOpen = true; // "Fold" -> initially expanded
            } else if (lowerTag === "folded") {
              isFoldable = true;
              defaultOpen = false; // "folded" -> initially collapsed
            }
          }
        } else if (childNode.type === "raw") {
          // Check for raw HTML string: <span class="tag" tag-name="Fold">
          // We use a regex to be robust against spacing
          const match = childNode.value.match(
            /<span[^>]*class="[^"]*tag[^"]*"[^>]*tag-name="([^"]+)"/i
          );
          if (match) {
            const tagName = match[1];
            const lowerTag = tagName.toLowerCase();
            if (lowerTag === "fold") {
              isFoldable = true;
              defaultOpen = true;
            } else if (lowerTag === "folded") {
              isFoldable = true;
              defaultOpen = false;
            }
          }
        }
      });

      if (isFoldable) {
        // Transform <section> to <details>
        node.tagName = "details";
        node.properties = node.properties || {};
        node.properties.className = node.properties.className || [];
        node.properties.className.push("foldable-section");

        if (defaultOpen) {
          node.properties.open = true;
        }

        // Wrap the heading in <summary>
        const headingIndex = node.children.indexOf(firstChild);

        // Span for material-symbols:chevron-right-rounded (handled via CSS)
        const iconNode = {
          type: "element",
          tagName: "span",
          properties: {
            class: ["foldable-icon"],
          },
          children: [],
        };

        // Find the anchor element within the heading (if it exists)
        let anchorIndex = -1;
        if (firstChild.children) {
          anchorIndex = firstChild.children.findIndex(
            (child) =>
              child.type === "element" &&
              child.tagName === "a" &&
              child.properties?.className?.includes("anchor")
          );
        }

        // Insert icon before the anchor (or at the end if no anchor)
        if (anchorIndex !== -1) {
          firstChild.children.splice(anchorIndex, 0, iconNode);
        } else if (firstChild.children) {
          firstChild.children.push(iconNode);
        }

        const summaryNode = {
          type: "element",
          tagName: "summary",
          properties: {
            className: ["foldable-summary"],
          },
          children: [firstChild],
        };

        node.children[headingIndex] = summaryNode;

        // Create collapse button with icon only (styled via CSS)
        const collapseButtonIcon = {
          type: "element",
          tagName: "span",
          properties: {
            className: ["foldable-collapse-btn__icon"],
          },
          children: [],
        };

        const collapseButton = {
          type: "element",
          tagName: "button",
          properties: {
            type: "button",
            className: ["foldable-collapse-btn"],
            ariaLabel: "Collapse this section",
            title: "Collapse section",
          },
          children: [collapseButtonIcon],
        };

        // Add the collapse button at the end of the section content
        node.children.push(collapseButton);
      }
    });
  };
}
