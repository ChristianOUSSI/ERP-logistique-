---
name: implementation-plan
description: Plan to fix data creation issues and mock data problems in Railway deployment
metadata:
  type: plan
---

## Context
The user is experiencing issues when deploying to Railway:
1. Cannot create articles or tiers (suppliers/clients)
2. Still seeing mock data instead of real data
3. Root cause identified: Incorrect Alembic migration logic in start.sh when SEED_DATA=true

## Solution Overview
Fix the deployment sequence to ensure proper database migrations and visible error handling for seed data.

## Changes Required

### 1. Fix Alembic Migration Logic in start.sh
**File**: `EVO-LOG-backend/start.sh`
**Change**: Modify the Alembic section to always run migrations, regardless of SEED_DATA setting
**Current problematic code**:
```bash
# ─── Alembic upgrade (appliquer les migrations) ───
echo "📌 Running Alembic migrations..."
if [ "$SEED_DATA" = "true" ]; then
    echo "SEED_DATA=true: stamping Alembic migrations to head..."
    alembic stamp head || echo "⚠️  Alembic stamp failed"
else
    alembic upgrade head || echo "⚠️  Alembic upgrade failed (check logs)"
fi
```
**Fixed code**:
```bash
# ─── Alembic upgrade (appliquer les migrations) ───
echo "📌 Running Alembic migrations..."
alembic upgrade head || echo "⚠️  Alembic upgrade failed (check logs)"
```
**Reasoning**: Migrations must always be applied to ensure database schema matches application models. Seeding should happen after migrations are successfully applied.

### 2. Improve Seeder Error Handling (Optional but Recommended)
**File**: `EVO-LOG-backend/scripts/seed_data.py`
**Change**: Modify seeders that currently silently fail to either:
- Re-raise critical errors when SEED_DATA=true
- Or at least exit with non-zero code to signal failure
**Target functions**: seed_agency, seed_users, seed_tiers, seed_finance, seed_rh, seed_fuel, seed_missions
**Approach**: Add a check for SEED_DATA environment variable and handle errors appropriately

### 3. Verify Core API Endpoints
**Files to check**: 
- `EVO-LOG-backend/app/routers/tiers.py`
- `EVO-LOG-backend/app/routers/magasin.py` (articles section)
**Verification**: Ensure no try-except blocks return mock data on failure
**Current status**: Appears correct - endpoints propagate errors properly

## Implementation Steps

### Step 1: Update start.sh
- Modify the Alembic section as described above
- Ensure the change maintains the existing error handling (echoing failure message)

### Step 2: Test the Fix
- Verify that `alembic upgrade head` runs before seeders
- Check that database schema is properly migrated
- Confirm seed data loads correctly

### Step 3: Validate Results
- After deployment, verify that:
  - Core tables (agencies, users, roles, permissions, tiers, camions, chauffeurs, magasin tables) are populated
  - Users can create new articles and tiers via API
  - No mock data appears in core business entities

## Expected Outcome
After implementing these changes:
1. Database migrations will be properly applied on every deployment
2. Seed data will load correctly (or failures will be visible)
3. Users will be able to create articles, tiers, and other entities
4. Mock data will only appear in intentional fallbacks (like OCR when not configured), not in core business data

## Risk Assessment
**Low Risk**: 
- The change to start.sh is straightforward and follows standard practice (migrate then seed)
- Improving seeder error handling is conservative and only affects failure visibility
- No changes to business logic or API contracts

## Rollback Plan
If issues arise after deployment:
1. Revert start.sh to previous version
2. Re-deploy
3. Monitor logs for any seeder failures