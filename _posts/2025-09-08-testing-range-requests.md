---
title: Testing PondPilot with Range Requests (GitHub Pages Test)
date: 2025-07-08 13:00:00 +0500
toc: true
comments: true
math: false
use_sql: true
categories: [technology, data, testing]
tags: [sql, duckdb, javascript, web-development, data-analysis, range-requests]
image:
  path: /assets/img/workstation-grey.jpg
  alt: Testing PondPilot Widget with Range Requests
  lqip: /assets/img/workstation-grey-lqip.webp
---

This post tests the "normal" PondPilot approach using HTTP range requests directly, similar to the original PondPilot examples. This should work on GitHub Pages since their CDN supports range requests, but will likely fail on local Jekyll development.

> **Hypothesis**: GitHub Pages CDN supports `Accept-Ranges: bytes` while Jekyll's WEBrick server doesn't. If this works on GitHub Pages, we can use this faster approach for production.

## Query 1 — Row Count

<pre class="pondpilot-db">SELECT COUNT(*) AS rows_in_orders FROM main.orders;</pre>

## Query 2 — Preview Orders

<pre class="pondpilot-db">SELECT * FROM main.orders ORDER BY order_id LIMIT 5;</pre>

## Query 3 — Simple Join

<pre class="pondpilot-db">SELECT o.order_id, o.customer, c.tier, o.amount, o.created_at
FROM main.orders o
JOIN main.customers c USING(customer)
ORDER BY o.order_id;</pre>

<script type="module">
  // Import DuckDB WASM
  import * as duckdb from 'https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.29.1-dev68.0/+esm';

  async function initializePondPilotWithRangeRequests() {
    try {
      console.log('🚀 Testing range request approach...');
      
      // Get DuckDB bundles
      const bundles = duckdb.getJsDelivrBundles();
      const bundle = await duckdb.selectBundle(bundles);

      // Create worker
      async function createWorker() {
        try { 
          return new Worker(bundle.mainWorker); 
        } catch (err) {
          console.log('Using blob worker fallback');
          const resp = await fetch(bundle.mainWorker);
          const code = await resp.text();
          const blob = new Blob([code], { type: 'text/javascript' });
          const url = URL.createObjectURL(blob);
          return new Worker(url);
        }
      }

      const worker = await createWorker();
      const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);
      const db = new duckdb.AsyncDuckDB(logger, worker);
      await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

      // Use the ORIGINAL approach - register HTTP URL and let DuckDB handle range requests
      const dbHttpUrl = new URL('/assets/dbs/blog.duckdb', window.location.href).href;
      console.log('📡 Registering DuckDB file for range requests:', dbHttpUrl);
      
      await db.registerFileURL('blog.duckdb', dbHttpUrl, duckdb.DuckDBDataProtocol.HTTP, false);
      await db.open({ path: 'blog.duckdb' });

      console.log('✅ Range request approach successful!');

      // Attach widgets to blocks with the custom class
      document.querySelectorAll('pre.pondpilot-db').forEach((el) => {
        new window.PondPilot.Widget(el, {
          duckdbInstance: db,
          duckdbModule: duckdb,
          theme: document.documentElement.getAttribute('data-mode') || 'light',
          showPoweredBy: true,
        });
      });

      console.log('🎯 PondPilot widgets initialized with range requests');
      
    } catch (error) {
      console.error('❌ Range request approach failed:', error);
      console.log('💡 This is expected on local Jekyll development');
      console.log('📝 Check if this works when deployed to GitHub Pages');
      
      // Add a visible error message for testing
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 8px;
        padding: 16px;
        margin: 20px 0;
        color: #c33;
      `;
      errorDiv.innerHTML = `
        <strong>⚠️ Range Request Test Failed</strong><br>
        This is expected on local Jekyll development.<br>
        <em>Deploy to GitHub Pages to test if range requests work there.</em>
      `;
      document.querySelector('article').appendChild(errorDiv);
    }
  }

  // Wait for PondPilot to be available
  function waitForPondPilot() {
    if (window.PondPilot && window.PondPilot.Widget) {
      initializePondPilotWithRangeRequests();
    } else {
      setTimeout(waitForPondPilot, 100);
    }
  }

  waitForPondPilot();
</script>
