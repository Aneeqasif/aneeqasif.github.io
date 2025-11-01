/**
 * CUSTOM PLUGIN: Remark directive for image gallery
 * Safe for upstream merges - doesn't modify theme core
 * 
 * Usage in Markdown:
 * :::gallery
 * /posts/image1.jpg
 * /posts/image2.jpg
 * /posts/image3.jpg
 * :::
 * 
 * Or with options:
 * :::gallery{columns="4" gap="1.5rem"}
 * /posts/image1.jpg
 * /posts/image2.jpg
 * :::
 */

import { visit } from 'unist-util-visit';

export function remarkGallery() {
	return (tree: any) => {
		visit(tree, (node: any) => {
			// Look for container directives named "gallery"
			if (
				node.type === 'containerDirective' ||
				node.type === 'leafDirective' ||
				node.type === 'textDirective'
			) {
				if (node.name !== 'gallery') return;

				// Extract image paths from the content
				const images: string[] = [];
				
				visit(node, 'text', (textNode: any) => {
					const lines = textNode.value.split('\n').map((line: string) => line.trim()).filter(Boolean);
					images.push(...lines);
				});

				// If no content, check for inline images attribute
				if (images.length === 0 && node.attributes?.images) {
					images.push(...node.attributes.images.split(',').map((s: string) => s.trim()));
				}

				// Get optional attributes
				const columns = node.attributes?.columns || '3';
				const gap = node.attributes?.gap || '1rem';

				// Transform to HTML with our custom component
				if (!node.data) {
					node.data = {};
				}
				
				node.data.hName = 'ImageGallery';
				node.data.hProperties = {
					images: images.join(','),
					columns: columns,
					gap: gap,
				};

				// Clear children since we've extracted the data
				node.children = [];
			}
		});
	};
}

