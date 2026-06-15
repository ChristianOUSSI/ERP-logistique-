# KAMLOG ERP - API Documentation

## Overview

This document provides comprehensive documentation for all KAMLOG ERP API endpoints with examples.

**Base URL**: `http://localhost:8000/api`

**Authentication**: Bearer Token (JWT)

---

## Authentication

### Register User

**Endpoint**: `POST /api/auth/register`

**Description**: Register a new user account.

**Permissions**: None (public endpoint)

**Rate Limit**: 10 requests per hour

**Request Body**:
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePassword123!",
  "full_name": "John Doe",
  "role": "ADMIN"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "full_name": "John Doe",
  "role": "ADMIN",
  "is_active": true,
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 400: Email already registered
- 400: Username already taken

---

### Login

**Endpoint**: `POST /api/auth/login`

**Description**: Authenticate a user and return JWT tokens.

**Permissions**: None (public endpoint)

**Rate Limit**: 5 requests per minute

**Request Body**:
```json
{
  "username": "johndoe",
  "password": "SecurePassword123!"
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Error Responses**:
- 401: Invalid credentials

---

## Tiers Module

### List All Tiers

**Endpoint**: `GET /api/tiers/`

**Description**: List all tiers with pagination.

**Permissions**: `tiers:read`

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return
- `statut` (string, optional): Filter by status (e.g., "ACTIF")

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/tiers/?skip=0&limit=100&statut=ACTIF" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "code_tiers": "CLI001",
    "niu": "123456789012",
    "raison_sociale": "Example Company",
    "type_tiers": "CLIENT",
    "statut": "ACTIF",
    "limite_credit": 1000000,
    "services_autorises": ["magasin", "transport"],
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Get Tiers by ID

**Endpoint**: `GET /api/tiers/{tiers_id}`

**Description**: Retrieve a specific tier by ID.

**Permissions**: `tiers:read`

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/tiers/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "code_tiers": "CLI001",
  "niu": "123456789012",
  "raison_sociale": "Example Company",
  "type_tiers": "CLIENT",
  "statut": "ACTIF",
  "limite_credit": 1000000,
  "services_autorises": ["magasin", "transport"],
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 404: Tiers not found

---

### Get Tiers by Code

**Endpoint**: `GET /api/tiers/code/{code_tiers}`

**Description**: Retrieve a tier by its code.

**Permissions**: `tiers:read`

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/tiers/code/CLI001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "code_tiers": "CLI001",
  "niu": "123456789012",
  "raison_sociale": "Example Company",
  "type_tiers": "CLIENT",
  "statut": "ACTIF",
  "limite_credit": 1000000,
  "services_autorises": ["magasin", "transport"],
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 404: Tiers not found

---

### Get Tiers by NIU

**Endpoint**: `GET /api/tiers/niu/{niu}`

**Description**: Retrieve a tier by its NIU (Numéro d'Identification Unique).

**Permissions**: `tiers:read`

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/tiers/niu/123456789012" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "code_tiers": "CLI001",
  "niu": "123456789012",
  "raison_sociale": "Example Company",
  "type_tiers": "CLIENT",
  "statut": "ACTIF",
  "limite_credit": 1000000,
  "services_autorises": ["magasin", "transport"],
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 404: Tiers not found

---

### Get Tiers by Service

**Endpoint**: `GET /api/tiers/service/{service}`

**Description**: Retrieve all tiers authorized for a specific service.

**Permissions**: `tiers:read`

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/tiers/service/magasin" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "code_tiers": "CLI001",
    "niu": "123456789012",
    "raison_sociale": "Example Company",
    "type_tiers": "CLIENT",
    "statut": "ACTIF",
    "limite_credit": 1000000,
    "services_autorises": ["magasin", "transport"],
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Create Tiers

**Endpoint**: `POST /api/tiers/`

**Description**: Create a new tier.

**Permissions**: `tiers:write`, Role: ADMIN, DISPATCHER, FINANCE

**Request Body**:
```json
{
  "code_tiers": "CLI002",
  "niu": "123456789013",
  "raison_sociale": "New Company",
  "type_tiers": "CLIENT",
  "adresse": "123 Main St",
  "telephone": "+237 123 456 789",
  "email": "newcompany@example.com",
  "limite_credit": 500000
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "code_tiers": "CLI002",
  "niu": "123456789013",
  "raison_sociale": "New Company",
  "type_tiers": "CLIENT",
  "statut": "ACTIF",
  "limite_credit": 500000,
  "services_autorises": [],
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 400: Invalid data

---

### Update Tiers

**Endpoint**: `PUT /api/tiers/{tiers_id}`

**Description**: Update an existing tier.

**Permissions**: `tiers:write`, Role: ADMIN, DISPATCHER, FINANCE

**Request Body**:
```json
{
  "raison_sociale": "Updated Company Name",
  "telephone": "+237 987 654 321"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "code_tiers": "CLI001",
  "niu": "123456789012",
  "raison_sociale": "Updated Company Name",
  "type_tiers": "CLIENT",
  "statut": "ACTIF",
  "limite_credit": 1000000,
  "services_autorises": ["magasin", "transport"],
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 404: Tiers not found

---

### Delete Tiers

**Endpoint**: `DELETE /api/tiers/{tiers_id}`

**Description**: Delete a tier.

**Permissions**: `tiers:delete`, Role: ADMIN

**Request Example**:
```bash
curl -X DELETE "http://localhost:8000/api/tiers/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (204 No Content)

**Error Responses**:
- 404: Tiers not found

---

### Activate Tiers

**Endpoint**: `POST /api/tiers/{tiers_id}/activer`

**Description**: Activate a tier.

**Permissions**: `tiers:write`, Role: ADMIN

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/tiers/1/activer" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "code_tiers": "CLI001",
  "niu": "123456789012",
  "raison_sociale": "Example Company",
  "type_tiers": "CLIENT",
  "statut": "ACTIF",
  "limite_credit": 1000000,
  "services_autorises": ["magasin", "transport"],
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 404: Tiers not found

---

### Block Tiers

**Endpoint**: `POST /api/tiers/{tiers_id}/bloquer`

**Description**: Block a tier.

**Permissions**: `tiers:write`, Role: ADMIN

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/tiers/1/bloquer" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "code_tiers": "CLI001",
  "niu": "123456789012",
  "raison_sociale": "Example Company",
  "type_tiers": "CLIENT",
  "statut": "BLOQUE",
  "limite_credit": 1000000,
  "services_autorises": ["magasin", "transport"],
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 404: Tiers not found

---

### Deactivate Tiers

**Endpoint**: `POST /api/tiers/{tiers_id}/desactiver`

**Description**: Deactivate a tier.

**Permissions**: `tiers:write`, Role: ADMIN

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/tiers/1/desactiver" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "code_tiers": "CLI001",
  "niu": "123456789012",
  "raison_sociale": "Example Company",
  "type_tiers": "CLIENT",
  "statut": "INACTIF",
  "limite_credit": 1000000,
  "services_autorises": ["magasin", "transport"],
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 404: Tiers not found

---

### Authorize Service for Tiers

**Endpoint**: `POST /api/tiers/{tiers_id}/autoriser/{service}`

**Description**: Authorize a service for a tier.

**Permissions**: `tiers:write`, Role: ADMIN

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/tiers/1/autoriser/magasin" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "code_tiers": "CLI001",
  "niu": "123456789012",
  "raison_sociale": "Example Company",
  "type_tiers": "CLIENT",
  "statut": "ACTIF",
  "limite_credit": 1000000,
  "services_autorises": ["magasin", "transport"],
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 404: Tiers not found

---

### Revoke Service from Tiers

**Endpoint**: `POST /api/tiers/{tiers_id}/revoquer/{service}`

**Description**: Revoke a service from a tier.

**Permissions**: `tiers:write`, Role: ADMIN

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/tiers/1/revoquer/magasin" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "code_tiers": "CLI001",
  "niu": "123456789012",
  "raison_sociale": "Example Company",
  "type_tiers": "CLIENT",
  "statut": "ACTIF",
  "limite_credit": 1000000,
  "services_autorises": ["transport"],
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 404: Tiers not found

---

### Update Credit Limit

**Endpoint**: `POST /api/tiers/{tiers_id}/limite-credit`

**Description**: Update the credit limit for a tier.

**Permissions**: `tiers:write`, Role: ADMIN, FINANCE

**Request Body**:
```json
{
  "nouvelle_limite": 2000000
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "code_tiers": "CLI001",
  "niu": "123456789012",
  "raison_sociale": "Example Company",
  "type_tiers": "CLIENT",
  "statut": "ACTIF",
  "limite_credit": 2000000,
  "services_autorises": ["magasin", "transport"],
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 404: Tiers not found

---

### Search Tiers

**Endpoint**: `GET /api/tiers/recherche/{terme}`

**Description**: Search tiers by term (searches in code, NIU, company name).

**Permissions**: `tiers:read`

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/tiers/recherche/Example" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "code_tiers": "CLI001",
    "niu": "123456789012",
    "raison_sociale": "Example Company",
    "type_tiers": "CLIENT",
    "statut": "ACTIF",
    "limite_credit": 1000000,
    "services_autorises": ["magasin", "transport"],
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

## Parc Module

### List All Zones

**Endpoint**: `GET /api/parc/zones`

**Description**: List all zones in the parc.

**Permissions**: `parc:read`

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/parc/zones?skip=0&limit=100" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "code_zone": "ZONE-A",
    "nom_zone": "Zone A",
    "capacite": 100,
    "est_actif": true,
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Get Zone by ID

**Endpoint**: `GET /api/parc/zones/{zone_id}`

**Description**: Retrieve a specific zone by ID.

**Permissions**: `parc:read`

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/parc/zones/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "code_zone": "ZONE-A",
  "nom_zone": "Zone A",
  "capacite": 100,
  "est_actif": true,
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 404: Zone introuvable

---

### Create Zone

**Endpoint**: `POST /api/parc/zones`

**Description**: Create a new zone.

**Permissions**: `parc:write`, Role: ADMIN

**Request Body**:
```json
{
  "code_zone": "ZONE-B",
  "nom_zone": "Zone B",
  "capacite": 150,
  "description": "Nouvelle zone de stockage"
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "code_zone": "ZONE-B",
  "nom_zone": "Zone B",
  "capacite": 150,
  "description": "Nouvelle zone de stockage",
  "est_actif": true,
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Update Zone

**Endpoint**: `PUT /api/parc/zones/{zone_id}`

**Description**: Update an existing zone.

**Permissions**: `parc:write`, Role: ADMIN

**Request Body**:
```json
{
  "nom_zone": "Zone B Updated",
  "capacite": 200
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "code_zone": "ZONE-A",
  "nom_zone": "Zone B Updated",
  "capacite": 200,
  "est_actif": true,
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 404: Zone introuvable

---

### Delete Zone

**Endpoint**: `DELETE /api/parc/zones/{zone_id}`

**Description**: Delete a zone.

**Permissions**: `parc:delete`, Role: ADMIN

**Request Example**:
```bash
curl -X DELETE "http://localhost:8000/api/parc/zones/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (204 No Content)

**Error Responses**:
- 404: Zone introuvable

---

### List All Emplacements

**Endpoint**: `GET /api/parc/emplacements`

**Description**: List all emplacements in the parc.

**Permissions**: `parc:read`

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return
- `zone_id` (int, optional): Filter by zone ID
- `statut` (string, optional): Filter by status

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/parc/emplacements?skip=0&limit=100&zone_id=1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "code_emplacement": "EMP-001",
    "zone_id": 1,
    "type_emplacement": "STOCKAGE",
    "statut": "OCCUPE",
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Gate In

**Endpoint**: `POST /api/parc/gate-in`

**Description**: Register a vehicle entering the parc.

**Permissions**: `parc:write`, Role: ADMIN, GATE_AGENT

**Request Body**:
```json
{
  "immatriculation": "LT-123-AB",
  "type_vehicule": "CAMION",
  "chauffeur_nom": "John Doe",
  "mission_id": 1
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "immatriculation": "LT-123-AB",
  "type_vehicule": "CAMION",
  "date_entree": "2026-06-09T04:00:00Z",
  "statut": "ENTRE"
}
```

---

### Gate Out

**Endpoint**: `POST /api/parc/gate-out`

**Description**: Register a vehicle leaving the parc.

**Permissions**: `parc:write`, Role: ADMIN, GATE_AGENT

**Request Body**:
```json
{
  "immatriculation": "LT-123-AB",
  "motif_sortie": "LIVRAISON"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "immatriculation": "LT-123-AB",
  "date_sortie": "2026-06-09T04:00:00Z",
  "statut": "SORTI"
}
```

---

## Finance Module

### List All Invoices

**Endpoint**: `GET /api/finance/factures`

**Description**: List all invoices.

**Permissions**: `finance:read`

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return
- `statut` (string, optional): Filter by status (e.g., "non_soldees")

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/finance/factures?skip=0&limit=100&statut=non_soldees" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "numero_facture": "FAC-2026-0001",
    "tiers_id": 1,
    "montant_ht_xaf": 100000,
    "tva_xaf": 19250,
    "montant_ttc_xaf": 119250,
    "statut": "EN_ATTENTE",
    "date_facture": "2026-06-09T04:00:00Z",
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Get Invoice by ID

**Endpoint**: `GET /api/finance/factures/{facture_id}`

**Description**: Retrieve a specific invoice by ID.

**Permissions**: `finance:read`

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/finance/factures/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "numero_facture": "FAC-2026-0001",
  "tiers_id": 1,
  "montant_ht_xaf": 100000,
  "tva_xaf": 19250,
  "montant_ttc_xaf": 119250,
  "statut": "EN_ATTENTE",
  "date_facture": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 404: Facture introuvable

---

### Get Invoices by Tiers

**Endpoint**: `GET /api/finance/factures/tiers/{tiers_id}`

**Description**: Retrieve all invoices for a specific tier.

**Permissions**: `finance:read`

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/finance/factures/tiers/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "numero_facture": "FAC-2026-0001",
    "tiers_id": 1,
    "montant_ht_xaf": 100000,
    "tva_xaf": 19250,
    "montant_ttc_xaf": 119250,
    "statut": "EN_ATTENTE",
    "date_facture": "2026-06-09T04:00:00Z",
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Create Invoice

**Endpoint**: `POST /api/finance/factures`

**Description**: Create a new invoice.

**Permissions**: `finance:write`, Role: ADMIN, FINANCE

**Request Body**:
```json
{
  "tiers_id": 1,
  "montant_ht_xaf": 100000,
  "date_facture": "2026-06-09",
  "description": "Invoice for services"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "numero_facture": "FAC-2026-0001",
  "tiers_id": 1,
  "montant_ht_xaf": 100000,
  "tva_xaf": 19250,
  "montant_ttc_xaf": 119250,
  "statut": "EN_ATTENTE",
  "date_facture": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 402: Payment Required (credit limit exceeded)
- 400: Invalid data

---

### Update Invoice

**Endpoint**: `PUT /api/finance/factures/{facture_id}`

**Description**: Update an existing invoice.

**Permissions**: `finance:write`, Role: ADMIN, FINANCE

**Request Body**:
```json
{
  "montant_ht_xaf": 150000,
  "description": "Updated description"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "numero_facture": "FAC-2026-0001",
  "tiers_id": 1,
  "montant_ht_xaf": 150000,
  "tva_xaf": 28875,
  "montant_ttc_xaf": 178875,
  "statut": "EN_ATTENTE",
  "date_facture": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 404: Facture introuvable

---

### Delete Invoice

**Endpoint**: `DELETE /api/finance/factures/{facture_id}`

**Description**: Delete an invoice.

**Permissions**: `finance:delete`, Role: ADMIN

**Request Example**:
```bash
curl -X DELETE "http://localhost:8000/api/finance/factures/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (204 No Content)

**Error Responses**:
- 404: Facture introuvable

---

### Validate Invoice

**Endpoint**: `POST /api/finance/factures/{facture_id}/valider`

**Description**: Validate an invoice.

**Permissions**: `finance:write`, Role: ADMIN, FINANCE

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/finance/factures/1/valider" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "numero_facture": "FAC-2026-0001",
  "tiers_id": 1,
  "montant_ht_xaf": 100000,
  "tva_xaf": 19250,
  "montant_ttc_xaf": 119250,
  "statut": "VALIDEE",
  "date_facture": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Cancel Invoice

**Endpoint**: `POST /api/finance/factures/{facture_id}/annuler`

**Description**: Cancel an invoice.

**Permissions**: `finance:write`, Role: ADMIN, FINANCE

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/finance/factures/1/annuler" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "numero_facture": "FAC-2026-0001",
  "tiers_id": 1,
  "montant_ht_xaf": 100000,
  "tva_xaf": 19250,
  "montant_ttc_xaf": 119250,
  "statut": "ANNULEE",
  "date_facture": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### List All Payments

**Endpoint**: `GET /api/finance/encaissements`

**Description**: List all payments.

**Permissions**: `finance:read`

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/finance/encaissements?skip=0&limit=100" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "facture_id": 1,
    "montant_xaf": 119250,
    "mode_paiement": "VIREMENT",
    "statut": "LETTRÉ",
    "date_paiement": "2026-06-09T04:00:00Z",
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Create Payment

**Endpoint**: `POST /api/finance/encaissements`

**Description**: Create a new payment.

**Permissions**: `finance:write`, Role: ADMIN, FINANCE

**Request Body**:
```json
{
  "facture_id": 1,
  "montant_xaf": 119250,
  "mode_paiement": "VIREMENT",
  "reference_paiement": "REF-123456"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "facture_id": 1,
  "montant_xaf": 119250,
  "mode_paiement": "VIREMENT",
  "statut": "NON_LETTRE",
  "date_paiement": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Letter Payment

**Endpoint**: `POST /api/finance/encaissements/{encaissement_id}/lettrer`

**Description**: Letter a payment to its invoice.

**Permissions**: `finance:write`, Role: ADMIN, FINANCE

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/finance/encaissements/1/lettrer" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "facture_id": 1,
  "montant_xaf": 119250,
  "mode_paiement": "VIREMENT",
  "statut": "LETTRÉ",
  "date_paiement": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Calculate Outstanding Balance

**Endpoint**: `GET /api/finance/encours/{tiers_id}`

**Description**: Calculate the outstanding balance for a client.

**Permissions**: `finance:read`

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/finance/encours/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "tiers_id": 1,
  "encours_total": 500000,
  "limite_credit": 1000000,
  "disponible": 500000,
  "factures_non_soldées": 5
}
```

---

## Transport Module

### List All Trucks

**Endpoint**: `GET /api/transport/camions`

**Description**: List all trucks in the fleet.

**Permissions**: `transport:read`

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return
- `statut` (string, optional): Filter by status (e.g., "DISPONIBLE")

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/transport/camions?skip=0&limit=100&statut=DISPONIBLE" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "immatriculation": "LT-123-AB",
    "type_vehicule": "PORTE_CONTENEUR",
    "statut": "DISPONIBLE",
    "conso_theorique_l_100": 35.0,
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Get Truck by ID

**Endpoint**: `GET /api/transport/camions/{camion_id}`

**Description**: Retrieve a specific truck by ID.

**Permissions**: `transport:read`

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/transport/camions/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "immatriculation": "LT-123-AB",
  "type_vehicule": "PORTE_CONTENEUR",
  "statut": "DISPONIBLE",
  "conso_theorique_l_100": 35.0,
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 404: Camion introuvable

---

### Create Truck

**Endpoint**: `POST /api/transport/camions`

**Description**: Add a new truck to the fleet.

**Permissions**: `transport:write`, Role: ADMIN, DISPATCHER

**Request Body**:
```json
{
  "immatriculation": "LT-456-CD",
  "type_vehicule": "BENNE_VRAC",
  "statut": "DISPONIBLE",
  "conso_theorique_l_100": 40.0,
  "capacite_tonne": 25
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "immatriculation": "LT-456-CD",
  "type_vehicule": "BENNE_VRAC",
  "statut": "DISPONIBLE",
  "conso_theorique_l_100": 40.0,
  "capacite_tonne": 25,
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 400: Immatriculation already exists

---

### Update Truck

**Endpoint**: `PUT /api/transport/camions/{camion_id}`

**Description**: Update an existing truck.

**Permissions**: `transport:write`, Role: ADMIN, DISPATCHER

**Request Body**:
```json
{
  "statut": "EN_MAINTENANCE",
  "conso_theorique_l_100": 38.0
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "immatriculation": "LT-123-AB",
  "type_vehicule": "PORTE_CONTENEUR",
  "statut": "EN_MAINTENANCE",
  "conso_theorique_l_100": 38.0,
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 404: Camion introuvable

---

### Delete Truck

**Endpoint**: `DELETE /api/transport/camions/{camion_id}`

**Description**: Delete a truck.

**Permissions**: `transport:delete`, Role: ADMIN

**Request Example**:
```bash
curl -X DELETE "http://localhost:8000/api/transport/camions/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (204 No Content)

**Error Responses**:
- 404: Camion introuvable

---

### Set Truck to Maintenance

**Endpoint**: `POST /api/transport/camions/{camion_id}/maintenance`

**Description**: Set a truck to maintenance status.

**Permissions**: `transport:write`, Role: ADMIN, DISPATCHER

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/transport/camions/1/maintenance" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "immatriculation": "LT-123-AB",
  "type_vehicule": "PORTE_CONTENEUR",
  "statut": "EN_MAINTENANCE",
  "conso_theorique_l_100": 35.0,
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Set Truck to Available

**Endpoint**: `POST /api/transport/camions/{camion_id}/disponible`

**Description**: Set a truck to available status.

**Permissions**: `transport:write`, Role: ADMIN, DISPATCHER

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/transport/camions/1/disponible" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "immatriculation": "LT-123-AB",
  "type_vehicule": "PORTE_CONTENEUR",
  "statut": "DISPONIBLE",
  "conso_theorique_l_100": 35.0,
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### List All Drivers

**Endpoint**: `GET /api/transport/chauffeurs`

**Description**: List all drivers.

**Permissions**: `transport:read`

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/transport/chauffeurs?skip=0&limit=100" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "nom": "John Doe",
    "telephone": "+237 123 456 789",
    "permis_conduire": "B123456",
    "statut": "DISPONIBLE",
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Get Driver by ID

**Endpoint**: `GET /api/transport/chauffeurs/{chauffeur_id}`

**Description**: Retrieve a specific driver by ID.

**Permissions**: `transport:read`

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/transport/chauffeurs/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "nom": "John Doe",
  "telephone": "+237 123 456 789",
  "permis_conduire": "B123456",
  "statut": "DISPONIBLE",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Create Driver

**Endpoint**: `POST /api/transport/chauffeurs`

**Description**: Create a new driver.

**Permissions**: `transport:write`, Role: ADMIN, DISPATCHER

**Request Body**:
```json
{
  "nom": "Jane Smith",
  "telephone": "+237 987 654 321",
  "permis_conduire": "B789012",
  "statut": "DISPONIBLE"
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "nom": "Jane Smith",
  "telephone": "+237 987 654 321",
  "permis_conduire": "B789012",
  "statut": "DISPONIBLE",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### List All Missions

**Endpoint**: `GET /api/transport/missions`

**Description**: List all transport missions.

**Permissions**: `transport:read`

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/transport/missions?skip=0&limit=100" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "reference": "MISS-2026-0001",
    "tiers_id": 1,
    "camion_id": 1,
    "chauffeur_id": 1,
    "statut": "EN_ROUTE",
    "distance_km": 150,
    "date_depart": "2026-06-09T04:00:00Z",
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Create Mission

**Endpoint**: `POST /api/transport/missions`

**Description**: Create a new transport mission.

**Permissions**: `transport:write`, Role: ADMIN, DISPATCHER

**Request Body**:
```json
{
  "tiers_id": 1,
  "camion_id": 1,
  "chauffeur_id": 1,
  "type_marchandise": "CONTENEUR_20",
  "distance_km": 150,
  "adresse_livraison": "123 Delivery St"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "reference": "MISS-2026-0001",
  "tiers_id": 1,
  "camion_id": 1,
  "chauffeur_id": 1,
  "statut": "PLANIFIEE",
  "type_marchandise": "CONTENEUR_20",
  "distance_km": 150,
  "adresse_livraison": "123 Delivery St",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Start Mission

**Endpoint**: `POST /api/transport/missions/{mission_id}/demarrer`

**Description**: Start a mission (set to EN_ROUTE).

**Permissions**: `transport:write`, Role: ADMIN, DISPATCHER

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/transport/missions/1/demarrer" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "reference": "MISS-2026-0001",
  "tiers_id": 1,
  "camion_id": 1,
  "chauffeur_id": 1,
  "statut": "EN_ROUTE",
  "date_depart": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Complete Mission

**Endpoint**: `POST /api/transport/missions/{mission_id}/terminer`

**Description**: Complete a mission (set to TERMINEE).

**Permissions**: `transport:write`, Role: ADMIN, DISPATCHER

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/transport/missions/1/terminer" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "reference": "MISS-2026-0001",
  "tiers_id": 1,
  "camion_id": 1,
  "chauffeur_id": 1,
  "statut": "TERMINEE",
  "date_arrivee": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### List Delivery Bands

**Endpoint**: `GET /api/transport/bandes`

**Description**: List all delivery bands.

**Permissions**: `transport:read`

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/transport/bandes?skip=0&limit=100" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "numero_bande": "BLD-2026-0001",
    "mission_id": 1,
    "statut": "EN_COURS",
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

## Magasin Module

### List All Warehouses

**Endpoint**: `GET /api/magasin/magasins`

**Description**: List all active warehouses.

**Permissions**: None (public endpoint)

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/magasin/magasins?skip=0&limit=100"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "code": "MAG-001",
    "nom": "Principal Warehouse",
    "adresse": "123 Warehouse St",
    "est_actif": true,
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Get Warehouse by ID

**Endpoint**: `GET /api/magasin/magasins/{magasin_id}`

**Description**: Retrieve a specific warehouse by ID.

**Permissions**: None (public endpoint)

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/magasin/magasins/1"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "code": "MAG-001",
  "nom": "Principal Warehouse",
  "adresse": "123 Warehouse St",
  "est_actif": true,
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 404: Magasin non trouvé

---

### Create Warehouse

**Endpoint**: `POST /api/magasin/magasins`

**Description**: Create a new warehouse.

**Permissions**: `magasin:create`

**Rate Limit**: 10 requests per minute

**Request Body**:
```json
{
  "code": "MAG-002",
  "nom": "Secondary Warehouse",
  "adresse": "456 Storage Ave"
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "code": "MAG-002",
  "nom": "Secondary Warehouse",
  "adresse": "456 Storage Ave",
  "est_actif": true,
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### List All Clients

**Endpoint**: `GET /api/magasin/clients`

**Description**: List all active clients.

**Permissions**: None (public endpoint)

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/magasin/clients?skip=0&limit=100"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "code": "CLI-001",
    "nom": "Example Client",
    "telephone": "+237 123 456 789",
    "est_actif": true,
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### List All Articles

**Endpoint**: `GET /api/magasin/articles`

**Description**: List all active articles.

**Permissions**: None (public endpoint)

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/magasin/articles?skip=0&limit=100"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "code_article": "1000001",
    "nom": "Product A",
    "description": "Description of Product A",
    "poids_unitaire": 10.5,
    "volume_unitaire": 0.5,
    "est_actif": true,
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Search Articles

**Endpoint**: `GET /api/magasin/articles/recherche/{query}`

**Description**: Search articles by term (searches in code and name).

**Permissions**: None (public endpoint)

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/magasin/articles/recherche/Product"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "code_article": "1000001",
    "nom": "Product A",
    "description": "Description of Product A",
    "poids_unitaire": 10.5,
    "volume_unitaire": 0.5,
    "est_actif": true,
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### List All Declarations

**Endpoint**: `GET /api/magasin/declarations`

**Description**: List all declarations (Bill of Lading).

**Permissions**: None (public endpoint)

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/magasin/declarations?skip=0&limit=100"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "numero_bl": "BL-2026-0001",
    "client_id": 1,
    "statut": "EN_ATTENTE",
    "date_declaration": "2026-06-09T04:00:00Z",
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Create Declaration

**Endpoint**: `POST /api/magasin/declarations`

**Description**: Create a new declaration.

**Permissions**: `magasin:create`

**Request Body**:
```json
{
  "client_id": 1,
  "date_declaration": "2026-06-09",
  "lignes": [
    {
      "article_id": 1,
      "quantite_declaree": 100,
      "unite_mesure": "UDB"
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "numero_bl": "BL-2026-0001",
  "client_id": 1,
  "statut": "EN_ATTENTE",
  "date_declaration": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Validate Declaration

**Endpoint**: `POST /api/magasin/declarations/{declaration_id}/valider`

**Description**: Validate a declaration.

**Permissions**: `magasin:update`

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/magasin/declarations/1/valider"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "numero_bl": "BL-2026-0001",
  "client_id": 1,
  "statut": "VALIDEE",
  "date_declaration": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Cancel Declaration

**Endpoint**: `POST /api/magasin/declarations/{declaration_id}/annuler`

**Description**: Cancel a declaration.

**Permissions**: `magasin:update`

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/magasin/declarations/1/annuler"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "numero_bl": "BL-2026-0001",
  "client_id": 1,
  "statut": "ANNULEE",
  "date_declaration": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### List All Receptions

**Endpoint**: `GET /api/magasin/receptions`

**Description**: List all goods receptions.

**Permissions**: None (public endpoint)

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/magasin/receptions?skip=0&limit=100"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "numero_reception": "REC-2026-0001",
    "declaration_id": 1,
    "magasin_id": 1,
    "statut": "EN_COURS",
    "date_reception": "2026-06-09T04:00:00Z",
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Create Reception

**Endpoint**: `POST /api/magasin/receptions`

**Description**: Create a new goods reception.

**Permissions**: `magasin:create`

**Request Body**:
```json
{
  "declaration_id": 1,
  "magasin_id": 1,
  "date_reception": "2026-06-09",
  "lignes": [
    {
      "article_id": 1,
      "quantite_recue": 100,
      "unite_mesure": "UDB"
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "numero_reception": "REC-2026-0001",
  "declaration_id": 1,
  "magasin_id": 1,
  "statut": "EN_COURS",
  "date_reception": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Complete Reception

**Endpoint**: `POST /api/magasin/receptions/{reception_id}/completer`

**Description**: Mark a reception as complete.

**Permissions**: `magasin:update`

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/magasin/receptions/1/completer"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "numero_reception": "REC-2026-0001",
  "declaration_id": 1,
  "magasin_id": 1,
  "statut": "COMPLETEE",
  "date_reception": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Cancel Reception

**Endpoint**: `POST /api/magasin/receptions/{reception_id}/annuler`

**Description**: Cancel a reception.

**Permissions**: `magasin:update`

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/magasin/receptions/1/annuler"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "numero_reception": "REC-2026-0001",
  "declaration_id": 1,
  "magasin_id": 1,
  "statut": "ANNULEE",
  "date_reception": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### List All Stocks

**Endpoint**: `GET /api/magasin/stocks`

**Description**: List all stock entries.

**Permissions**: None (public endpoint)

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/magasin/stocks?skip=0&limit=100"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "magasin_id": 1,
    "article_id": 1,
    "quantite_disponible": 500,
    "quantite_udb": 500,
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Filter Stocks

**Endpoint**: `POST /api/magasin/stocks/filtrer`

**Description**: Filter stocks by multiple criteria.

**Permissions**: None (public endpoint)

**Request Body**:
```json
{
  "code_article": "1000001",
  "magasin_id": 1,
  "date_debut": "2026-06-01",
  "date_fin": "2026-06-30"
}
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "magasin_id": 1,
    "article_id": 1,
    "quantite_disponible": 500,
    "quantite_udb": 500,
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### List All Orders

**Endpoint**: `GET /api/magasin/commandes`

**Description**: List all orders.

**Permissions**: None (public endpoint)

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/magasin/commandes?skip=0&limit=100"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "numero_commande": "CMD-2026-0001",
    "client_id": 1,
    "statut": "EN_ATTENTE",
    "est_verrouille": false,
    "paiement_valide": false,
    "date_commande": "2026-06-09T04:00:00Z",
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Create Order

**Endpoint**: `POST /api/magasin/commandes`

**Description**: Create a new order.

**Permissions**: `magasin:create`

**Request Body**:
```json
{
  "client_id": 1,
  "date_commande": "2026-06-09",
  "date_livraison_souhaitee": "2026-06-15",
  "lignes": [
    {
      "article_id": 1,
      "quantite_demandee": 50,
      "unite_mesure": "UDB",
      "prix_unitaire": 1000
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "numero_commande": "CMD-2026-0001",
  "client_id": 1,
  "statut": "EN_ATTENTE",
  "est_verrouille": false,
  "paiement_valide": false,
  "date_commande": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Validate Payment

**Endpoint**: `POST /api/magasin/commandes/{commande_id}/valider-paiement`

**Description**: Validate payment for an order.

**Permissions**: `magasin:update`

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/magasin/commandes/1/valider-paiement"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "numero_commande": "CMD-2026-0001",
  "client_id": 1,
  "statut": "PAYEE",
  "est_verrouille": false,
  "paiement_valide": true,
  "date_commande": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Set to Preparation

**Endpoint**: `POST /api/magasin/commandes/{commande_id}/preparation`

**Description**: Set order to preparation status.

**Permissions**: `magasin:update`

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/magasin/commandes/1/preparation"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "numero_commande": "CMD-2026-0001",
  "client_id": 1,
  "statut": "EN_PREPARATION",
  "est_verrouille": false,
  "paiement_valide": true,
  "date_commande": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Mark as Ready

**Endpoint**: `POST /api/magasin/commandes/{commande_id}/prete`

**Description**: Mark order as ready.

**Permissions**: `magasin:update`

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/magasin/commandes/1/prete"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "numero_commande": "CMD-2026-0001",
  "client_id": 1,
  "statut": "PRETE",
  "est_verrouille": false,
  "paiement_valide": true,
  "date_commande": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Mark as Delivered

**Endpoint**: `POST /api/magasin/commandes/{commande_id}/livree`

**Description**: Mark order as delivered.

**Permissions**: `magasin:update`

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/magasin/commandes/1/livree"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "numero_commande": "CMD-2026-0001",
  "client_id": 1,
  "statut": "LIVREE",
  "est_verrouille": false,
  "paiement_valide": true,
  "date_commande": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Cancel Order

**Endpoint**: `POST /api/magasin/commandes/{commande_id}/annuler`

**Description**: Cancel an order.

**Permissions**: `magasin:update`

**Request Example**:
```bash
curl -X POST "http://localhost:8000/api/magasin/commandes/1/annuler"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "numero_commande": "CMD-2026-0001",
  "client_id": 1,
  "statut": "ANNULEE",
  "est_verrouille": false,
  "paiement_valide": false,
  "date_commande": "2026-06-09T04:00:00Z",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### List All Delivery Bands

**Endpoint**: `GET /api/magasin/bandes`

**Description**: List all delivery bands.

**Permissions**: None (public endpoint)

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/magasin/bandes?skip=0&limit=100"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "numero_bande": "BLD-2026-0001",
    "commande_id": 1,
    "magasin_id": 1,
    "statut": "EN_COURS",
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Create Delivery Band

**Endpoint**: `POST /api/magasin/bandes`

**Description**: Create a new delivery band.

**Permissions**: `magasin:create`

**Request Body**:
```json
{
  "commande_id": 1,
  "magasin_id": 1,
  "lignes": [
    {
      "article_id": 1,
      "quantite": 50,
      "unite_mesure": "UDB"
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "numero_bande": "BLD-2026-0001",
  "commande_id": 1,
  "magasin_id": 1,
  "statut": "EN_COURS",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

## Alerts Module

### Check Fuel Siphoning Alerts

**Endpoint**: `GET /api/alerts/fuel-siphoning`

**Description**: Check for fuel siphoning alerts (fuel consumption deviation > 10%).

**Permissions**: Role: ADMIN, DISPATCHER

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/alerts/fuel-siphoning" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
[
  {
    "mission_id": 1,
    "reference": "MISS-2026-0001",
    "type_alerte": "SIPHONNAGE_CARBURANT",
    "message": "Écart carburant de 15.5% détecté pour la mission MISS-2026-0001",
    "gravite": "WARNING",
    "date_alerte": "2026-06-09T04:00:00Z"
  }
]
```

---

### Check Credit Limit Alerts

**Endpoint**: `GET /api/alerts/credit-limit`

**Description**: Check for credit limit exceeded alerts.

**Permissions**: Role: ADMIN, FINANCE

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/alerts/credit-limit" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
[
  {
    "tiers_id": 1,
    "code_tiers": "CLI001",
    "raison_sociale": "Example Company",
    "encours": 950000,
    "limite_credit": 1000000,
    "utilisation": 95.0,
    "type_alerte": "LIMITE_CREDIT",
    "message": "Limite de crédit à 95% pour CLI001",
    "gravite": "WARNING",
    "date_alerte": "2026-06-09T04:00:00Z"
  }
]
```

---

## Documents Module

### Generate Bill of Lading PDF

**Endpoint**: `POST /api/documents/bl`

**Description**: Generate a Bill of Lading PDF for a mission.

**Permissions**: Role: ADMIN, DISPATCHER, FINANCE

**Request Body**:
```json
{
  "mission_id": 1
}
```

**Response** (200 OK):
- Content-Type: application/pdf
- Content-Disposition: attachment; filename=BL_MISS-2026-0001.pdf

---

### Generate Invoice PDF

**Endpoint**: `POST /api/documents/facture/{facture_id}`

**Description**: Generate an invoice PDF.

**Permissions**: Role: ADMIN, FINANCE

**Response** (200 OK):
- Content-Type: application/pdf
- Content-Disposition: attachment; filename=Facture_FAC-2026-0001.pdf

---

### Generate Interchange PDF

**Endpoint**: `POST /api/documents/interchange`

**Description**: Generate an Interchange PDF.

**Permissions**: Role: ADMIN, GATE_AGENT

**Query Parameters**:
- `conteneur_id` (int): Container ID

**Response** (200 OK):
```json
{
  "message": "Interchange generation not yet implemented",
  "conteneur_id": 1
}
```

---

## Gateway Module

### Create Gateway

**Endpoint**: `POST /api/gateway/passerelles`

**Description**: Create a new gateway between modules.

**Permissions**: admin

**Request Body**:
```json
{
  "source_module": "magasin",
  "source_id": 1,
  "cible_module": "transport",
  "cible_id": 1,
  "type_passerelle": "COMMANDE_LIVRAISON",
  "statut": "EN_ATTENTE"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "source_module": "magasin",
  "source_id": 1,
  "cible_module": "transport",
  "cible_id": 1,
  "type_passerelle": "COMMANDE_LIVRAISON",
  "statut": "EN_ATTENTE",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Get Gateway by ID

**Endpoint**: `GET /api/gateway/passerelles/{passerelle_id}`

**Description**: Retrieve a specific gateway by ID.

**Permissions**: admin

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/gateway/passerelles/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "source_module": "magasin",
  "source_id": 1,
  "cible_module": "transport",
  "cible_id": 1,
  "type_passerelle": "COMMANDE_LIVRAISON",
  "statut": "EN_ATTENTE",
  "created_at": "2026-06-09T04:00:00Z"
}
```

**Error Responses**:
- 404: Passerelle not found

---

### Get Gateways by Source

**Endpoint**: `GET /api/gateway/passerelles/source/{source_module}/{source_id}`

**Description**: Retrieve all gateways for a given source.

**Permissions**: admin

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/gateway/passerelles/source/magasin/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "source_module": "magasin",
    "source_id": 1,
    "cible_module": "transport",
    "cible_id": 1,
    "type_passerelle": "COMMANDE_LIVRAISON",
    "statut": "EN_ATTENTE",
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Get Gateways by Target

**Endpoint**: `GET /api/gateway/passerelles/cible/{cible_module}/{cible_id}`

**Description**: Retrieve all gateways for a given target.

**Permissions**: admin

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/gateway/passerelles/cible/transport/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "source_module": "magasin",
    "source_id": 1,
    "cible_module": "transport",
    "cible_id": 1,
    "type_passerelle": "COMMANDE_LIVRAISON",
    "statut": "EN_ATTENTE",
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Get Pending Gateways

**Endpoint**: `GET /api/gateway/passerelles/en-attente`

**Description**: Retrieve all gateways waiting for processing.

**Permissions**: admin

**Request Example**:
```bash
curl -X GET "http://localhost:8000/api/gateway/passerelles/en-attente" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "source_module": "magasin",
    "source_id": 1,
    "cible_module": "transport",
    "cible_id": 1,
    "type_passerelle": "COMMANDE_LIVRAISON",
    "statut": "EN_ATTENTE",
    "created_at": "2026-06-09T04:00:00Z"
  }
]
```

---

### Update Gateway

**Endpoint**: `PUT /api/gateway/passerelles/{passerelle_id}`

**Description**: Update an existing gateway.

**Permissions**: admin

**Request Body**:
```json
{
  "statut": "TRAITEE",
  "donnees_transfert": {}
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "source_module": "magasin",
  "source_id": 1,
  "cible_module": "transport",
  "cible_id": 1,
  "type_passerelle": "COMMANDE_LIVRAISON",
  "statut": "TRAITEE",
  "created_at": "2026-06-09T04:00:00Z"
}
```

---

### Delete Gateway

**Endpoint**: `DELETE /api/gateway/passerelles/{passerelle_id}`

**Description**: Delete a gateway.

**Permissions**: admin

**Request Example**:
```bash
curl -X DELETE "http://localhost:8000/api/gateway/passerelles/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response** (204 No Content)

---

## Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Permission denied"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "field_name"],
      "msg": "field is required",
      "type": "value_error.missing"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## New Modules (Added 15 Juin 2026)

### Goods Declaration Module

#### List All Goods Declarations

**Endpoint**: `GET /api/transport/goods-declarations`

**Description**: List all goods declarations with pagination.

**Permissions**: `transport:read`

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return
- `statut` (string, optional): Filter by status

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "numero_declaration": "DEC-2026-001",
    "article_id": 1,
    "quantite": 100,
    "unite": "KG",
    "poids": 1000.0,
    "valeur": 50000.0,
    "devise": "XAF",
    "incoterm": "FOB",
    "port_depart": "Douala",
    "port_arrivee": "Paris",
    "date_declaration": "2026-06-15T00:00:00Z",
    "statut": "VALIDEE",
    "declaration_douaniere": "DCL-2026-001",
    "cree_par": "admin",
    "date_creation": "2026-06-15T00:00:00Z",
    "date_modification": "2026-06-15T00:00:00Z"
  }
]
```

#### Create Goods Declaration

**Endpoint**: `POST /api/transport/goods-declarations`

**Description**: Create a new goods declaration.

**Permissions**: `transport:create`

**Rate Limit**: 10 requests per minute

**Request Body**:
```json
{
  "numero_declaration": "DEC-2026-001",
  "article_id": 1,
  "quantite": 100,
  "unite": "KG",
  "poids": 1000.0,
  "valeur": 50000.0,
  "devise": "XAF",
  "incoterm": "FOB",
  "port_depart": "Douala",
  "port_arrivee": "Paris",
  "date_declaration": "2026-06-15T00:00:00Z",
  "statut": "BROUILLON",
  "declaration_douaniere": "DCL-2026-001"
}
```

#### Get Goods Declaration by ID

**Endpoint**: `GET /api/transport/goods-declarations/{declaration_id}`

**Description**: Get a specific goods declaration by ID.

**Permissions**: `transport:read`

#### Update Goods Declaration

**Endpoint**: `PUT /api/transport/goods-declarations/{declaration_id}`

**Description**: Update a goods declaration.

**Permissions**: `transport:update`

**Rate Limit**: 20 requests per minute

#### Delete Goods Declaration

**Endpoint**: `DELETE /api/transport/goods-declarations/{declaration_id}`

**Description**: Delete a goods declaration.

**Permissions**: `transport:delete`

**Rate Limit**: 10 requests per minute

#### Add Line to Goods Declaration

**Endpoint**: `POST /api/transport/goods-declarations/{declaration_id}/lignes`

**Description**: Add a line to a goods declaration.

**Permissions**: `transport:create`

**Rate Limit**: 10 requests per minute

---

### Removal Slip Module

#### List All Removal Slips

**Endpoint**: `GET /api/magasin/removal-slips`

**Description**: List all removal slips with pagination.

**Permissions**: `magasin:read`

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return
- `statut` (string, optional): Filter by status
- `magasin_source` (string, optional): Filter by source warehouse
- `magasin_destination` (string, optional): Filter by destination warehouse

#### Create Removal Slip

**Endpoint**: `POST /api/magasin/removal-slips`

**Description**: Create a new removal slip.

**Permissions**: `magasin:create`

**Rate Limit**: 10 requests per minute

#### Authorize Removal Slip

**Endpoint**: `POST /api/magasin/removal-slips/{slip_id}/autoriser`

**Description**: Authorize a removal slip.

**Permissions**: `magasin:authorize`

**Rate Limit**: 10 requests per minute

#### Get Workflow Status

**Endpoint**: `GET /api/magasin/removal-slips/{slip_id}/workflow-status`

**Description**: Get the workflow status for a removal slip.

**Permissions**: `magasin:read`

#### Create Removal Slip with Workflow

**Endpoint**: `POST /api/magasin/removal-slips/{slip_id}/workflow-create`

**Description**: Create a removal slip with complete workflow.

**Permissions**: `magasin:create`

**Rate Limit**: 10 requests per minute

---

### Reception Mag3 Module

#### List All Receptions Mag3

**Endpoint**: `GET /api/magasin/receptions-mag3`

**Description**: List all Mag3 receptions with pagination.

**Permissions**: `magasin:read`

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return
- `statut` (string, optional): Filter by status
- `magasin_source` (string, optional): Filter by source warehouse
- `magasin_destination` (string, optional): Filter by destination warehouse

#### Create Reception from Slip

**Endpoint**: `POST /api/magasin/receptions-mag3/from-slip/{slip_id}`

**Description**: Create a Mag3 reception from a removal slip.

**Permissions**: `magasin:create`

**Rate Limit**: 10 requests per minute

#### Validate Reception with Workflow

**Endpoint**: `POST /api/magasin/receptions-mag3/{reception_id}/workflow-validate`

**Description**: Validate a reception with complete workflow (stock update).

**Permissions**: `magasin:validate`

**Rate Limit**: 10 requests per minute

#### Get Pending Workflows

**Endpoint**: `GET /api/magasin/receptions-mag3/pending-workflows`

**Description**: Get all pending workflows.

**Permissions**: `magasin:read`

---

### Master Data Module

#### List All Suppliers

**Endpoint**: `GET /api/master-data/suppliers`

**Description**: List all suppliers with pagination.

**Permissions**: `master-data:read`

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return
- `statut` (string, optional): Filter by status
- `categorie` (string, optional): Filter by category

#### Create Supplier

**Endpoint**: `POST /api/master-data/suppliers`

**Description**: Create a new supplier.

**Permissions**: `master-data:create`

**Rate Limit**: 10 requests per minute

#### Create Supplier Profile

**Endpoint**: `POST /api/master-data/suppliers/{supplier_id}/profiles`

**Description**: Create a supplier profile.

**Permissions**: `master-data:create`

**Rate Limit**: 10 requests per minute

#### List All Articles

**Endpoint**: `GET /api/master-data/articles`

**Description**: List all articles with pagination.

**Permissions**: `master-data:read`

**Query Parameters**:
- `skip` (int, default: 0): Number of records to skip
- `limit` (int, default: 100): Maximum number of records to return
- `search` (string, optional): Search in article name or code

#### Create Article

**Endpoint**: `POST /api/master-data/articles`

**Description**: Create a new article.

**Permissions**: `article:create`

**Rate Limit**: 10 requests per minute

---

## Rate Limiting

Some endpoints have rate limiting applied:

- `/api/auth/register`: 10 requests per hour
- `/api/auth/login`: 5 requests per minute
- `/api/magasin/magasins` (POST): 10 requests per minute
- `/api/magasin/magasins` (PUT): 20 requests per minute
- `/api/magasin/clients` (POST): 10 requests per minute

When rate limit is exceeded:
```json
{
  "detail": "Rate limit exceeded"
}
```

---

## Pagination

List endpoints support pagination using `skip` and `limit` query parameters:

- `skip`: Number of records to skip (default: 0)
- `limit`: Maximum number of records to return (default: 100, max: 1000)

Example:
```
GET /api/tiers/?skip=0&limit=50
```

---

## RBAC Permissions

The API uses Role-Based Access Control (RBAC) with the following roles:

- **ADMIN**: Full access to all resources
- **DISPATCHER**: Access to transport and parc operations
- **FINANCE**: Access to finance operations
- **GATE_AGENT**: Access to gate operations
- **MAGASINIER**: Access to magasin operations

Permissions are checked per endpoint and are documented in each endpoint description.

---

## Caching

The API uses Redis caching for improved performance. Cache keys follow the pattern:
`{module}:entity:identifier` (e.g., `tiers:all:0:100`, `finance:factures:all:0:100`)

Cache expiration times:
- Lists: 300 seconds
- Single entities: 600 seconds
- Filtered queries: 180 seconds
- Dynamic data: 120 seconds

Cache is automatically invalidated on write operations (create, update, delete).

---

## Version

Current API Version: 1.0.0

Last Updated: 2026-06-09
