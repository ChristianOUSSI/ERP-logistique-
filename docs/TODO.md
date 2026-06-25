# TODO & Project Task Log - KAMLOG EM-ERP

All active bugs and deployment items have been resolved successfully:

## ✅ Resolving Font & Next.js Build Issues
- [x] **Root cause analysis**: Next.js fonts configured correctly with offline local caching fallback.
- [x] **Material Symbols**: Restructured to use standard loading and fail-safes.
- [x] **TypeScript Build**: Confirmed Next.js compilation succeeds without errors (`npm run build` exits 0).

## ✅ Resolving Deployment & Runtime Bugs
- [x] **Vercel 500 Error**: Removed incorrect `/api/:path*` placeholder rewrites in root `vercel.json` that were intercepting NextAuth authentication routes.
- [x] **Backend Syntax Error**: Fixed import statement error in `app/routers/finance.py` (missing comma and closing parenthesis).
- [x] **Backend Schema Imports**: Added missing `ZoneParcUpdate`, `EmplacementParcUpdate`, and `StockPhysiqueParcUpdate` schemas to `app/schemas/parc.py` to fix import errors on start.
- [x] **Seeders Stability**: Converted `scripts/seed_magasin_data.py` to use asynchronous database sessions compatible with the async engine.
- [x] **Git Repository Updates**: Pushed clean, feature-grouped commits directly to both `main` and `develop` branches.

## ✅ Master Data Connection & Integration
- [x] **Incoterms page**: Connected to backend FastAPI API CRUD endpoints.
- [x] **Container Types page**: Connected to backend API with automatic JSON serialization of dimensions in the description column.
- [x] **Measurement Units page**: Fetch units from Python backend enums in read-only mode.
- [x] **Article Categories page**: Fetch classification categories from Python backend enums in read-only mode.
- [x] **Integration Testing**: Created integration tests for new `/api/master-data/...` endpoints in `tests/test_magasin.py`.
- [x] **Compilation and Builds**: Verified zero syntax warnings in Python code and successful build execution of Next.js project.

## ✅ Resolving Backend Boot & Seeder Issues (Railway Deployment)
- [x] **User.Role Attribute Error**: Added `Role = Role` class alias inside `User` class to resolve `AttributeError: type object 'User' has no attribute 'Role'` across multiple router files (`tiers.py`, `transport.py`, `parc.py`, `finance.py`, `documents.py`, `alerts.py`).
- [x] **Seeder Module Imports**: Added `export PYTHONPATH=.` to the top of `start.sh` so that running scripts inside the subfolders (like `scripts/seed_data.py`) correctly resolves root module imports (`import app`).
- [x] **BaseModel NameError in alerts.py**: Moved the pydantic import statement to the top of the file so that the `AlertResponse` model compiles successfully.
- [x] **Passlib Bcrypt ValueError in Python 3.12+**: Substituted the legacy `passlib` crypt context wrapper with a direct invocation of the native `bcrypt` library, bypassing all Python 3.12+ setup incompatibility warnings and preventing errors related to 72-byte limit validation when hashing passwords in `security.py`.





