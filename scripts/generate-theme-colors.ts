#!/usr/bin/env node
/**
 * Build-time script to extract Shiki theme colors
 * Generates src/generated/theme-colors.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function extractThemeColors(
	themeName: string,
): Promise<Record<string, string>> {
	console.log(`[Theme] Extracting colors from Shiki theme: ${themeName}`);

	// Shiki v3 - create highlighter and extract colors by analyzing token output
	try {
		const { createHighlighter } = await import("shiki");
		const highlighter = await createHighlighter({
			themes: [themeName],
			langs: ["sql"],
		});

		console.log(`[Theme] Loaded theme: ${themeName}`);

		const colorMap: Record<string, string> = {};

		// Test with various SQL samples to extract colors
		// Use realistic SQL that matches what Expressive Code actually renders
		const samples: Record<string, string> = {
			// Use exact SQL from actual usage to get correct tokenization
			keywords: "SELECT FROM WHERE JOIN ORDER BY",
			// This will show identifiers colored properly
			realSQL: "SELECT o.order_id, o.customer FROM orders o",
			numbers: "SELECT 123, 45.67 FROM table",
			strings: "SELECT 'hello', \"world\" FROM table",
			comments: "-- This is a comment\nSELECT * FROM table",
			functions: "SELECT COUNT(*), SUM(amount) FROM table",
		};

		// Extract keyword color
		const keywordTokens = highlighter.codeToTokens(samples.keywords, {
			lang: "sql",
			theme: themeName,
		});
		for (const line of keywordTokens.tokens) {
			for (const token of line) {
				if (
					token.color &&
					["select", "from", "where"].includes(
						token.content.trim().toLowerCase(),
					)
				) {
					colorMap.syntaxKeyword = token.color;
					console.log(
						`  syntaxKeyword: ${colorMap.syntaxKeyword} (${token.content.trim()})`,
					);
					break;
				}
			}
			if (colorMap.syntaxKeyword) break;
		}

		// Extract identifier color from realistic SQL
		// Column/table names should get the blue color
		const realTokens = highlighter.codeToTokens(samples.realSQL, {
			lang: "sql",
			theme: themeName,
		});

		console.log("  [DEBUG] Token colors in real SQL:");
		for (const line of realTokens.tokens) {
			for (const token of line) {
				if (token.color) {
					console.log(`    "${token.content.trim()}" -> ${token.color}`);
					const content = token.content.trim().toLowerCase();
					// Look for column/table references (things with dots or actual identifiers)
					if (
						token.color !== colorMap.syntaxKeyword &&
						token.color !== "#E1E4E8" && // Skip plain white text
						!colorMap.syntaxIdentifier &&
						(content.includes("_") || /^[a-z]+$/.test(content))
					) {
						colorMap.syntaxIdentifier = token.color;
						console.log(
							`  syntaxIdentifier: ${colorMap.syntaxIdentifier} (${content})`,
						);
					}
				}
			}
		}

		// Extract number color (if different from identifier color)
		const numTokens = highlighter.codeToTokens(samples.numbers, {
			lang: "sql",
			theme: themeName,
		});
		for (const line of numTokens.tokens) {
			for (const token of line) {
				if (token.color && /^\d+/.test(token.content.trim())) {
					// Only set if different from identifier color (some themes use same color)
					if (token.color !== colorMap.syntaxIdentifier) {
						colorMap.syntaxNumber = token.color;
						console.log(
							`  syntaxNumber: ${colorMap.syntaxNumber} (${token.content.trim()})`,
						);
					} else {
						console.log(`  syntaxNumber: same as identifiers (${token.color})`);
					}
					break;
				}
			}
			if (colorMap.syntaxNumber || colorMap.syntaxIdentifier) break;
		}

		// Extract string color
		const stringTokens = highlighter.codeToTokens(samples.strings, {
			lang: "sql",
			theme: themeName,
		});
		for (const line of stringTokens.tokens) {
			for (const token of line) {
				if (token.color && /^['"]/.test(token.content.trim())) {
					colorMap.syntaxString = token.color;
					console.log(
						`  syntaxString: ${colorMap.syntaxString} (${token.content.trim()})`,
					);
					break;
				}
			}
			if (colorMap.syntaxString) break;
		}

		// Extract comment color
		const commentTokens = highlighter.codeToTokens(samples.comments, {
			lang: "sql",
			theme: themeName,
		});
		for (const line of commentTokens.tokens) {
			for (const token of line) {
				if (token.color && token.content.trim().startsWith("--")) {
					colorMap.syntaxComment = token.color;
					console.log(`  syntaxComment: ${colorMap.syntaxComment} (comment)`);
					break;
				}
			}
			if (colorMap.syntaxComment) break;
		}

		// Extract function/special color
		const funcTokens = highlighter.codeToTokens(samples.functions, {
			lang: "sql",
			theme: themeName,
		});
		for (const line of funcTokens.tokens) {
			for (const token of line) {
				const content = token.content.trim().toLowerCase();
				if (token.color && ["count", "sum", "avg"].includes(content)) {
					if (token.color !== colorMap.syntaxKeyword) {
						colorMap.syntaxSpecial = token.color;
						console.log(
							`  syntaxSpecial: ${colorMap.syntaxSpecial} (${content})`,
						);
						break;
					}
				}
			}
			if (colorMap.syntaxSpecial) break;
		}

		return colorMap;
	} catch (error) {
		throw new Error(`Failed to load theme: ${error}`);
	}
}

async function main() {
	try {
		// Read theme name from src/config.ts
		const configPath = path.join(__dirname, "../src/config.ts");
		const configContent = fs.readFileSync(configPath, "utf-8");
		const themeMatch = configContent.match(/theme:\s*["']([^"']+)["']/);

		if (!themeMatch) {
			throw new Error("Could not find theme in src/config.ts");
		}

		const themeName = themeMatch[1];
		console.log(`[Theme] Found theme in config: ${themeName}`);

		// Extract colors
		const colors = await extractThemeColors(themeName);

		// Generate TypeScript file
		const outputDir = path.join(__dirname, "../src/generated");
		const outputPath = path.join(outputDir, "theme-colors.ts");

		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		const tsContent = `// AUTO-GENERATED - DO NOT EDIT
// Generated by scripts/generate-theme-colors.ts
// Theme: ${themeName}

export const themeColors = ${JSON.stringify(colors, null, 2)} as const;

export type ThemeColors = typeof themeColors;
`;

		fs.writeFileSync(outputPath, tsContent);
		console.log(`[Theme] Generated ${outputPath}`);
		console.log(
			`[Theme] Extracted ${Object.keys(colors).length} color categories`,
		);
	} catch (error) {
		console.error("[Theme] Error:", error);
		process.exit(1);
	}
}

main();
