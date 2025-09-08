---
title: Testing Jekyll GitHub Pages DuckDB Integration
date: 2025-07-08 14:00:00 +0500
toc: true
comments: true
math: false
use_sql: true
categories: [technology, testing, github-pages]
tags: [jekyll, github-pages, duckdb, pondpilot, testing, debugging]
image:
  path: /assets/img/workstation-grey.jpg
  lqip: /assets/img/workstation-grey-lqip.webp
---

This post tests PondPilot widget integration with local DuckDB files on GitHub Pages. We're testing whether GitHub Pages' CDN properly supports HTTP range requests for DuckDB WASM.

## Test Environment Details

- **Local Development**: Jekyll serve (WEBrick) - Expected to fail with range requests
- **GitHub Pages**: Static CDN hosting - Should support range requests properly
- **Database File**: `/assets/dbs/blog.duckdb` (1.3MB sample database)
- **Widget Source**: CDN-hosted PondPilot widget

## Loading Status

<div id="duckdb-status" style="
  padding: 15px;
  margin: 20px 0;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  font-weight: bold;
">
  <div id="status-text">🔧 Initializing DuckDB WASM...</div>
  <div id="status-details" style="font-size: 0.9em; margin-top: 5px; opacity: 0.9;"></div>
</div>

## Test Queries

### Query 1 — Database Connection Test
<pre class="pondpilot-db">SELECT 'DuckDB connection successful!' as status, CURRENT_TIMESTAMP as loaded_at;</pre>

### Query 2 — Orders Table Row Count
<pre class="pondpilot-db">SELECT COUNT(*) AS total_orders FROM main.orders;</pre>

### Query 3 — Sample Orders Data
<pre class="pondpilot-db">SELECT order_id, customer, amount, order_date 
FROM main.orders 
ORDER BY order_id 
LIMIT 5;</pre>

### Query 4 — Customer Analysis
<pre class="pondpilot-db">SELECT customer, tier, city 
FROM main.customers 
ORDER BY customer;</pre>

### Query 5 — Join Analysis
<pre class="pondpilot-db">SELECT 
    o.customer,
    c.tier,
    COUNT(*) as order_count,
    SUM(o.amount) as total_spent
FROM main.orders o
JOIN main.customers c USING(customer)
GROUP BY o.customer, c.tier
ORDER BY total_spent DESC;</pre>

## Technical Implementation

<!-- Load PondPilot Widget from CDN -->
<script src="https://unpkg.com/pondpilot-widget"></script>

