---
title: Testing PondPilot with Local DuckDB File
date: 2025-08-08 12:00:00 +0500
toc: true
comments: true
math: false
use_sql: true
categories: [technology, data, testing]
tags: [sql, duckdb, javascript, web-development, data-analysis, local-database]
image:
  path: /assets/img/workstation-grey.jpg
  alt: Testing PondPilot Widget with Local DuckDB
  lqip: /assets/img/workstation-grey-lqip.webp
---

<!-- Loading banner for database initialization -->
<div id="duckdb-loading-banner" style="
  display: block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 20px;
  margin: 20px 0;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-left: 4px solid #4f46e5;
">
  <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
    <div style="
      width: 16px;
      height: 16px;
      border: 2px solid #ffffff;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    "></div>
    <span>🦆 Loading DuckDB database... This may take a moment for the first load.</span>
  </div>
</div>

<style>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
This is a test post to verify that PondPilot widget can load and query a local DuckDB file. The database contains sample order and customer data.

> **Technical Implementation**: This demo loads the entire DuckDB file as a blob (ArrayBuffer) to avoid HTTP range request issues that occur with static file servers like Jekyll. This approach works reliably with GitHub Pages and other static hosting platforms.

## Database Loading Strategy

The implementation uses DuckDB WASM's `registerFileBuffer()` method to load the database entirely into memory, which:
- ✅ Works with any static file server (Jekyll, GitHub Pages, etc.)
- ✅ Avoids HTTP range request complications
- ✅ Provides consistent behavior across environments
- ⚠️ Loads entire database into memory (fine for small databases like this demo)

> **Note**: This implementation loads the entire DuckDB file into memory as a workaround for Jekyll's development server not supporting HTTP range requests. In production, you might want to use a proper web server that supports range requests, or continue with this approach for smaller databases.

## Query 1 — Row Count

Let's start by checking how many rows are in our orders table:

<pre class="pondpilot-db">SELECT COUNT(*) AS rows_in_orders FROM main.orders;</pre>

## Query 2 — Preview Orders

Now let's look at the first few orders:

<pre class="pondpilot-db">SELECT * FROM main.orders ORDER BY order_id LIMIT 5;</pre>

## Query 3 — Preview Customers

And let's see the customer data:

<pre class="pondpilot-db">SELECT * FROM main.customers ORDER BY customer;</pre>

## Query 4 — Simple Join

Finally, let's join the orders with customer tiers:

<pre class="pondpilot-db">SELECT o.order_id, o.customer, c.tier, o.amount, o.created_at
FROM main.orders o
JOIN main.customers c USING(customer)
ORDER BY o.order_id;</pre>

## query 5
basic supported system
{% include pondpilot.html 
   title="Number Generation and Calculations"
   description="Generate a sequence of numbers and perform various calculations"
   sql="-- Generate a sequence of numbers and perform calculations
SELECT 
    num,
    num * 2 as doubled,
    num^2 as squared,
    CASE 
        WHEN num % 2 = 0 THEN 'Even'
        ELSE 'Odd'
    END as parity
FROM generate_series(1, 10) AS t(num)
ORDER BY num;" %}

or this:



## Query 5 — Aggregation by Tier

Let's see total amounts by customer tier:

<pre class="pondpilot-db">SELECT 
    c.tier,
    COUNT(*) as order_count,
    SUM(o.amount) as total_amount,
    AVG(o.amount) as avg_amount
FROM main.orders o
JOIN main.customers c USING(customer)
GROUP BY c.tier
ORDER BY total_amount DESC;</pre>

<!-- Loading banner for database initialization -->
<div id="duckdb-loading-banner" style="
  display: block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 20px;
  margin: 20px 0;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-left: 4px solid #4f46e5;
">
  <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
    <div style="
      width: 16px;
      height: 16px;
      border: 2px solid #ffffff;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    "></div>
    <span>🦆 Loading DuckDB database... This may take a moment for the first load.</span>
  </div>
</div>

<style>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

<script type="module">
  // Aggressively bypass service worker for DuckDB compatibility
  if ('serviceWorker' in navigator) {
    console.log('🔧 Bypassing service worker for DuckDB compatibility');
    // Temporarily disable service worker for this session
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      registrations.forEach(function(registration) {
        console.log('Unregistering service worker:', registration.scope);
        registration.unregister();
      });
    });
  }

  // Import DuckDB WASM
  import * as duckdb from 'https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.29.1-dev68.0/+esm';

  // Create worker function
  async function createWorker(bundle) {
    try { 
      return new Worker(bundle.mainWorker); 
    } catch (err) {
      const resp = await fetch(bundle.mainWorker);
      const code = await resp.text();
      const blob = new Blob([code], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      return new Worker(url);
    }
  }

  async function initializePondPilotWithLocalDB() {
    const loadingBanner = document.getElementById('duckdb-loading-banner');
    
    try {
      // Update loading message
      if (loadingBanner) {
        loadingBanner.querySelector('span').textContent = '🔧 Initializing DuckDB WASM...';
      }
      
      // Initialize DuckDB WASM
      const bundles = duckdb.getJsDelivrBundles();
      const bundle = await duckdb.selectBundle(bundles);
      const worker = await createWorker(bundle);
      const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);
      const db = new duckdb.AsyncDuckDB(logger, worker);
      await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

      // Update loading message
      if (loadingBanner) {
        loadingBanner.querySelector('span').textContent = '📥 Downloading database file...';
      }

      // Load database file with cache bypass to avoid service worker issues
      const dbUrl = new URL('/assets/dbs/blog.duckdb', window.location.href).href;
      const response = await fetch(dbUrl, {
        cache: 'no-store',  // Bypass service worker cache
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch database: ${response.status}`);
      }
      
      // Update loading message
      if (loadingBanner) {
        loadingBanner.querySelector('span').textContent = '⚡ Processing database...';
      }
      
      const blob = await response.blob();
      const dbBuffer = await blob.arrayBuffer();
      
      if (dbBuffer.byteLength < 100) {
        throw new Error(`Invalid database file size: ${dbBuffer.byteLength} bytes`);
      }
      
      // Register and open database
      await db.registerFileBuffer('blog.duckdb', new Uint8Array(dbBuffer));
      await db.open({ path: 'blog.duckdb' });

      // Update loading message
      if (loadingBanner) {
        loadingBanner.querySelector('span').textContent = '🎯 Initializing SQL widgets...';
      }

      // Initialize widgets
      document.querySelectorAll('pre.pondpilot-db').forEach((el) => {
        new window.PondPilot.Widget(el, {
          duckdbInstance: db,
          duckdbModule: duckdb,
          theme: document.documentElement.getAttribute('data-mode') || 'light',
          showPoweredBy: true,
        });
      });

      // Hide loading banner
      if (loadingBanner) {
        loadingBanner.style.display = 'none';
      }

    } catch (error) {
      console.error('Failed to initialize PondPilot with local database:', error);
      
      // Show error in loading banner
      if (loadingBanner) {
        loadingBanner.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
        loadingBanner.querySelector('span').textContent = '❌ Failed to load database. Please refresh to try again.';
        loadingBanner.querySelector('div').style.animation = 'none'; // Stop spinner
      }
    }
  }

  // Wait for PondPilot to be available and initialize
  function waitForPondPilot() {
    if (window.PondPilot && window.PondPilot.Widget) {
      initializePondPilotWithLocalDB();
    } else {
      setTimeout(waitForPondPilot, 100);
    }
  }

  waitForPondPilot();
</script>
