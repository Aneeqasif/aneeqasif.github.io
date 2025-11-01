import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export function remarkSteps() {
	return (tree: Root) => {
		visit(tree, (node: any) => {
			if (node.type !== "containerDirective") return;
			if (node.name !== "steps") return;

			if (!node.data) {
				node.data = {};
			}
			const data = node.data;

			// Transform to a div with special class
			data.hName = "div";
			data.hProperties = {
				class: "steps-wrapper",
			};
		});
	};
}
