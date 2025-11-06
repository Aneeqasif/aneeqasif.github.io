import { createHighlighter } from "shiki";

// node scripts/inspect-shiki-tokens.mjs python
// node scripts/inspect-shiki-tokens.mjs typescript
// node scripts/inspect-shiki-tokens.mjs sql
const highlighter = await createHighlighter({
	themes: ["github-dark"],
	langs: ["sql", "python", "typescript", "javascript"],
});

// Comprehensive code samples to test ALL possible token types
const samples = {
	sql: `
-- Comment here
SELECT 
  users.id, 
  users.name,
  COUNT(*) AS total,
  'string literal' AS text,
  123 AS number,
  NULL,
  TRUE,
  orders.*
FROM users
JOIN orders ON users.id = orders.user_id
WHERE users.active = TRUE
  AND orders.total > 100.50
GROUP BY users.id
ORDER BY total DESC
LIMIT 10;
`,

	python: `
# This is a comment
"""Multi-line docstring
with multiple lines"""

import os
from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class User:
    """User class with type hints"""
    name: str
    age: int
    active: bool = True
    
    def greet(self) -> str:
        return f"Hello, {self.name}!"

# Variables and constants
CONSTANT_VALUE = 100
variable_name = "string value"
number = 42
float_num = 3.14159
is_valid = True
nothing = None

# Built-in functions
result = len(variable_name)
items = list(range(10))

# Control flow
if is_valid and number > 0:
    print("Valid")
elif number == 0:
    pass
else:
    raise ValueError("Invalid")

# Loops
for item in items:
    continue
    
while True:
    break

# Exception handling
try:
    x = 1 / 0
except ZeroDivisionError as e:
    print(f"Error: {e}")
finally:
    pass

# Lambda and comprehension
square = lambda x: x ** 2
numbers = [i * 2 for i in range(5) if i % 2 == 0]

# Decorators
@staticmethod
def static_method():
    return "static"

# Class definition
class MyClass(User):
    def __init__(self, name: str):
        super().__init__(name, 0)
        self._private = 10
    
    async def async_method(self) -> None:
        await some_function()
        yield 42

# F-strings and raw strings
message = f"Name: {self.name}, Age: {self.age}"
raw_string = r"C:\\Users\\path"
`,

	typescript: `
// Single line comment
/* Multi-line
   comment */

import { Component, useState } from 'react';
import type { FC, ReactNode } from 'react';

// Type definitions
type Status = 'active' | 'inactive' | 'pending';
interface User {
  id: number;
  name: string;
  email?: string;
  readonly created: Date;
}

// Generic type
type Result<T> = { data: T } | { error: string };

// Enum
enum Color {
  Red = '#ff0000',
  Green = '#00ff00',
  Blue = '#0000ff'
}

// Constants
const CONSTANT = 100;
let variable: string = "hello";
var oldStyle = true;

// Function types
const greet = (name: string): string => {
  return \`Hello, \${name}!\`;
};

// Async function
async function fetchData(): Promise<User[]> {
  const response = await fetch('/api/users');
  return response.json();
}

// Class with decorators
@Component
class UserComponent {
  private _name: string;
  public readonly id: number;
  
  constructor(name: string) {
    this._name = name;
    this.id = Math.random();
  }
  
  get name(): string {
    return this._name;
  }
  
  set name(value: string) {
    this._name = value;
  }
  
  static create(name: string): UserComponent {
    return new UserComponent(name);
  }
}

// Conditional and operators
const result = condition ? true : false;
const sum = a + b;
const logical = x && y || z;
const comparison = a === b && c !== d;

// Built-in objects
console.log('message');
Array.from([1, 2, 3]);
Object.keys({});
JSON.stringify({});

// Control flow
if (x > 0) {
  console.log('positive');
} else if (x < 0) {
  console.log('negative');
} else {
  console.log('zero');
}

for (const item of items) {
  continue;
}

while (true) {
  break;
}

// Try-catch
try {
  throw new Error('Something went wrong');
} catch (error) {
  console.error(error);
} finally {
  cleanup();
}

// Generics
function identity<T>(arg: T): T {
  return arg;
}

// Nullish and optional chaining
const value = obj?.property ?? 'default';

// Template literals
const html = \`
  <div class="container">
    <h1>\${title}</h1>
  </div>
\`;

// Regular expression
const regex = /[a-z]+/gi;

// This keyword
this.method();

// Super keyword
super.method();

// Export/import
export default UserComponent;
export { greet, fetchData };
`,
};

// Test with the selected language
const lang = process.argv[2] || "python";
const code = samples[lang] || samples.python;

const tokens = highlighter.codeToTokens(code, {
	lang: lang,
	theme: "github-dark",
});

console.log("\n╔════════════════════════════════════════════════════════════╗");
console.log(`║   SHIKI TOKEN ANALYSIS: ${lang.toUpperCase().padEnd(35)} ║`);
console.log("║   Theme: github-dark                                       ║");
console.log("╚════════════════════════════════════════════════════════════╝\n");

// Build a complete analysis
const colorMap = new Map();
const tokenDetails = [];

