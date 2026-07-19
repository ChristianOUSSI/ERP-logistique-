import os
import logging
logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)
from sqlalchemy import text
from app.database import engine, Base
import app.models
import sys

def main():
    print("Creating all database tables via SQLAlchemy metadata...")
    try:
        # The engine is synchronous (create_engine), so we use a sync block
        with engine.begin() as conn:
            if os.environ.get("SEED_DATA") == "true":
                print("SEED_DATA=true: dropping all tables first to align schemas...")
                dialect_name = conn.dialect.name
                if dialect_name == "postgresql":
                    print("PostgreSQL database detected. Dropping tables with CASCADE...")
                    res = conn.execute(text(
                        "SELECT tablename FROM pg_tables WHERE schemaname = current_schema()"
                    ))
                    tables = [row[0] for row in res.fetchall()]
                    for table in tables:
                        conn.execute(text(f'DROP TABLE IF EXISTS "{table}" CASCADE'))
                    print("All PostgreSQL tables dropped successfully via CASCADE.")
                else:
                    Base.metadata.drop_all(conn)
            Base.metadata.create_all(conn)
        print("Database tables created successfully.")
        
        if os.environ.get("SEED_DATA") == "true":
            print("Stamping Alembic head since tables were recreated...", flush=True)
            os.system("alembic stamp head")
    except Exception as e:
        print(f"Error creating database tables: {e}", file=sys.stderr)
        raise e
    finally:
        engine.dispose()

if __name__ == "__main__":
    main()
