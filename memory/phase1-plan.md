---
name: phase1-plan
description: Plan for enhancing Declaration-Reception-Transfer Order-Delivery Slip workflow
metadata:
  type: project
---

# Phase 1: Enhance KMLOG-EM-ERP Workflow for Bill of Loading to Reception to Transfer to Delivery

## Context
User described a detailed workflow for managing goods from Bill of Loading (Declaration) through warehouse reception, transfer orders, and delivery slips. Current implementation has the foundation but needs enhancements to match the exact workflow described.

## Current State
- Declaration (Bill of Lading) model is well-developed with maritime fields
- Reception model exists with proper states and Declaration links
- OrdreTransfert (Transfer Order) model exists with Declaration linkage for traceability
- BandeLivraison (Delivery Slip) model exists but is linked only to Commande (customer orders), not OrdreTransfert
- Basic CRUD operations exist for all entities

## Required Enhancements

### 1. BandeLivraison Model Updates
- Make `commande_id` nullable (ForeignKey to commandes.id)
- Add `ordre_transfert_id` nullable (ForeignKey to ordres_transfert.id)
- Add constraint: either commande_id OR ordre_transfert_id must be set (not both, not neither)
- Add transport detail fields:
  - `chauffeur_nom`: String(200) - Driver name
  - `matricule_vehicule`: String(50) - Vehicle license plate
  - `signature_chauffeur`: Text - Driver signature
  - `signature_magasinier`: Text - Warehouse keeper signature  
  - `signature_transporteur`: Text - Carrier signature

### 2. BandeLivraison Schema Updates
- Update BandeLivraisonBase to make commande_id optional and add ordre_transfert_id
- Add new fields to BandeLivraisonBase: chauffeur_nom, matricule_vehicule, signature_chauffeur, signature_magasinier, signature_transporteur
- Update BandeLivraisonCreate and BandeLivraisonUpdate schemas accordingly
- Update BandeLivraison response to include new fields and relations

### 3. BandeLivraisonService Enhancements
- Modify `create_bande` to handle linkage to either Commande or OrdreTransfert
- Add method `create_bande_from_ordre_transfert(db: Session, ot_id: int, prepare_par: str, user_id: Optional[int] = None) -> BandeLivraison`
  - Retrieve validated OrdreTransfert
  - Map OrdreTransfert lines to LigneBandeLivraison
  - Set magasin_id to ot.magasin_dest_id
  - Generate bande via standard creation flow

### 4. OrdreTransfertService Enhancement
- Enhance `valider` method to auto-generate BandeLivraison upon successful validation (transition to VALIDE state)
- OR add separate method `generer_bande_livraison` that can be called after validation
- Based on user description: automatic generation upon confirmation

### 5. API Endpoint Additions
- POST `/api/v1/magasin/bandes-livraison/from-ordre-transfert/{ot_id}` - Generate BandeLivraison from OT
- GET `/api/v1/magasin/bandes-livraison/ordre-transfert/{ot_id}` - Get BandeLivraison for OT
- Optionally enhance reception endpoints with clearer draft/post terminology

### 6. Reception Workflow Clarification (Minor)
- Document that EN_COURS state = "draft/in progress" (Enreg. brouillon)
- Document that COMPLETEE state = "posted/validated" (Poster)
- Ensure DeclarationService.get_receptions_summary provides good history view (Afficher l'historique)

### 7. AI Predictive Elements (Simple Implementation)
- Add endpoint `/api/v1/magasin/predictions/reception-timing/{declaration_id}` 
- Uses historical data to predict expected reception completion time based on:
  - Typical reception duration for similar articles/declarations
  - Current warehouse workload
  - Historical performance of involved magasins

## Files to Modify
1. `EVO-LOG-backend/app/models/magasin.py` - BandeLivraison model changes
2. `EVO-LOG-backend/app/schemas/magasin.py` - BandeLivraison schema updates
3. `EVO-LOG-backend/app/services/magasin_service.py` - BandeLivraisonService and OrdreTransfertService enhancements
4. `EVO-LOG-backend/app/routers/magasin.py` - New API endpoints
5. (Optional) Add AI prediction endpoint in magasin router

## Dependencies
- All modification build on existing well-tested services and models
- No breaking changes to existing API - only extensions
- Existing permission patterns can be reused (e.g., "bande:create" for new endpoints)

## Testing Approach
- Unit tests for new BandeLivraisonService methods
- Integration tests for the auto-generation workflow
- API contract tests for new endpoints
- Verify existing functionality remains unaffected

## AI Component
Simple predictive endpoint using historical reception data to estimate completion times.
Will use basic statistical averages rather than complex ML to start, fitting the "progressive" approach.