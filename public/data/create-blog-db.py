#!/usr/bin/env python3
"""
Create a tiny DuckDB database file for PondPilot examples.

This script creates public/data/blog.duckdb with:
- main.orders table (5 rows)
- main.customers table (5 rows)

Usage:
  python3 public/data/create-blog-db.py

Requirements:
  pip install duckdb pandas
"""

import os
from pathlib import Path

import duckdb
import pandas as pd


def main() -> None:
    # Create in same directory as script
    data_dir = Path(__file__).parent
    db_path = data_dir / "blog.duckdb"

    # Small synthetic dataset
    orders = pd.DataFrame([
        {"order_id": 1, "customer": "Alice", "amount": 29.99, "created_at": "2024-01-05"},
        {"order_id": 2, "customer": "Bob", "amount": 49.50, "created_at": "2024-01-12"},
        {"order_id": 3, "customer": "Charlie", "amount": 15.00, "created_at": "2024-02-01"},
        {"order_id": 4, "customer": "Diana", "amount": 99.95, "created_at": "2024-02-14"},
        {"order_id": 5, "customer": "Eve", "amount": 10.00, "created_at": "2024-03-02"},
    ])

    customers = pd.DataFrame([
        {"customer": "Alice", "tier": "gold"},
        {"customer": "Bob", "tier": "silver"},
        {"customer": "Charlie", "tier": "bronze"},
        {"customer": "Diana", "tier": "gold"},
        {"customer": "Eve", "tier": "silver"},
    ])

    # Create database
    con = duckdb.connect(str(db_path))
    try:
        con.execute("CREATE SCHEMA IF NOT EXISTS main;")
        
        # Create orders table
        con.register("orders_df", orders)
        con.execute("CREATE OR REPLACE TABLE main.orders AS SELECT * FROM orders_df;")
        
        # Create customers table
        con.register("customers_df", customers)
        con.execute("CREATE OR REPLACE TABLE main.customers AS SELECT * FROM customers_df;")
    finally:
        con.close()

    size_kb = os.path.getsize(db_path) / 1024.0
    print(f"✅ Created {db_path} ({size_kb:.1f} KB)")
    print("Tables:")
    print("  - main.orders (5 rows)")
    print("  - main.customers (5 rows)")


if __name__ == "__main__":
    main()
