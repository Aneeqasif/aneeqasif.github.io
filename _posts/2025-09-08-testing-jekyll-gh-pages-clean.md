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
ORDER BY order_date DESC 
LIMIT 5;</pre>

### Query 4 — Customer Analysis
<pre class="pondpilot-db">SELECT customer_id, customer_name, email 
FROM main.customers 
ORDER BY customer_name;</pre>

### Query 5 — Join Analysis
<pre class="pondpilot-db">SELECT 
    c.customer_name,
    COUNT(o.order_id) as order_count,
    SUM(o.amount) as total_spent,
    AVG(o.amount) as avg_order_value
FROM main.orders o
JOIN main.customers c USING(customer_id)
GROUP BY c.customer_id, c.customer_name
ORDER BY total_spent DESC;</pre>

## Technical Implementation

<!-- Load PondPilot Widget from CDN -->
<script src="https://unpkg.com/pondpilot-widget"></script>

<script type="module">
  console.log('🚀 Starting GitHub Pages DuckDB test...');
  console.log('🌐 Environment info:', {
    userAgent: navigator.userAgent,
    location: window.location.href,
    protocol: window.location.protocol,
    isHTTPS: window.location.protocol === 'https:',
    origin: window.location.origin
  });
  
  // Check for potential blocking issues
  if (window.location.protocol === 'file:') {
    console.warn('⚠️ Running on file:// protocol - ES modules may not work');
  }
  
  // Check if ES modules are supported
  if (!('noModule' in HTMLScriptElement.prototype)) {
    console.error('❌ ES modules not supported in this browser');
  } else {
    console.log('✅ ES modules supported');
  }
  
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
      window.setProgressStep && window.setProgressStep('Loading DuckDB modules');
      updateStatus('🔧 Loading DuckDB WASM modules...', 'Importing from jsdelivr CDN');
      
      // Try importing DuckDB WASM with detailed error handling
      let duckdb;
      
      console.log('🔄 Loading DuckDB via ES module import...');
      window.setProgressStep && window.setProgressStep('ES module import attempt');
      
      try {
        console.log('🔄 Attempting to import DuckDB from jsdelivr...');
        window.setProgressStep && window.setProgressStep('jsdelivr import starting');
        
        // Add a timeout to the import
        const importPromise = import('https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.29.1-dev68.0/+esm');
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Import timeout after 15 seconds')), 15000)
        );
        
        duckdb = await Promise.race([importPromise, timeoutPromise]);
        console.log('✅ DuckDB WASM modules loaded successfully from jsdelivr');
        window.setProgressStep && window.setProgressStep('jsdelivr import successful');
      } catch (importError) {
        console.error('❌ Failed to import from jsdelivr:', importError);
        updateStatus('⚠️ Trying alternative approach...', 'jsdelivr failed, testing alternatives');
        window.setProgressStep && window.setProgressStep('jsdelivr failed, trying unpkg');
        
        // Try alternative CDN
        try {
          console.log('🔄 Trying unpkg CDN...');
          const unpkgPromise = import('https://unpkg.com/@duckdb/duckdb-wasm@latest/dist/duckdb-browser-eh.js');
          const timeoutPromise2 = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Unpkg timeout after 15 seconds')), 15000)
          );
          
          duckdb = await Promise.race([unpkgPromise, timeoutPromise2]);
          console.log('✅ DuckDB WASM loaded from unpkg');
          window.setProgressStep && window.setProgressStep('unpkg import successful');
        } catch (unpkgError) {
          console.error('❌ Failed to import from unpkg:', unpkgError);
          window.setProgressStep && window.setProgressStep('unpkg failed, trying stable');
          
          // Try the latest stable version
          try {
            console.log('🔄 Trying latest stable version...');
            const stablePromise = import('https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@latest/+esm');
            const timeoutPromise3 = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Stable version timeout after 15 seconds')), 15000)
            );
            
            duckdb = await Promise.race([stablePromise, timeoutPromise3]);
            console.log('✅ DuckDB WASM loaded from latest stable');
            window.setProgressStep && window.setProgressStep('stable import successful');
          } catch (stableError) {
            console.error('❌ All import methods failed');
            window.setProgressStep && window.setProgressStep('ALL IMPORTS FAILED');
            throw new Error(`Cannot load DuckDB WASM: jsdelivr (${importError.message}), unpkg (${unpkgError.message}), stable (${stableError.message})`);
          }
        }
      }
      
      // Check if duckdb object has required methods
      console.log('🔍 Checking DuckDB object:', Object.keys(duckdb));
      window.setProgressStep && window.setProgressStep('Checking DuckDB object');
      if (!duckdb.getJsDelivrBundles) {
        throw new Error('DuckDB object missing required methods');
      }
      
      updateStatus('⚙️ Selecting optimal bundle...', 'Checking browser capabilities');
      window.setProgressStep && window.setProgressStep('Selecting bundle');
      const bundles = duckdb.getJsDelivrBundles();
      const bundle = await duckdb.selectBundle(bundles);
      console.log('✅ Bundle selected:', bundle);
      window.setProgressStep && window.setProgressStep('Bundle selected');
      
      updateStatus('👷 Creating Web Worker...', 'Setting up background processing');
      window.setProgressStep && window.setProgressStep('Creating worker');
      
      // Create worker with fallback
      async function createWorker() {
        try {
          console.log('🔧 Attempting direct worker creation...');
          window.setProgressStep && window.setProgressStep('Direct worker attempt');
          return new Worker(bundle.mainWorker);
        } catch (err) {
          console.log('⚠️ Direct worker failed, using blob fallback:', err);
          window.setProgressStep && window.setProgressStep('Worker blob fallback');
          const resp = await fetch(bundle.mainWorker);
          const code = await resp.text();
          const blob = new Blob([code], { type: 'text/javascript' });
          const url = URL.createObjectURL(blob);
          return new Worker(url);
        }
      }
      
      const worker = await createWorker();
      console.log('✅ Worker created successfully');
      window.setProgressStep && window.setProgressStep('Worker created');
      
      updateStatus('🏗️ Instantiating DuckDB...', 'Loading core database engine');
      window.setProgressStep && window.setProgressStep('Instantiating DuckDB');
      const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);
      const db = new duckdb.AsyncDuckDB(logger, worker);
      await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
      
      console.log('✅ DuckDB instance created successfully');
      window.setProgressStep && window.setProgressStep('DuckDB instantiated');
      
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
      window.setProgressStep && window.setProgressStep('ALL TESTS PASSED - DuckDB working!');
      console.log('🎉 GitHub Pages DuckDB integration test completed successfully!');
      console.log('📊 Summary: Range requests are supported on GitHub Pages CDN');
      
    } catch (error) {
      console.error('❌ DuckDB integration test failed:', error);
      window.setProgressStep && window.setProgressStep('TEST FAILED: ' + error.message);
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
        window.setProgressStep && window.setProgressStep('Range request issue detected');
        updateStatus('❌ Range requests not supported', 'This server does not support HTTP range requests', true);
      }
    }
  }

  // Start the test when DOM is ready with timeout
  function startTestWithTimeout() {
    console.log('⏰ Starting test with 30-second timeout...');
    window.setProgressStep && window.setProgressStep('Test starting with timeout');
    
    // Add a more granular timeout to catch hanging imports
    const timeoutId = setTimeout(() => {
      console.error('⏰ Test timed out after 30 seconds');
      console.error('🔍 Most likely stuck at DuckDB WASM import');
      window.setProgressStep && window.setProgressStep('TIMEOUT - likely hanging at DuckDB import');
      updateStatus('⏰ Test timeout', 'DuckDB import hanging - likely CSP or network issue on GitHub Pages', true);
      
      // Show helpful error message
      const errorDetails = `
        Possible causes:
        1. Content Security Policy blocking external modules
        2. GitHub Pages service worker interference
        3. Network connectivity issues
        4. ES module import restrictions
      `;
      console.error('📋 Debugging info:', errorDetails);
    }, 30000);
    
    // Add progress tracking
    let progressStep = 'Starting';
    const progressInterval = setInterval(() => {
      console.log(`⏱️ Current step: ${progressStep} (${Date.now()})`);
    }, 5000);
    
    testDuckDBIntegration()
      .then(() => {
        clearTimeout(timeoutId);
        clearInterval(progressInterval);
        window.setProgressStep && window.setProgressStep('✅ Test completed successfully');
        console.log('✅ Test completed successfully');
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        clearInterval(progressInterval);
        console.error('❌ Test failed at step:', progressStep);
        console.error('❌ Test failed:', error);
      });
      
    // Update progress tracking in the main function
    window.setProgressStep = (step) => {
      progressStep = step;
      console.log(`📍 Progress: ${step}`);
    };
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startTestWithTimeout);
  } else {
    startTestWithTimeout();
  }
  
  // Additional debugging - check if imports work at all
  console.log('🔍 Testing basic import capability...');
  
  // Test basic fetch first
  console.log('🌐 Testing basic CDN connectivity...');
  fetch('https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@latest/package.json')
    .then(response => {
      console.log('✅ jsdelivr CDN reachable:', response.status);
      return response.json();
    })
    .then(pkg => console.log('📦 DuckDB package info:', pkg.version))
    .catch(err => console.error('❌ jsdelivr CDN test failed:', err));
  
  // Test ES module import capability
  try {
    import('https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.js')
      .then(() => console.log('✅ Basic ES module import works'))
      .catch(err => console.error('❌ Basic ES module import failed:', err));
  } catch (e) {
    console.error('❌ Import statement not supported:', e);
  }
  
  // Check if we're in a service worker context or have other restrictions
  console.log('🔍 Environment checks:', {
    serviceWorker: 'serviceWorker' in navigator,
    webWorkers: typeof Worker !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    esModules: 'import' in document.createElement('script')
  });
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
