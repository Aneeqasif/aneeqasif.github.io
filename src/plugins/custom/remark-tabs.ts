import type { Root } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * Remark plugin to transform :::tabs and ::::tab directives into HTML structure
 * 
 * Input:
 * :::tabs
 * ::::tab{label="Stars" icon="star"}
 * Content here
 * ::::
 * :::
 * 
 * Output: Transforms to div.tabs-wrapper with nested tab panels
 */
export function remarkTabs() {
  return (tree: Root) => {
    visit(tree, (node: any) => {
      // Only process container directives named 'tabs'
      if (node.type !== 'containerDirective') return;
      if (node.name !== 'tabs') return;

      const data = node.data || (node.data = {});
      const attributes = node.attributes || {};
      
      // Extract syncKey if provided
      const syncKey = attributes.syncKey;
      
      // Transform the main tabs container
      data.hName = 'div';
      data.hProperties = {
        class: 'tabs-wrapper',
        ...(syncKey && { 'data-sync-key': syncKey }),
      };

      // Process child tab directives
      if (node.children) {
        const timestamp = Date.now();
        let tabIndex = 0;
        
        // Filter and process only containerDirective children named 'tab'
        const tabChildren = node.children.filter((child: any) => 
          child.type === 'containerDirective' && child.name === 'tab'
        );
        
        tabChildren.forEach((child: any, index: number) => {
          const childData = child.data || (child.data = {});
          const childAttrs = child.attributes || {};
          
          // Generate unique IDs for accessibility
          const panelId = `tab-panel-${timestamp}-${index}`;
          const tabId = `tab-${timestamp}-${index}`;
          
          // Transform tab directive to div with proper attributes
          childData.hName = 'div';
          childData.hProperties = {
            class: 'tab-panel',
            id: panelId,
            role: 'tabpanel',
            'aria-labelledby': tabId,
            'data-tab-label': childAttrs.label || `Tab ${index + 1}`,
            'data-tab-icon': childAttrs.icon || '',
            'data-tab-id': tabId,
            'data-panel-id': panelId,
            // Hide all panels except the first one
            ...(index > 0 && { 'data-hidden': 'true' }),
          };
        });
      }
    });
  };
}
