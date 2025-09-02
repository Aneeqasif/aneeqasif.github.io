(() => {
  // State
  let db = null;
  let conn = null;
  let isInitializing = false;
  let isInitialized = false;
  const ddlBlocks = (window.ddlBlocks = window.ddlBlocks || {});
  const connections = (window.connections = window.connections || {});
  const ddlExecPromises = (window.ddlExecPromises = window.ddlExecPromises || {});

  // Simple async mutex to serialize access to the shared DuckDB connection
  class Mutex {
    constructor() { this.locked = false; this.queue = []; }
    acquire() {
      return new Promise((resolve) => {
        if (!this.locked) { this.locked = true; resolve(); }
        else { this.queue.push(resolve); }
      });
    }
    release() {
      const next = this.queue.shift();
      if (next) next(); else this.locked = false;
    }
  }
  const connMutex = new Mutex();

  // Utils
  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };
  const autoResizeTextarea = (ta) => {
    ta.style.height = 'auto';
    ta.style.height = Math.max(60, ta.scrollHeight) + 'px';
  };
  const initializeAutoResize = () => {
    document.querySelectorAll('.dql-editor.auto-resize').forEach((editor) => {
      autoResizeTextarea(editor);
      editor.addEventListener('input', function () { autoResizeTextarea(this); });
      editor.addEventListener('paste', function () { setTimeout(() => autoResizeTextarea(this), 0); });
    });
  };

  // UI gating helpers
  const setUiReady = (ready) => {
    document.querySelectorAll('.dql-run-btn, .run-button').forEach((btn) => {
      if (ready) {
        btn.disabled = false;
        if (btn.dataset._origHtml) {
          btn.innerHTML = btn.dataset._origHtml;
          delete btn.dataset._origHtml;
        }
        btn.title = '';
      } else {
        if (!btn.dataset._origHtml) btn.dataset._origHtml = btn.innerHTML || btn.textContent;
        btn.disabled = true;
        btn.innerHTML = '<span class="duckdb-spinner" aria-hidden="true"></span>';
        btn.title = 'DuckDB is initializing';
      }
    });
  };

  const showInitSpinner = (blockId) => {
    const resultsDiv = document.getElementById(`results-${blockId}`);
    const resultsContent = document.getElementById(`results-content-${blockId}`);
    if (resultsDiv) resultsDiv.style.display = 'block';
    if (resultsContent) resultsContent.innerHTML = '<div class="results-content duckdb-init"><span class="duckdb-spinner" aria-label="Initializing"></span></div>';
  };

  // Split SQL into individual statements, respecting quotes and comments
  function splitSqlStatements(sql) {
    const stmts = [];
    let cur = '';
    let inSingle = false, inDouble = false, inLineComment = false, inBlockComment = false;
    for (let i = 0; i < sql.length; i++) {
      const ch = sql[i];
      const next = sql[i + 1];

      if (inLineComment) {
        cur += ch;
        if (ch === '\n') inLineComment = false;
        continue;
      }
      if (inBlockComment) {
        cur += ch;
        if (ch === '*' && next === '/') { cur += next; i++; inBlockComment = false; }
        continue;
      }

      if (!inSingle && !inDouble) {
        if (ch === '-' && next === '-') { cur += ch; cur += next; i++; inLineComment = true; continue; }
        if (ch === '/' && next === '*') { cur += ch; cur += next; i++; inBlockComment = true; continue; }
      }

      if (!inDouble && ch === '\'' ) { inSingle = !inSingle; cur += ch; continue; }
      if (!inSingle && ch === '"') { inDouble = !inDouble; cur += ch; continue; }

      if (!inSingle && !inDouble && ch === ';') {
        const trimmed = cur.trim();
        if (trimmed) stmts.push(trimmed);
        cur = '';
        continue;
      }
      cur += ch;
    }
    const trimmed = cur.trim();
    if (trimmed) stmts.push(trimmed);
    return stmts;
  }

  // Remove SQL comments (line and block) while respecting quotes
  function stripSqlComments(sql) {
    let out = '';
    let inSingle = false, inDouble = false, inLineComment = false, inBlockComment = false;
    for (let i = 0; i < sql.length; i++) {
      const ch = sql[i];
      const next = sql[i + 1];

      if (inLineComment) {
        if (ch === '\n') { inLineComment = false; out += ch; }
        // else drop character
        continue;
      }
      if (inBlockComment) {
        if (ch === '*' && next === '/') { i++; inBlockComment = false; }
        continue;
      }

      if (!inSingle && !inDouble) {
        if (ch === '-' && next === '-') { i++; inLineComment = true; continue; }
        if (ch === '/' && next === '*') { i++; inBlockComment = true; continue; }
      }

      if (!inDouble && ch === '\'') { inSingle = !inSingle; out += ch; continue; }
      if (!inSingle && ch === '"') { inDouble = !inDouble; out += ch; continue; }

      out += ch;
    }
    return out;
  }

  // Globals used by onclick
  window.toggleDdlBlock = function (blockId) {
    const content = document.getElementById(`content-${blockId}`);
    const icon = document.querySelector(`#block-${blockId} .ddl-expand-icon`);
    if (!content || !icon) return;
    content.classList.toggle('expanded');
    icon.classList.toggle('expanded');
  };

  const notReady = (blockId) => {
    console.warn('DuckDB is still loading...');
    if (blockId) showInitSpinner(blockId);
  };
  window.executeDdlBlock = window.executeDdlBlock || function (blockId) { notReady(blockId); };
  window.runDqlQuery    = window.runDqlQuery    || function (blockId) { notReady(blockId); };
  window.resetDqlQuery  = window.resetDqlQuery  || function (blockId) {
    const editor = document.getElementById(`editor-${blockId}`);
    const resultsDiv = document.getElementById(`results-${blockId}`);
    if (editor) {
      const original = editor.getAttribute('data-original-content');
      editor.value = original || '';
      if (editor.classList && editor.classList.contains('auto-resize')) autoResizeTextarea(editor);
    }
    if (resultsDiv) resultsDiv.style.display = 'none';
  };

  async function initDuckDB() {
    if (isInitialized) return { db, conn };
    if (isInitializing) {
      while (isInitializing) { await new Promise(r => setTimeout(r, 100)); }
      return { db, conn };
    }
    isInitializing = true;
    try {
      // Load module from CDN (works on GH Pages); pin version for stability
      const duckdbMod = await import('https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.28.0/+esm');
      const bundles = duckdbMod.getJsDelivrBundles();
      const bundle = await duckdbMod.selectBundle(bundles);
      const worker_url = URL.createObjectURL(new Blob([`importScripts("${bundle.mainWorker}");`], { type: 'text/javascript' }));
      const worker = new Worker(worker_url);
      const logger = new duckdbMod.ConsoleLogger();
      const adb = new duckdbMod.AsyncDuckDB(logger, worker);
      await adb.instantiate(bundle.mainModule, bundle.pthreadWorker);
      URL.revokeObjectURL(worker_url);
      db = adb;
      conn = await db.connect();
      isInitialized = true;

      // Replace stubs with real implementations (use shared connection)
      window.executeDdlBlock = async function (blockId) {
        // Prefer textarea editor; fallback to code inside the block
        const editor = document.getElementById(`editor-${blockId}`);
        let sql = '';
        if (editor && typeof editor.value === 'string') {
          sql = editor.value.trim();
        } else {
          const codeBlock = document.querySelector(`#block-${blockId} code`);
          sql = codeBlock ? codeBlock.textContent.trim() : '';
        }
        if (!sql) throw new Error('DDL block is empty');

        if (!ddlBlocks[blockId]) ddlBlocks[blockId] = { executed: false, title: blockId, sql };
        // If already executed, nothing to do
        if (ddlBlocks[blockId].executed) return conn;

        // De-dupe concurrent executions of the same DDL block
        if (!ddlExecPromises[blockId]) {
          ddlExecPromises[blockId] = (async () => {
            const sanitized = stripSqlComments(sql);
            const statements = splitSqlStatements(sanitized);
            await connMutex.acquire();
            try {
              for (const stmt of statements) {
                await conn.query(stmt);
              }
            } finally {
              connMutex.release();
            }
            ddlBlocks[blockId].executed = true;
            ddlBlocks[blockId].sql = sql;
            connections[blockId] = conn;
            const status = document.getElementById(`status-${blockId}`);
            if (status) { status.textContent = 'Executed'; status.classList.add('executed'); }
          })();
        }
        // Await the (possibly in-flight) execution
        await ddlExecPromises[blockId];
        return conn;
      };

      window.runDqlQuery = async function (blockId) {
        const editor = document.getElementById(`editor-${blockId}`);
        const resultsDiv = document.getElementById(`results-${blockId}`);
        const resultsContent = document.getElementById(`results-content-${blockId}`);
        const runButton = document.querySelector(`#block-${blockId} .run-button, #block-${blockId} .dql-run-btn`);
        const blockDiv = document.getElementById(`block-${blockId}`);

        let sql = '';
        if (editor && editor.style.display === 'none') {
          const codeBlock = document.querySelector(`#block-${blockId} code`);
          sql = codeBlock ? codeBlock.textContent.trim() : '';
        } else if (editor) {
          sql = editor.value.trim();
        }
        if (!sql) { alert('Please enter a DQL query'); return; }

        if (runButton) {
          var isDqlBtn = (runButton && runButton.classList && runButton.classList.contains('dql-run-btn'));
          runButton.disabled = true;
          runButton.textContent = isDqlBtn ? '⏳' : 'Running...';
        }
        if (resultsDiv) resultsDiv.style.display = 'block';
        if (resultsContent) resultsContent.innerHTML = '<div class="loading">Executing query...</div>';

        try {
          const dependencyId = blockDiv ? blockDiv.getAttribute('data-depends') : '';
          if (dependencyId) {
            if (!ddlBlocks[dependencyId] || !ddlBlocks[dependencyId].executed) {
              if (resultsContent) resultsContent.innerHTML = '<div class="loading">Executing dependent DDL block...</div>';
              await window.executeDdlBlock(dependencyId);
            }
            if (!connections[dependencyId]) connections[dependencyId] = conn;
          }

          const outputFormatEl = document.querySelector(`input[name="output-${blockId}"]:checked`);
          const outputFormat = outputFormatEl ? outputFormatEl.value : 'table';

          // Serialize query execution to avoid overlapping use of the same connection
          await connMutex.acquire();
          let result;
          try {
            result = await conn.query(sql);
          } finally {
            connMutex.release();
          }
          let output = '';

          if (outputFormat === 'table') {
            if (result.numRows === 0) {
              output = '<div style="color:#718096;font-style:italic;">Query executed successfully. No rows returned.</div>';
            } else {
              const cols = result.schema.fields.map(f => f.name);
              const rows = result.toArray();
              let t = '<table><thead><tr>';
              cols.forEach(c => { t += `<th>${escapeHtml(c)}</th>`; });
              t += '</tr></thead><tbody>';
              rows.forEach(r => {
                t += '<tr>';
                cols.forEach(c => {
                  const v = r[c] === null ? 'NULL' : String(r[c]);
                  t += `<td>${escapeHtml(v)}</td>`;
                });
                t += '</tr>';
              });
              t += '</tbody></table>';
              t += `<div style=\"margin-top:10px;font-size:11px;color:#718096;\">Returned ${result.numRows} row(s)</div>`;
              output = t;
            }
          } else if (outputFormat === 'json') {
            output = `<div class=\"raw-output\">${JSON.stringify(result.toArray(), null, 2)}</div>`;
          } else if (outputFormat === 'csv') {
            const cols = result.schema.fields.map(f => f.name);
            const rows = result.toArray();
            let csv = cols.join(',') + '\n';
            rows.forEach(r => {
              const line = cols.map(c => {
                const val = r[c];
                if (val === null) return 'NULL';
                if (typeof val === 'string') return `"${val.replace(/\"/g, '""')}"`;
                return String(val);
              }).join(',');
              csv += line + '\n';
            });
            output = `<div class=\"raw-output\">${csv}</div>`;
          }

          if (resultsContent) resultsContent.innerHTML = output;
  } catch (e) {
          if (resultsContent) resultsContent.innerHTML = `<div class=\"error\">Error: ${escapeHtml(e.message)}</div>`;
        } finally {
          if (runButton) {
            var isDqlBtn2 = (runButton && runButton.classList && runButton.classList.contains('dql-run-btn'));
            runButton.disabled = false;
            runButton.textContent = isDqlBtn2 ? '▶' : 'Run Query';
          }
        }
      };

    } catch (e) {
      console.error('Failed to initialize DuckDB:', e);
      throw e;
    } finally {
      isInitializing = false;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initializeAutoResize();
    // Disable UI while initializing
    setUiReady(false);
    // Kick off loading so handlers become live soon after page load
    Promise.resolve().then(() => initDuckDB())
      .then(() => {
        setUiReady(true);
        document.dispatchEvent(new Event('duckdb:ready'));
      })
      .catch((e) => {
        console.error('DuckDB init failed', e);
        // keep buttons disabled on failure
      });
  });

  window.debugDuckDB = function () {
    console.log('=== DuckDB Debug Info ===');
    console.log('DDL Blocks:', ddlBlocks);
    console.log('Connections:', connections);
    console.log('DB Ready:', !!db);
    console.log('Default Connection:', !!conn);
    console.log('Is Initialized:', isInitialized);
    console.log('Is Initializing:', isInitializing);
  };
})();
