#!/usr/bin/env node
import { createHighlighter } from "shiki";

const highlighter = await createHighlighter({
	themes: ["github-dark"],
	langs: ["sql"],
});

const code = `SELECT
  o.order_id,
  o.customer,
  c.tier,
  p.product_name,
  o.amount as price
FROM main.orders o
JOIN main.customers c USING(customer)
JOIN products p ON o.amount = p.price
ORDER BY o.order_id;`;

const tokens = highlighter.codeToTokens(code, {
	lang: "sql",
	theme: "github-dark",
});

console.log("\n=== Token Analysis ===\n");

const uniqueColors = new Map();

for (const line of tokens.tokens) {
	for (const token of line) {
		if (token.color) {
			const key = token.color;
			if (!uniqueColors.has(key)) {
				uniqueColors.set(key, []);
			}
			uniqueColors.get(key).push(token.content);
		}
	}
}

console.log("Colors used in this SQL:");
for (const [color, examples] of uniqueColors.entries()) {
	const uniqueExamples = [...new Set(examples)].slice(0, 5);
	console.log(`  ${color}: ${uniqueExamples.join(", ")}`);
}
