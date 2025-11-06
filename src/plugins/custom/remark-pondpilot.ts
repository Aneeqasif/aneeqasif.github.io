/**
 * Remark plugin for PondPilot interactive SQL widgets
 *
 * Transforms SQL code blocks with {pw} flag into PondPilot widgets.
 * All widgets share a single global DuckDB instance.
 *
 * Example usage:
 *   ```sql {pw}
 *   SELECT 'Hello' as greeting;
 *   ```
 *
 *   ```sql {pw theme="dark" editable=false}
 *   SELECT * FROM 'data.parquet' LIMIT 10;
 *   ```
 */

import type { Code } from "mdast";
import { visit } from "unist-util-visit";

interface PondPilotParams {
	[key: string]: string | boolean | undefined;
}

/**
 * Parse {pw ...} meta string into structured parameters
 * Example: {pw theme="dark" editable=false}
 * Returns: { theme: "dark", editable: false }
 */
function parsePondPilotMeta(meta: string): PondPilotParams | null {
	if (!meta) return null;

	// Match {pw ...} pattern
	const pwMatch = meta.match(/\{pw\s+([^}]*)\}/);
	if (!pwMatch) {
		// Also check for just {pw} without parameters
		if (meta.trim() === "{pw}") {
			return {};
		}
		return null;
	}

	const paramsString = pwMatch[1].trim();
	if (!paramsString) return {};

	const params: PondPilotParams = {};

	// Parse key="value" or key='value' or key=value patterns
	// Supports both double and single quotes, including JSON arrays
	const paramRegex = /(\S+?)=(?:"([^"]*)"|'([^']*)'|(\S+))/g;
	let match: RegExpExecArray | null;

	while ((match = paramRegex.exec(paramsString)) !== null) {
		const key = match[1];
		const doubleQuotedValue = match[2];
		const singleQuotedValue = match[3];
		const unquotedValue = match[4];
		const value = doubleQuotedValue ?? singleQuotedValue ?? unquotedValue;

		// Convert string booleans to actual booleans
		if (value === "true") {
			params[key] = true;
		} else if (value === "false") {
			params[key] = false;
		} else {
			params[key] = value;
		}
	}

	return params;
}

/**
 * Convert parameters to attributes for PondPilot (no conversion, pass as-is)
 */
function paramsToDataAttributes(
	params: PondPilotParams,
): Record<string, string> {
	const dataAttrs: Record<string, string> = {};

	for (const [key, value] of Object.entries(params)) {
		if (value === undefined) continue;

		// Pass all attributes as-is, no conversion
		dataAttrs[key] = String(value);
	}

	return dataAttrs;
}

/**
 * Remark plugin to transform SQL code blocks with {pw} into PondPilot widgets
 */
export function remarkPondPilot() {
	// biome-ignore lint/suspicious/noExplicitAny: Remark tree type
	return (tree: any) => {
		visit(tree, "code", (node: Code, index, parent) => {
			// Only process SQL code blocks
			if (node.lang !== "sql" && node.lang !== "SQL") {
				return;
			}

			// Check if meta contains {pw}
			const params = parsePondPilotMeta(node.meta || "");
			if (!params) {
				return;
			}

			// Convert to HTML node with PondPilot attributes
			const dataAttrs = paramsToDataAttributes(params);

			// Build data attributes string with proper escaping
			const dataAttrString = Object.entries(dataAttrs)
				.map(([key, value]) => {
					// Escape quotes in attribute values
					const escapedValue = String(value)
						.replace(/&/g, "&amp;")
						.replace(/"/g, "&quot;")
						.replace(/'/g, "&#039;");
					return `${key}="${escapedValue}"`;
				})
				.join(" ");

			// Create wrapper with PondPilot class and attributes
			const html = `<div class="pondpilot-widget-wrapper">
  <pre class="pondpilot-snippet" ${dataAttrString}>${escapeHtml(node.value)}</pre>
</div>`;

			// Replace the code node with HTML
			const htmlNode = {
				type: "html",
				value: html,
			};

			if (parent && typeof index === "number") {
				parent.children[index] = htmlNode as unknown as Code;
			}
		});
	};
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}
