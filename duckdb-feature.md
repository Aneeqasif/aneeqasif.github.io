# Instructions for LLM: Implement DuckDB SQL Runner Features in Jekyll Blog

## 🎯 PRIMARY OBJECTIVE
Implement a  interactive [DuckDB wasm](https://github.com/duckdb/duckdb-wasm) SQL execution blocks feature within Jekyll blog that allows readers to run SQL queries directly in their browser without any backend infrastructure using duckdb wasm.

## 📋 CORE FEATURES TO IMPLEMENT

### 1. **Interactive SQL Block System**
the user wants to
- create two types of blocks
- Create DDL (Data Definition Language) blocks for schema creation (that are not run unless the underlying dql block is ran)
- Create DQL (Data Query Language) blocks for query execution (that either can use a ddl block to get the data or a local duckdb database file or none if operations is small) 
- Implement dependency system where DQL blocks can reference specific DDL blocks
- Ensure each DDL block creates isolated database connections
- Add visual theming: DDL blocks (orange), DQL blocks (blue)
- Make DDL blocks collapsible/expandable by default (collapsed)
- Add execution status indicators for all blocks
- button to reset the ddl block to orignal content

### 2. **Database File Loading Capability**
- Allow users to specify local database file paths
- Enable loading of pre-existing .db or .duckdb files from Jekyll assets or have a dbs folder that jekyll can inlcudes or pickup
- Create database-backed DQL blocks that don't require DDL block dependencies
- Implement enough error handling for missing/invalid database files
- Add database loading status indicators

### 3. **Output Format Options**
- Support multiple output formats: (HTML tables that are styled), JSON, CSV
- Ensure HTML tables have proper styling (hover effects, zebra striping)
- Add row count indicators for query results
- Handle NULL values appropriately in all output formats

### 4. **Jekyll Integration Methods**
- Research and implement the most appropriate Jekyll integration approach
- Consider: Custom Liquid tags, Jekyll includes, or front matter configuration
- Make the system reusable across multiple blog posts
- Enable usable and clean jekyll markdown syntax for non-technical content creators

### 5. **User Experience Requirements**
- run button
- Create intuitive visual hierarchy with proper color coding
- Add loading states and error messages
- Ensure mobile-friendly interface and responsive layout (out code already have some of this but see what needs to be done)

### 6. **Technical Implementation**
- Use DuckDB WASM from CDN (latest version via jsDelivr)
- Implement proper connection management and isolation
- Add dependency info for DQL blocks like which ddl blocks they depend on (if a dql is using a local db file to load context then skip it)
- Create auto-execution of DDL blocks when dependent DQL blocks run
- Handle browser compatibility
- create a Example markdown post files demonstrating usage
- the site has to run on github pages


## 🎨 DESIGN SPECIFICATIONS

### Interaction Requirements:
- Click DDL headers to expand/collapse
- Radio buttons for output format selection
- Status indicators that update in real-time


## 📚 RESEARCH TASKS

### Jekyll Integration Research:
- Investigate custom Liquid tag creation for Jekyll
- Analyze Jekyll include system capabilities

### DuckDB WASM Research:
- Study latest DuckDB WASM documentation
- Understand connection management and isolation
- Research file loading capabilities and limitations
- Investigate browser compatibility requirements
- Analyze performance considerations for static sites

## ⚡ PRIORITY ORDER

### Phase 1 (High Priority):
1. Basic DuckDB WASM integration and initialization
2. DDL and DQL block creation and styling
3. Dependency system implementation
4. Basic HTML table output

### Phase 2 (Medium Priority):
1. Database file loading functionality
2. Multiple output formats (ask user if they want this or not)
3. Jekyll integration method selection and implementation
4. Error handling and status indicators

### Phase 3 (Polish):
1. Advanced styling and animations
2. Keyboard shortcuts
3. Mobile responsiveness optimization
4. Documentation and examples

## 🚫 CONSTRAINTS AND CONSIDERATIONS

### Technical Limitations:
- File size limitations for database files (keep under 10MB)
- Browser CORS restrictions for local file access (firefox issues etc for wasm)
- Jekyll build process compatibility

### User Experience Goals:
- Non-technical users should be able to create content
- Fast loading times despite DuckDB WASM size
- Graceful degradation if JavaScript is disabled
- Intuitive interface
- No backend infrastructure required as its a static site

## 📝 DELIVERABLE EXPECTATIONS

### Final Output Should Include:
- Complete working implementation
- Clear documentation for content creators
- Example usage in markdown files
- Error handling for edge cases
- Cross-browser compatibility