<script type="module">
  console.log('🚀 Starting GitHub Pages DuckDB test...');
  
  // Status update helpers
  function updateStatus(text, details = '', isError = false) {
    const statusEl = document.getElementById('status-text');
    const detailsEl = document.getElementById('status-details');
    const containerEl = document.getElementById('duckdb-status');
    
    if (statusEl) statusEl.textContent = text;
    if (detailsEl) detailsEl.textContent = details;
    
    if (isError && containerEl) {
      containerEl.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)';
    } else if (!isError && text.includes('✅')) {
      containerEl.style.background = 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)';
    }
    
    console.log(`📊 Status: ${text}${details ? ` - ${details}` : ''}`);
  }

  async function testDuckDBIntegration() {
    try {
      updateStatus('🔧 Loading DuckDB WASM modules...', 'Importing from jsdelivr CDN');
      
      // Import DuckDB WASM
      const duckdb = await import('https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.29.1-dev68.0/+esm');
      console.log('✅ DuckDB WASM modules loaded successfully');
      
      updateStatus('⚙️ Selecting optimal bundle...', 'Checking browser capabilities');
      const bundles = duckdb.getJsDelivrBundles();
      const bundle = await duckdb.selectBundle(bundles);
      console.log('✅ Bundle selected:', bundle);
      
      updateStatus('👷 Creating Web Worker...', 'Setting up background processing');
      
      // Create worker with fallback
      async function createWorker() {
        try {
          console.log('🔧 Attempting direct worker creation...');
          return new Worker(bundle.mainWorker);
        } catch (err) {
          console.log('⚠️ Direct worker failed, using blob fallback:', err);
          const resp = await fetch(bundle.mainWorker);
          const code = await resp.text();
          const blob = new Blob([code], { type: 'text/javascript' });
          const url = URL.createObjectURL(blob);
          return new Worker(url);
        }
      }

      const worker = await createWorker();
      console.log('✅ Web Worker created successfully');
      
      updateStatus('🔌 Initializing DuckDB instance...', 'Creating database connection');
      const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);
      const db = new duckdb.AsyncDuckDB(logger, worker);
      await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
      console.log('✅ DuckDB instance created and instantiated');
      
      updateStatus('📥 Loading database file...', 'Testing range request support');
      
      // Construct the database URL
      const dbPath = '/assets/dbs/blog.duckdb';
      const dbHttpUrl = new URL(dbPath, window.location.href).href;
      console.log('🔗 Database URL:', dbHttpUrl);
      
      // Test if file exists first
      try {
        const testResponse = await fetch(dbHttpUrl, { method: 'HEAD' });
        console.log('📊 Database file HEAD response:', {
          status: testResponse.status,
          contentLength: testResponse.headers.get('content-length'),
          contentType: testResponse.headers.get('content-type'),
          acceptRanges: testResponse.headers.get('accept-ranges'),
          cacheControl: testResponse.headers.get('cache-control')
        });
        
        if (!testResponse.ok) {
          throw new Error(`Database file not accessible: ${testResponse.status} ${testResponse.statusText}`);
        }
        
        const fileSize = testResponse.headers.get('content-length');
        updateStatus('📊 File accessible!', `Size: ${fileSize} bytes, Testing range requests...`);
        
      } catch (headError) {
        console.error('❌ Database file HEAD request failed:', headError);
        throw new Error(`Cannot access database file: ${headError.message}`);
      }
      
      // Try to register and open the database file
      console.log('🔧 Registering database file with DuckDB...');
      await db.registerFileURL('blog.duckdb', dbHttpUrl, duckdb.DuckDBDataProtocol.HTTP, false);
      console.log('✅ Database file registered successfully');
      
      updateStatus('🔓 Opening database...', 'Attempting to read file structure');
      await db.open({ path: 'blog.duckdb' });
      console.log('✅ Database opened successfully!');
      
      updateStatus('🎯 Initializing widgets...', 'Connecting SQL blocks to database');
      
      // Initialize PondPilot widgets
      let widgetCount = 0;
      document.querySelectorAll('pre.pondpilot-db').forEach((el) => {
        try {
          new window.PondPilot.Widget(el, {
            duckdbInstance: db,
            duckdbModule: duckdb,
            theme: document.documentElement.getAttribute('data-mode') || 'light',
            showPoweredBy: true,
          });
          widgetCount++;
          console.log(`✅ Widget ${widgetCount} initialized`);
        } catch (widgetError) {
          console.error('❌ Widget initialization failed:', widgetError);
        }
      });
      
      updateStatus('✅ Integration successful!', `${widgetCount} SQL widgets ready. Range requests working!`);
      console.log('🎉 GitHub Pages DuckDB integration test completed successfully!');
      console.log('📊 Summary: Range requests are supported on GitHub Pages CDN');
      
    } catch (error) {
      console.error('❌ DuckDB integration test failed:', error);
      updateStatus('❌ Integration failed', error.message, true);
      
      // Log detailed error information
      console.error('🔍 Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Determine if it's a range request issue
      if (error.message.includes('Range request') || error.message.includes('304') || error.message.includes('416')) {
        console.log('🔍 This appears to be a range request issue');
        updateStatus('❌ Range requests not supported', 'This server does not support HTTP range requests', true);
      }
    }
  }

  // Start the test when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testDuckDBIntegration);
  } else {
    testDuckDBIntegration();
  }
</script>

## Expected Results

### Local Jekyll Development
- ❌ **Range requests fail** - WEBrick doesn't support range headers
- 🔧 **Console shows range errors** - 304/416 HTTP status codes
- 💡 **Use `npx serve _site`** for local testing with range support

### GitHub Pages Deployment  
- ✅ **Range requests work** - GitHub's CDN supports ranges
- ⚡ **Fast loading** - DuckDB streams data efficiently
- 🎯 **Widgets appear instantly** - No need to download entire file

## Testing Notes

This implementation uses the **standard PondPilot approach** with `registerFileURL()` and range requests, exactly like the original examples. If this works on GitHub Pages, it proves that:

1. **GitHub Pages CDN supports HTTP range requests** ✅
2. **No blob workaround needed in production** ✅  
3. **Better performance than full file download** ✅
4. **Widgets can load instantly** ✅

Check the browser console for detailed logging and status updates!