tokens.tokens.forEach((line, lineNum) => {
	line.forEach((token) => {
		const content = token.content.trim();
		if (!content) return; // Skip whitespace

		tokenDetails.push({
			line: lineNum,
			content,
			color: token.color,
		});

		if (!colorMap.has(token.color)) {
			colorMap.set(token.color, []);
		}
		colorMap.get(token.color).push(content);
	});
});

// Show unique colors and ALL their examples
console.log("═══ UNIQUE COLORS AND WHAT THEY STYLE ═══\n");
let colorNum = 1;
colorMap.forEach((examples, color) => {
	const unique = [...new Set(examples)];
	console.log(`Color ${colorNum}: ${color}`);
	console.log(`  Token count: ${examples.length}`);
	console.log(`  Unique tokens: ${unique.length}`);
	console.log(
		`  Examples: ${unique.slice(0, 15).join(", ")}${unique.length > 15 ? "..." : ""}`,
	);
	console.log();
	colorNum++;
});

// Show line-by-line breakdown
console.log("\n═══ LINE-BY-LINE TOKEN BREAKDOWN ═══\n");
const lineGroups = new Map();
tokenDetails.forEach((t) => {
	if (!lineGroups.has(t.line)) {
		lineGroups.set(t.line, []);
	}
	lineGroups.get(t.line).push(t);
});

lineGroups.forEach((tokens, lineNum) => {
	const lineCode = code.split("\n")[lineNum];
	console.log(`Line ${lineNum}: ${lineCode.trim()}`);
	tokens.forEach((t) => {
		console.log(`  "${t.content}" → ${t.color}`);
	});
	console.log();
});

// Token type categorization based on common patterns
console.log("\n═══ TOKEN CATEGORIZATION BY COLOR ═══\n");

const categories = new Map();
colorMap.forEach((examples, color) => {
	const unique = [...new Set(examples)];

	// Try to categorize based on content
	let category = "UNKNOWN";
	const sample = unique.join(" ").toLowerCase();

	if (sample.match(/--|#|\/\/|\/\*|\*\/|'''|"""/)) category = "COMMENTS";
	else if (
		sample.match(
			/if|else|for|while|return|import|from|class|def|function|const|let|var|async|await/,
		)
	)
		category = "KEYWORDS";
	else if (sample.match(/true|false|null|none|undefined/i))
		category = "CONSTANTS";
	else if (sample.match(/^\d+$|^\d+\.\d+$/)) category = "NUMBERS";
	else if (sample.match(/['"`]/)) category = "STRINGS";
	else if (sample.match(/[.,:;(){}[\]<>]/)) category = "PUNCTUATION";
	else if (sample.match(/[+\-*/%=<>!&|^~]/)) category = "OPERATORS";
	else if (sample.match(/[a-z_][a-z0-9_]*/i)) category = "IDENTIFIERS";

	categories.set(color, {
		category,
		examples: unique.slice(0, 10),
		count: examples.length,
	});
});

categories.forEach((info, color) => {
	console.log(`${color} → ${info.category}`);
	console.log(`  Count: ${info.count} tokens`);
	console.log(`  Examples: ${info.examples.join(", ")}`);
	console.log();
});

// Analysis conclusion
console.log("\n═══ ANALYSIS ═══\n");
console.log(`Total unique colors in Shiki: ${colorMap.size}`);
console.log("Currently extracting: 6 categories");
console.log(`Actually needed: ${colorMap.size} unique colors\n`);

// Recommendations
console.log("═══ WHAT YOU CAN DO ═══\n");
console.log("1. KEEP CURRENT (Recommended)");
console.log("   - You have 6 semantic categories");
console.log("   - Easy to customize in pondpilot-init.ts");
console.log("   - Can remap any color to any token\n");

console.log("2. EXTRACT MORE TOKENS");
console.log("   - Add punctuation (#E1E4E8): dots, commas, parens");
console.log("   - Requires editing vite-plugin-theme-colors.ts\n");

console.log("3. USE CUSTOM COLORS");
console.log("   - Ignore Shiki completely");
console.log("   - Use your own hex codes in pondpilot-init.ts");
console.log('   - Example: syntaxString: "#FF0000" for red strings\n');

// Show what's NOT being extracted
console.log("\n═══ ALL COLORS SUMMARY ═══\n");
colorMap.forEach((examples, color) => {
	const unique = [...new Set(examples)];
	console.log(`${color}:`);
	console.log(`  Total: ${examples.length} tokens`);
	console.log(`  Unique: ${unique.length} types`);
	console.log(`  Sample: ${unique.slice(0, 5).join(", ")}`);
	console.log();
});

console.log("═══ SUMMARY ═══\n");
console.log(`Language: ${lang}`);
console.log(`Total unique colors: ${colorMap.size}`);
console.log(`Total tokens analyzed: ${tokenDetails.length}`);
console.log("\n✅ All token types identified!");
console.log("✅ You can extract any of these colors");
console.log("✅ Use this to understand what Shiki provides\n");

console.log("═══ USAGE ═══\n");
console.log("Test different languages:");
console.log("  node scripts/inspect-shiki-tokens.mjs python");
console.log("  node scripts/inspect-shiki-tokens.mjs typescript");
console.log("  node scripts/inspect-shiki-tokens.mjs javascript");
console.log("  node scripts/inspect-shiki-tokens.mjs sql\n");
