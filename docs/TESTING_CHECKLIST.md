# Checklist de Test de Fidélité - KAMLOG ERP Frontend

## Instructions de Test

Pour chaque interface, comparer la page Next.js avec le fichier HTML original dans `d:\Projet\ERP\KAMLOG-EM-ERP\ERP\` et vérifier les éléments suivants.

---

## Admin (7 interfaces)

### 1. User Management RBAC
- **HTML**: `admin_user_management_rbac/code.html`
- **Next.js**: `src/app/(app)/admin/user-management/listing/page.tsx`
- **Vérifier**:
  - [ ] Layout avec sidebar et top navigation
  - [ ] Tableau des utilisateurs avec filtres
  - [ ] Panneau de détail latéral
  - [ ] Boutons d'action (Edit, Delete, Assign Role)
  - [ ] Icônes Material Symbols
  - [ ] Couleurs Tailwind personnalisées

### 2. Configuration des Rôles RBAC
- **HTML**: `admin_configuration_des_r_les_rbac/code.html`
- **Next.js**: `src/app/(app)/admin/configuration-des-roles-rbac/page.tsx`
- **Vérifier**:
  - [ ] Formulaire de création de rôle
  - [ ] Matrice de permissions par module
  - [ ] Cases à cocher pour chaque permission
  - [ ] Toggle de statut actif
  - [ ] Boutons Enregistrer/Annuler

### 3. System Health Monitor
- **HTML**: `audit_system_health_monitor/code.html`
- **Next.js**: `src/app/(app)/admin/audit/system-health/page.tsx`
- **Vérifier**:
  - [ ] Cartes de métriques système (CPU, Mémoire, DB)
  - [ ] Graphiques de tendance
  - [ ] Tableau de logs d'événements
  - [ ] Filtres de sévérité
  - [ ] Boutons Export/Refresh

### 4. System Health Monitor 1
- **HTML**: `audit_system_health_monitor_1/code.html`
- **Next.js**: `src/app/(app)/admin/audit/system-health-monitor-1/page.tsx`
- **Vérifier**:
  - [ ] État des modules (online/offline)
  - [ ] Indicateurs MFA
  - [ ] Temps de disponibilité
  - [ ] Alertes de synchronisation

### 5. System Health Monitor 2
- **HTML**: `audit_system_health_monitor_2/code.html`
- **Next.js**: `src/app/(app)/admin/audit/system-health-monitor-2/page.tsx`
- **Vérifier**:
  - [ ] Métriques détaillées avec tendances
  - [ ] Logs d'événements critiques
  - [ ] Graphiques de performance
  - [ ] Données additionnelles par métrique

### 6. Operation Trace
- **HTML**: `audit_trail_operation_trace/code.html`
- **Next.js**: `src/app/(app)/admin/audit/operation-trace/page.tsx`
- **Vérifier**:
  - [ ] Tableau de traces d'opérations
  - [ ] Filtres par période, admin, utilisateur
  - [ ] Badges de sévérité
  - [ ] Pagination
  - [ ] Raccourcis T-Code

### 7. MFA Configuration
- **HTML**: `security_mfa_configuration/code.html`
- **Next.js**: `src/app/(app)/admin/security/mfa/page.tsx`
- **Vérifier**:
  - [ ] Configuration des méthodes MFA
  - [ ] Statut de conformité
  - [ ] Liste des utilisateurs avec MFA
  - [ ] Options de configuration

---

## Auth (3 interfaces)

### 8. Create Account
- **HTML**: `create_account_kamlog_erp/code.html`
- **Next.js**: `src/app/(app)/auth/register/page.tsx`
- **Vérifier**:
  - [ ] Formulaire d'inscription
  - [ ] Validation des champs
  - [ ] Illustration de port
  - [ ] Bouton de création

### 9. Login
- **HTML**: `login_kamlog_erp/code.html`
- **Next.js**: `src/app/(app)/auth/login/page.tsx`
- **Vérifier**:
  - [ ] Formulaire de connexion
  - [ ] Champs username/password
  - [ ] Option "Remember me"
  - [ ] Lien vers mot de passe oublié

### 10. MFA Verification
- **HTML**: `mfa_verification/code.html`
- **Next.js**: `src/app/(app)/auth/mfa/page.tsx`
- **Vérifier**:
  - [ ] Formulaire de saisie code MFA
  - [ ] Options de méthode (SMS, Email, Authenticator)
  - [ ] Timer de délai
  - [ ] Bouton de renvoi

---

## Finance (6 interfaces)

### 11. Bank Reconciliation
- **HTML**: `k_finance_bank_reconciliation/code.html`
- **Next.js**: `src/app/(app)/finance/banking/reconciliation/page.tsx`
- **Vérifier**:
  - [ ] Tableau de rapprochement bancaire
  - [ ] Filtres par période
  - [ ] Indicateurs de solde
  - [ ] Actions de validation

### 12. Billing Invoicing
- **HTML**: `k_finance_billing_invoicing/code.html`
- **Next.js**: `src/app/(app)/finance/billing/page.tsx`
- **Vérifier**:
  - [ ] Liste des factures
  - [ ] Création de facture
  - [ ] Statuts de facture
  - [ ] Actions d'envoi/validation

### 13. Gateway Monitor
- **HTML**: `k_finance_gateway_monitor/code.html`
- **Next.js**: `src/app/(app)/finance/gateway/page.tsx`
- **Vérifier**:
  - [ ] Moniteur de passerelle de paiement
  - [ ] Transactions en temps réel
  - [ ] Statut de connexion
  - [ ] Alertes d'erreur

### 14. Mission de Facture Client
- **HTML**: `k_finance_mission_de_facture_client/code.html`
- **Next.js**: `src/app/(app)/finance/mission-de-facture-client/page.tsx`
- **Vérifier**:
  - [ ] Formulaire de mission de facturation
  - [ ] Sélection de client
  - [ ] Configuration de facture
  - [ ] Validation

### 15. Finance Overview
- **HTML**: `k_finance_overview/code.html`
- **Next.js**: `src/app/(app)/finance/overview/page.tsx`
- **Vérifier**:
  - [ ] Tableau de bord financier
  - [ ] KPIs (Revenus, Dépenses, Marge)
  - [ ] Graphiques de tendance
  - [ ] Alertes financières

### 16. Saisie Transaction Bancaire
- **HTML**: `kf08_saisie_transaction_bancaire_k_finance/code.html`
- **Next.js**: `src/app/(app)/finance/saisie-transaction-bancaire/page.tsx`
- **Vérifier**:
  - [ ] Formulaire de saisie transaction
  - [ ] Sélection de compte
  - [ ] Montant et description
  - [ ] Type de transaction

---

## Magasin (8 interfaces)

### 17. Analytics (KM32)
- **HTML**: `k_magasin_analytics_km32/code.html`
- **Next.js**: `src/app/(app)/magasin/analytics/page.tsx`
- **Vérifier**:
  - [ ] Tableau de bord analytique
  - [ ] Graphiques de stock
  - [ ] Métriques de rotation
  - [ ] Alertes de stock bas

### 18. Capacity Map (KM32)
- **HTML**: `k_magasin_capacity_map_km32/code.html`
- **Next.js**: `src/app/(app)/magasin/capacity-map/page.tsx`
- **Vérifier**:
  - [ ] Carte de capacité d'entrepôt
  - [ ] Zones colorées par occupation
  - [ ] Légende interactive
  - [ ] Détails au survol

### 19. Dashboard
- **HTML**: `k_magasin_dashboard/code.html`
- **Next.js**: `src/app/(app)/magasin/dashboard/page.tsx`
- **Vérifier**:
  - [ ] Tableau de bord magasin
  - [ ] Cartes KPI
  - [ ] Alertes récentes
  - [ ] Opérations en cours

### 20. Réception (KM24)
- **HTML**: `k_magasin_r_ception_km24/code.html`
- **Next.js**: `src/app/(app)/magasin/reception/page.tsx`
- **Vérifier**:
  - [ ] Formulaire de réception
  - [ ] Liste d'articles
  - [ ] Validation de quantité
  - [ ] Signature numérique

### 21. Recherche Stock Avancée
- **HTML**: `k_magasin_recherche_stock_avanc_e/code.html`
- **Next.js**: `src/app/(app)/magasin/recherche-stock/page.tsx`
- **Vérifier**:
  - [ ] Formulaire de recherche avancée
  - [ ] Filtres multiples
  - [ ] Tableau de résultats
  - [ ] Export de données

### 22. Stock Movement History
- **HTML**: `k_magasin_stock_movement_history/code.html`
- **Next.js**: `src/app/(app)/magasin/stock-movement-history/page.tsx`
- **Vérifier**:
  - [ ] Historique des mouvements
  - [ ] Filtres par type/date
  - [ ] Tableau avec détails
  - [ ] Pagination

### 23. Saisie Inventaire Physique
- **HTML**: `km01_saisie_inventaire_physique_k_magasin/code.html`
- **Next.js**: `src/app/(app)/magasin/inventaire/page.tsx`
- **Vérifier**:
  - [ ] Formulaire d'inventaire
  - [ ] Liste d'articles à compter
  - [ ] Saisie des quantités
  - [ ] Validation

### 24. Mouvement de Stock Manuel
- **HTML**: `km12_mouvement_de_stock_manuel_k_magasin/code.html`
- **Next.js**: `src/app/(app)/magasin/mouvement-de-stock-manuel/page.tsx`
- **Vérifier**:
  - [ ] Formulaire de mouvement
  - [ ] Type de mouvement (entrée/sortie)
  - [ ] Sélection d'article
  - [ ] Quantité et raison

---

## Parc (5 interfaces)

### 25. Enregistrement Nouveau Véhicule
- **HTML**: `k_parc_enregistrement_nouveau_v_hicule/code.html`
- **Next.js**: `src/app/(app)/parc/vehicles/new/page.tsx`
- **Vérifier**:
  - [ ] Formulaire d'enregistrement
  - [ ] Champs plaque, type, chassis
  - [ ] Sélection chauffeur
  - [ ] Upload de documents

### 26. Fleet Management Overview
- **HTML**: `k_parc_fleet_management_overview/code.html`
- **Next.js**: `src/app/(app)/parc/overview/page.tsx`
- **Vérifier**:
  - [ ] Vue d'ensemble de la flotte
  - [ ] Cartes de santé véhicules
  - [ ] Carte avec marqueurs
  - [ ] Alertes critiques

### 27. Gestion de la Flotte
- **HTML**: `k_parc_gestion_de_la_flotte/code.html`
- **Next.js**: `src/app/(app)/parc/gestion-de-la-flotte/page.tsx`
- **Vérifier**:
  - [ ] Tableau de véhicules
  - [ ] Filtres par statut
  - [ ] Détails de consommation
  - [ ] Historique d'entretien

### 28. Workshop Maintenance
- **HTML**: `k_parc_workshop_maintenance/code.html`
- **Next.js**: `src/app/(app)/parc/workshop/page.tsx`
- **Vérifier**:
  - [ ] Tableau de bord atelier
  - [ ] KPIs de réparation
  - [ ] Liste des réparations actives
  - [ ] Alertes d'inventaire

### 29. Création Ordre de Travail
- **HTML**: `kp05_cr_ation_ordre_de_travail_k_parc/code.html`
- **Next.js**: `src/app/(app)/parc/creation-ordre-de-travail/page.tsx`
- **Vérifier**:
  - [ ] Formulaire d'ordre de travail
  - [ ] Informations générales
  - [ ] Liste de pièces
  - [ ] Planification

---

## Transport (6 interfaces)

### 30. Control
- **HTML**: `k_transport_control/code.html`
- **Next.js**: `src/app/(app)/transport/control/page.tsx`
- **Vérifier**:
  - [ ] Tableau de bord contrôle
  - [ ] Statut de la flotte
  - [ ] Prochaines livraisons
  - [ ] Missions actives

### 31. Dispatch Control
- **HTML**: `k_transport_dispatch_control/code.html`
- **Next.js**: `src/app/(app)/transport/dispatch/page.tsx`
- **Vérifier**:
  - [ ] Carte avec marqueurs
  - [ ] Journal de missions
  - [ ] Formulaire d'initialisation
  - [ ] Statistiques d'efficacité

### 32. Fuel Intelligence
- **HTML**: `k_transport_fuel_intelligence/code.html`
- **Next.js**: `src/app/(app)/transport/fuel/page.tsx`
- **Vérifier**:
  - [ ] Métriques carburant
  - [ ] Tableau de logs
  - [ ] Filtres par période
  - [ ] Alertes de siphonnage

### 33. Terminal Map Control
- **HTML**: `k_transport_terminal_map_control/code.html`
- **Next.js**: `src/app/(app)/transport/map/page.tsx`
- **Vérifier**:
  - [ ] Carte topologique terminal
  - [ ] Marqueurs navires/conteneurs
  - [ ] Événements terminal
  - [ ] Statut équipements

### 34. Déclaration de Conteneur (KT10)
- **HTML**: `kt10_d_claration_de_conteneur_k_transport/code.html`
- **Next.js**: `src/app/(app)/transport/containers/declaration/page.tsx`
- **Vérifier**:
  - [ ] Formulaire de déclaration
  - [ ] Numéro conteneur et BL
  - [ ] Type et Incoterm
  - [ ] VGM et observations

### 35. Saisie Ticket Carburant (KT22)
- **HTML**: `kt22_saisie_ticket_carburant_k_transport/code.html`
- **Next.js**: `src/app/(app)/transport/fuel/ticket/page.tsx`
- **Vérifier**:
  - [ ] Formulaire de ticket
  - [ ] Sélection véhicule/chauffeur
  - [ ] Type de carburant
  - [ ] Calcul automatique total

---

## Master Data (4 interfaces)

### 36. Article Creation (KA01)
- **HTML**: `master_data_new_article_ka01/code.html`
- **Next.js**: `src/app/(app)/master-data/article-creation/page.tsx`
- **Vérifier**:
  - [ ] Formulaire création article
  - [ ] Informations générales
  - [ ] Dimensions et conversion
  - [ ] Catégorisation

### 37. Tiers
- **HTML**: `master_data_tiers/code.html`
- **Next.js**: `src/app/(app)/master-data/tiers/page.tsx`
- **Vérifier**:
  - [ ] Tableau de tiers
  - [ ] Filtres par type
  - [ ] Panneau de détail
  - [ ] Actions de gestion

### 38. Tiers Management
- **HTML**: `master_data_tiers_management/code.html`
- **Next.js**: `src/app/(app)/master-data/tiers-management/page.tsx`
- **Vérifier**:
  - [ ] Interface de gestion
  - [ ] Tableau avec sélection
  - [ ] Panneau latéral détails
  - [ ] Recherche et filtres

### 39. Création Profil Client (KC34)
- **HTML**: `kc34_cr_ation_profil_client_master_data/code.html`
- **Next.js**: `src/app/(app)/master-data/clients/create/page.tsx`
- **Vérifier**:
  - [ ] Formulaire profil client
  - [ ] Identification légale
  - [ ] Coordonnées
  - [ ] Paramètres financiers

---

## Dashboard (2 interfaces)

### 40. Global Dashboard
- **HTML**: `kamlog_erp_tableau_de_bord_global/code.html`
- **Next.js**: `src/app/(app)/dashboard/global/page.tsx`
- **Vérifier**:
  - [ ] Cartes KPI par module
  - [ ] Lanceur T-Code
  - [ ] Centre d'alertes
  - [ ] Flux d'opérations

### 41. Dashboard
- **HTML**: `kamlog_em_erp/code.html`
- **Next.js**: `src/app/(app)/dashboard/page.tsx`
- **Vérifier**:
  - [ ] Tableau de bord principal
  - [ ] Cartes KPI
  - [ ] Lanceur T-Code
  - [ ] Alertes et opérations

---

## Reports (2 interfaces)

### 42. Bibliothèque de Modèles Enregistrés
- **HTML**: `rapports_biblioth_que_de_mod_les_enregistr_s/code.html`
- **Next.js**: `src/app/(app)/reports/templates/library/page.tsx`
- **Vérifier**:
  - [ ] Grille de modèles
  - [ ] Filtres de recherche
  - [ ] Cartes avec détails
  - [ ] Boutons Run/Edit

### 43. Générateur de Rapports Personnalisés
- **HTML**: `rapports_g_n_rateur_de_rapports_personnalis_s/code.html`
- **Next.js**: `src/app/(app)/reports/custom/builder/page.tsx`
- **Vérifier**:
  - [ ] Configuration de rapport
  - [ ] Sélection de module
  - [ ] Choix de champs
  - [ ] Options de visualisation

---

## Other (5 interfaces)

### 44. Documents Digital Archive
- **HTML**: `documents_digital_archive/code.html`
- **Next.js**: `src/app/(app)/documents/archive/page.tsx`
- **Vérifier**:
  - [ ] Grille de catégories
  - [ ] Tableau de documents
  - [ ] Filtres de recherche
  - [ ] Actions de téléchargement

### 45. Journal
- **HTML**: `journal.html`
- **Next.js**: `src/app/(app)/admin/journal/page.tsx`
- **Vérifier**:
  - [ ] Journal d'activité
  - [ ] Filtres par période/admin
  - [ ] Tableau d'événements
  - [ ] Analyses de fréquence

### 46. Configuration des Rôles RBAC
- **HTML**: `admin_configuration_des_r_les_rbac/code.html`
- **Next.js**: `src/app/(app)/admin/configuration-des-roles-rbac/page.tsx`
- **Vérifier**:
  - [ ] (Déjà vérifié dans Admin #2)

### 47. Role Assignment
- **HTML**: `role Assignation.html`
- **Next.js**: `src/app/(app)/admin/role-assignment/page.tsx`
- **Vérifier**:
  - [ ] Assignation de rôles
  - [ ] Liste d'utilisateurs
  - [ ] Sélection de rôles
  - [ ] Sauvegarde

### 48. Permissions
- **HTML**: `permissions.html`
- **Next.js**: `src/app/(app)/admin/permissions/page.tsx`
- **Vérifier**:
  - [ ] Matrice de permissions
  - [ ] Cases à cocher
  - [ ] Par module
  - [ ] Sauvegarde

---

## Pages d'Action (9 pages)

### 49. Support
- **Next.js**: `src/app/(app)/support/page.tsx`
- **Vérifier**:
  - [ ] Page placeholder fonctionnelle
  - [ ] Navigation correcte

### 50. Logout
- **Next.js**: `src/app/(app)/logout/page.tsx`
- **Vérifier**:
  - [ ] Redirection vers login
  - [ ] Animation de chargement

### 51. Profile
- **Next.js**: `src/app/(app)/profile/page.tsx`
- **Vérifier**:
  - [ ] Page placeholder fonctionnelle
  - [ ] Navigation correcte

### 52. Security
- **Next.js**: `src/app/(app)/security/page.tsx`
- **Vérifier**:
  - [ ] Page placeholder fonctionnelle
  - [ ] Navigation correcte

### 53. Transport/Fuel/History
- **Next.js**: `src/app/(app)/transport/fuel/history/page.tsx`
- **Vérifier**:
  - [ ] Page placeholder fonctionnelle
  - [ ] Navigation correcte

### 54. Transport/Containers
- **Next.js**: `src/app/(app)/transport/containers/page.tsx`
- **Vérifier**:
  - [ ] Page placeholder fonctionnelle
  - [ ] Navigation correcte

### 55. Reports/Templates/Create
- **Next.js**: `src/app/(app)/reports/templates/create/page.tsx`
- **Vérifier**:
  - [ ] Page placeholder fonctionnelle
  - [ ] Navigation correcte

### 56. Reports/Templates/Edit/[id]
- **Next.js**: `src/app/(app)/reports/templates/edit/[id]/page.tsx`
- **Vérifier**:
  - [ ] Page placeholder fonctionnelle
  - [ ] Navigation correcte
  - [ ] Paramètre ID passé

### 57. Reports/Custom
- **Next.js**: `src/app/(app)/reports/custom/page.tsx`
- **Vérifier**:
  - [ ] Page placeholder fonctionnelle
  - [ ] Navigation correcte

---

## Nouveaux Modules (Added 15 Juin 2026)

### 58. Transport/Goods Declaration
- **Next.js**: `src/app/(app)/transport/goods-declaration/page.tsx`
- **Vérifier**:
  - [ ] Interface de déclaration de marchandises
  - [ ] Formulaire avec champs (article, quantité, poids, valeur, incoterm, ports)
  - [ ] Tableau des déclarations existantes
  - [ ] Filtres par statut
  - [ ] Actions CRUD (Create, Read, Update, Delete)
  - [ ] Validation des données

### 59. Magasin/Removal Slip
- **Next.js**: `src/app/(app)/magasin/removal-slip/page.tsx`
- **Vérifier**:
  - [ ] Interface de bon d'enlèvement Mag3
  - [ ] Formulaire avec champs (article, quantité, magasins source/destination)
  - [ ] Tableau des bons d'enlèvement
  - [ ] Filtres par statut et magasins
  - [ ] Bouton d'autorisation
  - [ ] Workflow status indicator
  - [ ] Actions CRUD

### 60. Magasin/Reception Mag3
- **Next.js**: `src/app/(app)/magasin/reception-mag3/page.tsx`
- **Vérifier**:
  - [ ] Interface de réception Mag3
  - [ ] Formulaire avec champs (quantité attendue, quantité reçue, observations)
  - [ ] Tableau des réceptions
  - [ ] Filtres par statut et magasins
  - [ ] Bouton de validation
  - [ ] Lien avec bon d'enlèvement
  - [ ] Actions CRUD

### 61. Master Data/Suppliers
- **Next.js**: `src/app/(app)/master-data/suppliers/page.tsx`
- **Vérifier**:
  - [ ] Interface de gestion des fournisseurs
  - [ ] Tableau des fournisseurs
  - [ ] Filtres par statut et catégorie
  - [ ] Actions CRUD
  - [ ] Bouton de création de profil
  - [ ] Gestion des limites de crédit

### 62. Master Data/Suppliers/Create
- **Next.js**: `src/app/(app)/master-data/suppliers/create/page.tsx`
- **Vérifier**:
  - [ ] Formulaire de création de fournisseur
  - [ ] Champs (raison sociale, NIU, contact, conditions paiement)
  - [ ] Validation des données
  - [ ] Boutons Enregistrer/Annuler

### 63. Master Data/Incoterms
- **Next.js**: `src/app/(app)/master-data/incoterms/page.tsx`
- **Vérifier**:
  - [ ] Interface de gestion des incoterms
  - [ ] Tableau des incoterms (code, description, lieu)
  - [ ] Recherche
  - [ ] Modal de création/modification
  - [ ] Actions CRUD

### 64. Master Data/Container Types
- **Next.js**: `src/app/(app)/master-data/container-types/page.tsx`
- **Vérifier**:
  - [ ] Interface de gestion des types de conteneurs
  - [ ] Tableau des types (code, description, dimensions, capacité)
  - [ ] Recherche
  - [ ] Modal de création/modification
  - [ ] Actions CRUD

### 65. Master Data/Units
- **Next.js**: `src/app/(app)/master-data/units/page.tsx`
- **Vérifier**:
  - [ ] Interface de gestion des unités de mesure
  - [ ] Tableau des unités (code, description, symbole, catégorie)
  - [ ] Recherche
  - [ ] Modal de création/modification
  - [ ] Actions CRUD

### 66. Master Data/Article Categories
- **Next.js**: `src/app/(app)/master-data/article-categories/page.tsx`
- **Vérifier**:
  - [ ] Interface de gestion des catégories d'articles
  - [ ] Tableau des catégories (code, description, parent, niveau)
  - [ ] Recherche
  - [ ] Modal de création/modification
  - [ ] Actions CRUD

---

## Tests Backend (Added 15 Juin 2026)

### Tests des Nouveaux Endpoints

#### Goods Declaration Module
- [ ] Test GET /api/transport/goods-declarations
- [ ] Test POST /api/transport/goods-declarations
- [ ] Test GET /api/transport/goods-declarations/{id}
- [ ] Test PUT /api/transport/goods-declarations/{id}
- [ ] Test DELETE /api/transport/goods-declarations/{id}
- [ ] Test POST /api/transport/goods-declarations/{id}/lignes
- [ ] Test validation des données
- [ ] Test permissions RBAC

#### Removal Slip Module
- [ ] Test GET /api/magasin/removal-slips
- [ ] Test POST /api/magasin/removal-slips
- [ ] Test GET /api/magasin/removal-slips/{id}
- [ ] Test PUT /api/magasin/removal-slips/{id}
- [ ] Test DELETE /api/magasin/removal-slips/{id}
- [ ] Test POST /api/magasin/removal-slips/{id}/autoriser
- [ ] Test GET /api/magasin/removal-slips/{id}/workflow-status
- [ ] Test POST /api/magasin/removal-slips/{id}/workflow-create

#### Reception Mag3 Module
- [ ] Test GET /api/magasin/receptions-mag3
- [ ] Test POST /api/magasin/receptions-mag3
- [ ] Test GET /api/magasin/receptions-mag3/{id}
- [ ] Test PUT /api/magasin/receptions-mag3/{id}
- [ ] Test DELETE /api/magasin/receptions-mag3/{id}
- [ ] Test POST /api/magasin/receptions-mag3/{id}/valider
- [ ] Test POST /api/magasin/receptions-mag3/from-slip/{slip_id}
- [ ] Test POST /api/magasin/receptions-mag3/{id}/workflow-validate
- [ ] Test GET /api/magasin/receptions-mag3/pending-workflows

#### Master Data Module
- [ ] Test GET /api/master-data/suppliers
- [ ] Test POST /api/master-data/suppliers
- [ ] Test GET /api/master-data/suppliers/{id}
- [ ] Test PUT /api/master-data/suppliers/{id}
- [ ] Test DELETE /api/master-data/suppliers/{id}
- [ ] Test POST /api/master-data/suppliers/{id}/profiles
- [ ] Test GET /api/master-data/articles
- [ ] Test POST /api/master-data/articles
- [ ] Test GET /api/master-data/articles/{id}
- [ ] Test PUT /api/master-data/articles/{id}
- [ ] Test DELETE /api/master-data/articles/{id}

### Tests des Workflows

#### Workflow Mag3
- [ ] Test création de bon d'enlèvement avec notification
- [ ] Test autorisation de bon d'enlèvement
- [ ] Test création de réception à partir de bon d'enlèvement
- [ ] Test validation de réception avec mise à jour de stock
- [ ] Test mise à jour automatique du statut du bon d'enlèvement
- [ ] Test récupération du statut du workflow
- [ ] Test récupération des workflows en attente

### Tests des Services

#### Services Métier
- [ ] Test GoodsDeclarationService
- [ ] Test RemovalSlipService
- [ ] Test ReceptionMag3Service
- [ ] Test SupplierService
- [ ] Test Mag3WorkflowService

#### Services Utilitaires
- [ ] Test NotificationService
- [ ] Test Validator
- [ ] Test BusinessValidator

### Tests des Repositories
- [ ] Test GoodsDeclarationRepository
- [ ] Test RemovalSlipRepository
- [ ] Test ReceptionMag3Repository
- [ ] Test SupplierRepository

### Tests de Validation
- [ ] Test validate_email()
- [ ] Test validate_phone()
- [ ] Test validate_niu()
- [ ] Test validate_supplier_data()
- [ ] Test validate_goods_declaration_data()
- [ ] Test validate_removal_slip_data()
- [ ] Test validate_reception_mag3_data()

### Tests d'Intégration
- [ ] Test workflow complet (bon d'enlèvement → réception)
- [ ] Test mise à jour de stock automatique
- [ ] Test envoi de notifications
- [ ] Test handlers d'erreurs

---

## Critères de Fidélité Généraux

Pour toutes les interfaces, vérifier:

- [ ] **Layout**: Sidebar gauche + Top navigation + Contenu principal
- [ ] **Couleurs**: Utilisation des tokens Tailwind personnalisés (primary, secondary, tertiary, error, etc.)
- [ ] **Typographie**: Font families et sizes corrects (headline, title, body, label, data-tabular)
- [ ] **Icônes**: Material Symbols avec les bons noms et styles (fill/outlined)
- [ ] **Espacement**: Marges et paddings cohérents
- [ ] **Bordures**: Border radius et border width corrects
- [ ] **Ombres**: Shadow levels appropriés
- [ ] **États**: Hover, focus, active states sur boutons et liens
- [ ] **Responsive**: Comportement sur mobile/tablette
- [ ] **Micro-interactions**: Animations et transitions fluides
- [ ] **Scrollbars**: Custom scrollbars si présents dans l'original
- [ ] **Données**: Structure des données cohérente avec l'original

---

## Rapport de Test

Date: _______________
Testeur: _______________

**Interfaces testées**: ___/57
**Interfaces avec fidélité 100%**: ___
**Interfaces nécessitant des ajustements**: ___

**Commentaires généraux**:
_________________________________________________________________________
_________________________________________________________________________

**Problèmes détectés**:
1. _____________________________________________________________________
2. _____________________________________________________________________
3. _____________________________________________________________________

**Recommandations**:
_________________________________________________________________________
_________________________________________________________________________
