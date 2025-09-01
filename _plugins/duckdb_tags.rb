#!/usr/bin/env ruby
#
# DuckDB interactive blocks for Jekyll posts

module Jekyll
  # Using theme's conditional include pattern instead of hooks

  class DuckDBDDLBlock < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
      @markup = markup.strip
      # Parse parameters like: title="My Schema" id="schema1"
      @params = {}
      markup.scan(/(\w+)=["']([^"']+)["']/) do |key, value|
        @params[key] = value
      end
      
      # Generate unique ID if not provided
      @params['id'] ||= "ddl-#{rand(1000..9999)}"
      @params['title'] ||= "DDL Block"
    end

    def render(context)
      site = context.registers[:site]
      page = context.registers[:page]
      
      # Get the SQL content
      sql_content = super.strip
      
      # Store DDL block info in site data for reference by DQL blocks
      site.data['duckdb_ddls'] ||= {}
      site.data['duckdb_ddls'][@params['id']] = {
        'title' => @params['title'],
        'sql' => sql_content
      }
      
      # Generate the HTML for DDL block
      <<~HTML
        <div class="ddl-block duckdb-ddl-block" id="block-#{@params['id']}" data-block-id="#{@params['id']}">
          <div class="ddl-header" onclick="toggleDdlBlock('#{@params['id']}')">
            <div class="ddl-title">
              <span class="ddl-expand-icon">▶</span>
              <span>#{@params['title']}</span>
            </div>
            <div class="ddl-status" id="status-#{@params['id']}">Not Executed</div>
          </div>
          <div class="ddl-content" id="content-#{@params['id']}">
            <div class="block-info">DDL Block: Schema definitions and data setup</div>
            <textarea class="sql-editor ddl-editor" id="editor-#{@params['id']}" readonly placeholder="DDL SQL (read-only)">#{html_escape(sql_content)}</textarea>
          </div>
        </div>
        <script>
          // Register DDL block with JavaScript immediately
          (function() {
            if (typeof window.ddlBlocks === 'undefined') {
              window.ddlBlocks = {};
            }
            window.ddlBlocks['#{@params['id']}'] = {
              executed: false,
              title: '#{js_escape(@params['title'])}',
              sql: #{sql_content.to_json}
            };
          })();
        </script>
      HTML
    end

    private

    def html_escape(text)
      text.gsub(/&/, '&amp;').gsub(/</, '&lt;').gsub(/>/, '&gt;').gsub(/"/, '&quot;')
    end

    def js_escape(text)
      text.gsub(/\\/, '\\\\').gsub(/'/, "\\'").gsub(/\r?\n/, '\\n')
    end
  end

  class DuckDBDQLBlock < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
      @markup = markup.strip
      # Parse parameters like: depends="schema1" title="My Query"
      @params = {}
      markup.scan(/(\w+)=["']([^"']+)["']/) do |key, value|
        @params[key] = value
      end
      
      # Generate unique ID if not provided
      @params['id'] ||= "dql-#{rand(1000..9999)}"
      @params['title'] ||= "DQL Query"
    end

    def render(context)
      site = context.registers[:site]
      
      # Get the SQL content
      sql_content = super.strip
      
      # Set selected DDL if specified via 'depends' parameter
      selected_ddl = @params['depends'] || @params['ddl'] || ''
      
      # Generate DDL context display
      ddl_context_display = if selected_ddl.empty?
        '<span class="ddl-context">Standalone (no DDL dependency)</span>'
      else
        # Try to get the title from site data, fallback to ID
        ddl_title = site.data.dig('duckdb_ddls', selected_ddl, 'title') || selected_ddl
        "<span class=\"ddl-context\">Using DDL: <strong>#{ddl_title}</strong></span>"
      end
      
      # Generate the HTML for DQL block
      <<~HTML
        <div class="dql-block duckdb-dql-block" id="block-#{@params['id']}" data-block-id="#{@params['id']}" data-depends="#{selected_ddl}">
          <div class="dql-header">
            <span>DQL Query</span>
            <div class="dql-controls">
              #{ddl_context_display}
              <button class="reset-button" onclick="resetDqlQuery('#{@params['id']}')">Reset</button>
              <button class="run-button" onclick="runDqlQuery('#{@params['id']}')">Run Query</button>
            </div>
          </div>
          <div class="block-info">DQL Block: Query operations (SELECT statements)</div>
          <textarea class="sql-editor dql-editor auto-resize" id="editor-#{@params['id']}" data-original-content="#{html_escape(sql_content)}" placeholder="Enter your DQL SQL here (SELECT statements)...">#{html_escape(sql_content)}</textarea>
          <div class="output-options">
            <label>
              <input type="radio" name="output-#{@params['id']}" value="table" checked>
              HTML Table
            </label>
            <label>
              <input type="radio" name="output-#{@params['id']}" value="json">
              JSON
            </label>
            <label>
              <input type="radio" name="output-#{@params['id']}" value="csv">
              CSV
            </label>
          </div>
          <div class="results" id="results-#{@params['id']}" style="display: none;">
            <div class="results-header">Results</div>
            <div class="results-content" id="results-content-#{@params['id']}"></div>
          </div>
        </div>
        <script>
          // Add keyboard shortcut
          (function() {
            function addKeyboardShortcut() {
              const editor = document.getElementById('editor-#{@params['id']}');
              if (editor) {
                editor.addEventListener('keydown', function(e) {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    runDqlQuery('#{@params['id']}');
                  }
                });
              }
            }
            
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', addKeyboardShortcut);
            } else {
              addKeyboardShortcut();
            }
          })();
        </script>
      HTML
    end

    private

    def html_escape(text)
      text.gsub(/&/, '&amp;').gsub(/</, '&lt;').gsub(/>/, '&gt;').gsub(/"/, '&quot;')
    end

    def js_escape(text)
      text.gsub(/\\/, '\\\\').gsub(/'/, "\\'").gsub(/\r?\n/, '\\n')
    end
  end

  # New DQL tag that uses theme's native code block styling
  class DuckDBNativeDQLBlock < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
      @markup = markup.strip
      # Parse parameters like: depends="schema1"
      @params = {}
      markup.scan(/(\w+)=["']([^"']+)["']/) do |key, value|
        @params[key] = value
      end
      
      # Generate unique ID if not provided
      @params['id'] ||= "dql-#{rand(1000..9999)}"
    end

    def render(context)
      site = context.registers[:site]
      
      # Get the SQL content
      sql_content = super.strip
      
      # Set selected DDL if specified via 'depends' parameter
      selected_ddl = @params['depends'] || @params['ddl'] || ''
      
      # Generate DDL context display
      ddl_context_display = if selected_ddl.empty?
        'Standalone Query'
      else
        ddl_title = site.data.dig('duckdb_ddls', selected_ddl, 'title') || selected_ddl
        "Uses: #{ddl_title}"
      end
      
      # Use Rouge to highlight the SQL
      require 'rouge'
      formatter = Rouge::Formatters::HTML.new
      lexer = Rouge::Lexers::SQL.new
      highlighted_sql = formatter.format(lexer.lex(sql_content))
      
      # Generate the HTML using theme's code block structure
      <<~HTML
        <div class="dql-native-block duckdb-dql-block" id="block-#{@params['id']}" data-block-id="#{@params['id']}" data-depends="#{selected_ddl}">
          <div class="dql-native-header">
            <span class="dql-context-info">#{ddl_context_display}</span>
            <div class="dql-native-controls">
              <button class="dql-reset-btn" onclick="resetDqlQuery('#{@params['id']}')" title="Reset to original">↻</button>
              <button class="dql-run-btn" onclick="runDqlQuery('#{@params['id']}')" title="Run query">▶</button>
            </div>
          </div>
          <div class="highlight dql-code-container">
            <pre class="highlight"><code class="language-sql" data-lang="sql">#{highlighted_sql}</code></pre>
          </div>
          <textarea class="dql-hidden-editor" id="editor-#{@params['id']}" data-original-content="#{html_escape(sql_content)}" style="display: none;">#{html_escape(sql_content)}</textarea>
          <div class="dql-output-options">
            <label><input type="radio" name="output-#{@params['id']}" value="table" checked> Table</label>
            <label><input type="radio" name="output-#{@params['id']}" value="json"> JSON</label>
            <label><input type="radio" name="output-#{@params['id']}" value="csv"> CSV</label>
          </div>
          <div class="results" id="results-#{@params['id']}" style="display: none;">
            <div class="results-header">Results</div>
            <div class="results-content" id="results-content-#{@params['id']}"></div>
          </div>
        </div>
        <script>
          // Make code block editable
          (function() {
            const codeBlock = document.querySelector('#block-#{@params['id']} code');
            const hiddenEditor = document.getElementById('editor-#{@params['id']}');
            
            if (codeBlock && hiddenEditor) {
              // Store original highlighted HTML for reset functionality
              codeBlock.dataset.originalHtml = codeBlock.innerHTML;
              
              codeBlock.contentEditable = true;
              codeBlock.style.outline = 'none';
              
              // Sync editable code with hidden textarea
              codeBlock.addEventListener('input', function() {
                hiddenEditor.value = codeBlock.textContent;
              });
              
              // Keyboard shortcuts
              codeBlock.addEventListener('keydown', function(e) {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.preventDefault();
                  runDqlQuery('#{@params['id']}');
                }
              });
            }
          })();
        </script>
      HTML
    end

    private

    def html_escape(text)
      text.gsub(/&/, '&amp;').gsub(/</, '&lt;').gsub(/>/, '&gt;').gsub(/"/, '&quot;')
    end

    def js_escape(text)
      text.gsub(/\\/, '\\\\').gsub(/'/, "\\'").gsub(/\r?\n/, '\\n')
    end
  end
end

# Register the liquid tags
Liquid::Template.register_tag('duckdb_ddl', Jekyll::DuckDBDDLBlock)
Liquid::Template.register_tag('duckdb_dql', Jekyll::DuckDBDQLBlock)
Liquid::Template.register_tag('dql', Jekyll::DuckDBNativeDQLBlock)
