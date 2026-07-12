import os
from typing import Iterable

REQUIRED_TABLES = [
    "agencies",
    "users",
    "roles",
    "permissions",
]


def get_missing_required_tables(existing_tables: Iterable[str]) -> list[str]:
    existing_set = {table.lower() for table in existing_tables}
    return [table for table in REQUIRED_TABLES if table not in existing_set]


def should_run_seed(existing_tables: Iterable[str]) -> bool:
    return not get_missing_required_tables(existing_tables)
