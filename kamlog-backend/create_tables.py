import logging
logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)
from app.database import engine, Base
import app.models
import sys

def main():
    print("Creating all database tables via SQLAlchemy metadata...")
    try:
        # The engine is synchronous (create_engine), so we use a sync block
        with engine.begin() as conn:
            Base.metadata.create_all(conn)
        print("Database tables created successfully.")
    except Exception as e:
        print(f"Error creating database tables: {e}", file=sys.stderr)
        raise e
    finally:
        engine.dispose()

if __name__ == "__main__":
    main()
