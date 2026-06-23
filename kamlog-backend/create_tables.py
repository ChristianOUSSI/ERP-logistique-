import asyncio
import logging
logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)
from app.database import engine, Base
import app.models
import sys

async def main():
    print("Creating all database tables via SQLAlchemy metadata...")
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("Database tables created successfully.")
    except Exception as e:
        print(f"Error creating database tables: {e}", file=sys.stderr)
        raise e
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
