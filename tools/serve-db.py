#!/usr/bin/env python3
"""
Simple HTTP server that supports range requests for DuckDB files.
Use this alongside Jekyll server for testing local DuckDB files.

Usage:
    python3 tools/serve-db.py

This will serve the assets/dbs/ directory on port 8080 with proper range request support.
You can then update your JavaScript to load from http://localhost:8080/blog.duckdb
"""

import http.server
import socketserver
import os
from pathlib import Path

class RangeHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler with range request support"""
    
    def do_GET(self):
        """Handle GET requests with range support"""
        if 'Range' in self.headers:
            self.handle_range_request()
        else:
            super().do_GET()
    
    def handle_range_request(self):
        """Handle HTTP range requests"""
        try:
            # Get the requested file path
            path = self.translate_path(self.path)
            if not os.path.exists(path) or os.path.isdir(path):
                self.send_error(404)
                return
            
            # Parse range header
            range_header = self.headers['Range']
            if not range_header.startswith('bytes='):
                self.send_error(400, "Invalid range header")
                return
            
            ranges = range_header[6:].split(',')[0]  # Take first range only
            if '-' not in ranges:
                self.send_error(400, "Invalid range format")
                return
            
            start_str, end_str = ranges.split('-', 1)
            
            # Get file size
            file_size = os.path.getsize(path)
            
            # Parse start and end positions
            if start_str:
                start = int(start_str)
            else:
                start = 0
            
            if end_str:
                end = int(end_str)
            else:
                end = file_size - 1
            
            # Validate range
            if start >= file_size or end >= file_size or start > end:
                self.send_error(416, "Range not satisfiable")
                return
            
            # Send response
            content_length = end - start + 1
            
            self.send_response(206, "Partial Content")
            self.send_header("Content-Type", "application/octet-stream")
            self.send_header("Content-Length", str(content_length))
            self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
            self.send_header("Accept-Ranges", "bytes")
            self.end_headers()
            
            # Send file content
            with open(path, 'rb') as f:
                f.seek(start)
                remaining = content_length
                while remaining > 0:
                    chunk_size = min(8192, remaining)
                    chunk = f.read(chunk_size)
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    remaining -= len(chunk)
                    
        except Exception as e:
            print(f"Error handling range request: {e}")
            self.send_error(500, str(e))

def main():
    # Change to the dbs directory
    dbs_dir = Path(__file__).parent.parent / "assets" / "dbs"
    if not dbs_dir.exists():
        print(f"Directory {dbs_dir} does not exist!")
        return
    
    os.chdir(dbs_dir)
    
    PORT = 8080
    
    with socketserver.TCPServer(("", PORT), RangeHTTPRequestHandler) as httpd:
        print(f"Serving DuckDB files from {dbs_dir} at http://localhost:{PORT}")
        print("Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")

if __name__ == "__main__":
    main()
