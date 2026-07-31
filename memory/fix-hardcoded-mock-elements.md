---
name: fix-hardcoded-mock-elements
description: Plan to fix hardcoded/mock elements in alerts WebSocket and fuel ticket page
metadata:
  type: plan
---

## Context
The user wants to eliminate all hardcoded/mock data from the project, specifically:
1. Alerts WebSocket endpoint sending mock data instead of real alerts
2. Fuel ticket page with hardcoded initial values and disconnected save action
3. Other minor hardcoded elements like algorithm thresholds

## Solution Overview
Fix the two main placeholder implementations to use real data and backend connections.

## Changes Required

### 1. Fix Alerts WebSocket Endpoint
**File**: `EVO-LOG-backend/app/routers/alerts.py`
**Current issue**: WebSocket endpoint (`/ws/alerts`) sends mock welcome and ping messages instead of real-time alerts
**Solution**: 
- Replace mock implementation with actual alert streaming
- Connect to real alert sources (fuel siphoning, credit limit checks, system metrics, etc.)
- Implement proper WebSocket broadcasting of real alerts

### 2. Fix Fuel Ticket Page
**File**: `EVO-LOG-frontend/src/app/(app)/transport/fuel/ticket/page.tsx`
**Current issues**:
- Hardcoded initial form values (date, time, odometer, fuel type, volume, unit price)
- Static sample data in "Recent Tickets List" and "Vehicle Info Card"
- Save action only redirects (not connected to backend)
**Solution**:
- Fetch initial data from backend (user preferences, last entry, vehicle info)
- Replace static samples with real data fetched from API
- Connect save action to backend API endpoint
- Show loading states and handle errors properly

### 3. Verify Other Elements
Check that:
- Bank reconciliation algorithm parameters are acceptable as configuration constants
- Gateway monitor is already fully dynamic (confirmed)
- No other major hardcoded/mock elements remain

## Implementation Steps

### Step 1: Fix Alerts WebSocket
- Modify `alerts.py` WebSocket endpoint
- Implement connection to alert sources:
  - Fuel siphoning alerts (existing endpoint)
  - Credit limit alerts (existing endpoint)
  - System health alerts (from monitoring)
  - Low stock alerts (from magasin service)
  - Custom business rule alerts
- Use proper WebSocket message format
- Handle connections/disconnections gracefully

### Step 2: Fix Fuel Ticket Page
#### Part A: Fetch real data for form initialization
- On component mount, fetch:
  - User's last fuel ticket (for pre-filled values)
  - Default vehicle information (if available)
  - Current date/time
  - Fuel type options from reference data
#### Part B: Replace static samples
- Fetch recent fuel tickets from API for "Recent Tickets List"
- Fetch current vehicle info for "Vehicle Info Card"
#### Part C: Connect save action
- Implement actual API call to save fuel ticket
- Handle success/error states
- Redirect or show confirmation on success
- Reset form or keep values based on UX preference

### Step 3: Data Models and API Endpoints
Verify that:
- Backend has appropriate endpoints for fuel ticket CRUD operations
- Alert sources are available for WebSocket consumption
- Frontend has proper API client methods
- Data models match between frontend and backend

## Expected Outcome
After implementation:
1. Alerts WebSocket streams real alerts from multiple sources
2. Fuel ticket page shows real data and saves to backend
3. No more mock/hardcoded data in these core functionalities
4. User experience improved with real-time features

## Risk Assessment
**Medium Risk**:
- WebSocket implementation requires careful connection handling
- Fuel ticket form changes affect UX - need to ensure smooth data flow
- Must maintain backward compatibility where possible
- However, both are currently placeholders, so risk of breaking existing functionality is low

## Rollback Plan
If issues arise:
1. For alerts: Revert to mock implementation temporarily while fixing
2. For fuel ticket: Keep backup of current file, restore if needed
3. Both changes are additive - mainly replacing mocks with real implementation