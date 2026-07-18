---
name: analysis-issue-summary
description: Summary of issues found causing problems with data creation and mock data in Railway deployment
metadata:
  type: analysis
---

## Issues Identified

### Primary Issue: Incorrect Alembic Migration Logic
**Location**: `kamlog-backend/start.sh`, lines 50-56
**Problem**: When `SEED_DATA=true` (set in `.env.railway.example`), the script runs `alembic stamp head` instead of `alembic upgrade head`. This means database migrations are not actually applied - only pretended to be applied.
**Impact**: 
- Schema migrations are skipped
- Seed data insertion may fail due to missing columns/constraints
- API operations may fail or return incorrect data
- Users experience inability to create articles, tiers, etc.

### Secondary Issue: Silent Seeder Failures
**Locations**: Multiple seeder functions in `kamlog-backend/scripts/seed_data.py`:
- `seed_agency()` (lines 51-53)
- `seed_users()` (lines 152-153)  
- `seed_tiers()` (lines 230-231)
- `seed_finance()` (lines 666-667)
- `seed_rh()` (lines 765-766)
- `seed_fuel()` (lines 769-776)
- `seed_missions()` (lines 880-881)
**Problem**: These functions catch `OperationalError` and `ProgrammingError` and only print a warning before silently returning.
**Impact**: 
- Seeding failures are not visible in logs unless carefully checked
- No indication to user that seed data failed to load
- Application starts but with missing essential data

### Minor Issue: OCR Endpoint Mock Data
**Location**: `kamlog-backend/app/routers/parc.py`, lines 284-289
**Problem**: The `/ocr-extract` endpoint returns hardcoded mock data instead of real OCR results when Tesseract is not configured.
**Impact**: 
- Users may see mock license plate/chauffeur data
- However, this is likely just a fallback and not the main issue reported

## Root Cause Analysis
The main user complaints ("can't create articles or tiers" and "still seeing mock data") are primarily caused by the **incorrect Alembic migration logic**. When migrations aren't properly applied:
1. Database schema may not match what models expect
2. Seed data insertion fails silently (due to seeder error handling)
3. Core tables lack expected data
4. API endpoints return errors or empty results
5. Frontend may show mock data as fallback when real data isn't available

## Recommended Solution
1. Fix start.sh to always run `alembic upgrade head` regardless of SEED_DATA setting
2. Improve seeder error handling to make failures more visible
3. Verify that core API endpoints don't have mock data fallbacks