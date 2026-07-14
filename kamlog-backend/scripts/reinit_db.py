import os
import sys

# Ensure backend root is in PYTHONPATH
backend_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

def main():
    db_file = os.path.join(backend_root, "kamlog_erp.db")
    if os.path.exists(db_file):
        print(f"Removing existing local database: {db_file}")
        try:
            os.remove(db_file)
            print("Successfully removed old database.")
        except Exception as e:
            print(f"Error removing old database: {e}")
            sys.exit(1)
            
    # Import and run create_tables
    print("Running create_tables...")
    import create_tables
    create_tables.main()
    
    # Import and run seed_data
    print("Running seed_data...")
    from scripts import seed_data
    seed_data.main()
    
    print("Database reinitialization and seeding completed successfully!")

if __name__ == "__main__":
    main()
