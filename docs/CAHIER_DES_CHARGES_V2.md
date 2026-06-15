# Cahier des Charges - KAMLOG EM-ERP

**Version**: 2.0  
**Date**: 15 Juin 2026  
**Projet**: KAMLOG Enterprise Management ERP

---

## 1. Introduction

### 1.1 Objectif du Document
Ce cahier des charges définit les spécifications fonctionnelles et techniques du système KAMLOG EM-ERP, une solution de gestion d'entreprise complète intégrant les modules Magasin, Transport, Finance, Parc, Master Data, Admin et Reporting.

### 1.2 Portée du Projet
Le système KAMLOG EM-ERP permet de gérer:
- La gestion des stocks et des magasins
- Les opérations de transport et de logistique
- La facturation et la comptabilité
- La gestion du parc automobile
- Les données de référence (master data)
- L'administration et la sécurité
- Les rapports et analyses

---

## 2. Architecture du Système

### 2.1 Architecture Globale
- **Backend**: FastAPI (Python)
- **Frontend**: Next.js 14 (TypeScript)
- **Base de données**: PostgreSQL 17
- **Cache**: Redis
- **Stockage**: MinIO
- **Authentification**: JWT avec MFA

### 2.2 Modules Principaux
1. **Magasin**: Gestion des stocks, inventaires, réceptions
2. **Transport**: Gestion des déclarations, conteneurs, carburant
3. **Finance**: Facturation, transactions bancaires, réconciliation
4. **Parc**: Gestion des véhicules, ordres de travail, maintenance
5. **Master Data**: Articles, fournisseurs, clients, incoterms
6. **Admin**: Gestion des utilisateurs, rôles, permissions
7. **Reporting**: Rapports personnalisés, exports

---

## 3. Spécifications Fonctionnelles

### 3.1 Module Magasin

#### 3.1.1 Gestion des Stocks
- **Fonctionnalités**:
  - Consultation du stock en temps réel
  - Recherche avancée par article, magasin, catégorie
  - Historique des mouvements de stock
  - Alertes de stock minimum
  - Inventaires physiques

- **Interfaces**:
  - Dashboard du magasin
  - Liste des articles en stock
  - Historique des mouvements
  - Saisie d'inventaire physique
  - Mouvements de stock manuels

#### 3.1.2 Bons d'Enlèvement Mag3
- **Fonctionnalités**:
  - Création de bons d'enlèvement
  - Autorisation des bons
  - Création de réceptions à partir des bons
  - Validation des réceptions
  - Mise à jour automatique du stock

- **Workflow**:
  1. Création du bon d'enlèvement (statut: EN_ATTENTE)
  2. Autorisation du bon (statut: AUTORISE)
  3. Création de la réception (statut: EN_COURS)
  4. Validation de la réception (statut: COMPLETEE)
  5. Mise à jour automatique du stock

#### 3.1.3 Réceptions Mag3
- **Fonctionnalités**:
  - Création de réceptions
  - Validation des quantités reçues
  - Lien avec bons d'enlèvement
  - Observations et commentaires

### 3.2 Module Transport

#### 3.2.1 Déclarations de Marchandises
- **Fonctionnalités**:
  - Création de déclarations de marchandises
  - Gestion des lignes de déclaration
  - Validation des données
  - Export des déclarations

- **Champs**:
  - Matricule (code d'article)
  - Désignation
  - Quantité
  - Poids
  - Valeur
  - Incoterm
  - Ports d'origine/destination

#### 3.2.2 Déclarations de Conteneurs
- **Fonctionnalités**:
  - Enregistrement des conteneurs
  - Suivi des conteneurs
  - Gestion des types de conteneurs

#### 3.2.3 Gestion du Carburant
- **Fonctionnalités**:
  - Saisie des tickets carburant
  - Suivi de la consommation
  - Rapports de consommation

### 3.3 Module Finance

#### 3.3.1 Facturation
- **Fonctionnalités**:
  - Création de factures
  - Mission de facturation client
  - Gestion des paiements
  - Export des factures

#### 3.3.2 Transactions Bancaires
- **Fonctionnalités**:
  - Saisie des transactions bancaires
  - Réconciliation bancaire
  - Suivi des soldes

#### 3.3.3 Gateway Monitor
- **Fonctionnalités**:
  - Surveillance des gateways de paiement
  - Alertes de défaillance
  - Rapports de performance

### 3.4 Module Parc

#### 3.4.1 Gestion des Véhicules
- **Fonctionnalités**:
  - Enregistrement des véhicules
  - Suivi de la flotte
  - Gestion des conducteurs

#### 3.4.2 Ordres de Travail
- **Fonctionnalités**:
  - Création d'ordres de travail
  - Suivi de l'avancement
  - Validation des travaux

#### 3.4.3 Maintenance
- **Fonctionnalités**:
  - Planification de la maintenance
  - Suivi des interventions
  - Historique des réparations

### 3.5 Module Master Data

#### 3.5.1 Articles
- **Fonctionnalités**:
  - Création d'articles
  - Gestion des catégories
  - Gestion des unités de mesure
  - Gestion des incoterms

- **Champs**:
  - Matricule (code unique)
  - Désignation
  - Catégorie
  - Unité de mesure
  - Prix unitaire
  - Stock minimum

#### 3.5.2 Fournisseurs
- **Fonctionnalités**:
  - Création de fournisseurs
  - Gestion des profils fournisseurs
  - Suivi des limites de crédit

- **Champs**:
  - Raison sociale
  - NIU
  - Contact
  - Adresse
  - Conditions de paiement
  - Limite de crédit

#### 3.5.3 Clients
- **Fonctionnalités**:
  - Création de clients
  - Gestion des profils clients
  - Suivi des commandes

#### 3.5.4 Données de Référence
- **Incoterms**: Codes et descriptions des incoterms
- **Types de Conteneurs**: Dimensions et capacités
- **Unités de Mesure**: Codes, symboles, catégories
- **Catégories d'Articles**: Hiérarchie des catégories

### 3.6 Module Admin

#### 3.6.1 Gestion des Utilisateurs
- **Fonctionnalités**:
  - Création d'utilisateurs
  - Gestion des rôles
  - Gestion des permissions
  - MFA (Multi-Factor Authentication)

#### 3.6.2 Sécurité
- **Fonctionnalités**:
  - Configuration RBAC (Role-Based Access Control)
  - Journal d'audit
  - Alertes de sécurité
  - Monitoring des accès

#### 3.6.3 Configuration
- **Fonctionnalités**:
  - Configuration des rôles
  - Configuration des permissions
  - Configuration des notifications

### 3.7 Module Reporting

#### 3.7.1 Rapports Personnalisés
- **Fonctionnalités**:
  - Création de rapports personnalisés
  - Bibliothèque de modèles
  - Export Excel/PDF

#### 3.7.2 Rapports Standard
- **Fonctionnalités**:
  - Rapports de stock
  - Rapports de ventes
  - Rapports financiers
  - Rapports de performance

---

## 4. Spécifications Techniques

### 4.1 Backend

#### 4.1.1 Architecture
- **Framework**: FastAPI
- **Langage**: Python 3.11+
- **Architecture en couches**: Models → Repositories → Services → Routers

#### 4.1.2 Services Principaux
- **GoodsDeclarationService**: Gestion des déclarations de marchandises
- **RemovalSlipService**: Gestion des bons d'enlèvement
- **ReceptionMag3Service**: Gestion des réceptions Mag3
- **SupplierService**: Gestion des fournisseurs
- **Mag3WorkflowService**: Gestion des workflows Mag3
- **NotificationService**: Gestion des notifications
- **StockService**: Gestion des stocks

#### 4.1.3 Gestion des Erreurs
- Système centralisé de gestion d'erreurs
- Handlers spécialisés par type d'erreur
- Logging structuré
- Messages d'erreur conviviaux

#### 4.1.4 Validation des Données
- Validateurs génériux (email, téléphone, NIU, etc.)
- Validateurs métier (fournisseurs, déclarations, etc.)
- Validation côté backend

### 4.2 Frontend

#### 4.2.1 Architecture
- **Framework**: Next.js 14 avec App Router
- **Langage**: TypeScript
- **Styling**: Tailwind CSS avec thème personnalisé
- **Composants**: Radix UI, Material Symbols

#### 4.2.2 Interfaces
- 67+ interfaces implémentées
- Fidélité 100% au design original
- Layout unifié (ModuleLayout)
- Responsive design

#### 4.2.3 Modules Frontend
- **Magasin**: 10+ interfaces
- **Transport**: 8+ interfaces
- **Finance**: 6+ interfaces
- **Parc**: 6+ interfaces
- **Master Data**: 10+ interfaces
- **Admin**: 7+ interfaces
- **Reporting**: 4+ interfaces

### 4.3 Sécurité

#### 4.3.1 Authentification
- JWT (JSON Web Tokens)
- MFA (Multi-Factor Authentication)
- Refresh tokens
- Session management

#### 4.3.2 Autorisation
- RBAC (Role-Based Access Control)
- Permissions granulaires
- Vérification des permissions sur chaque endpoint

#### 4.3.3 Protection
- Rate limiting avec SlowAPI
- CORS configuré
- Sanitization des inputs
- Protection contre les attaques courantes

---

## 5. Workflows Métier

### 5.1 Workflow Mag3
Le workflow Mag3 gère le processus d'enlèvement et de réception:

1. **Création du Bon d'Enlèvement**
   - Sélection de l'article
   - Spécification de la quantité
   - Sélection des magasins source/destination
   - Notification au responsable

2. **Autorisation du Bon**
   - Validation par le responsable
   - Changement de statut à AUTORISE
   - Notification de l'autorisation

3. **Création de la Réception**
   - Création à partir du bon d'enlèvement
   - Spécification de la quantité attendue
   - Notification de la création

4. **Validation de la Réception**
   - Vérification de la quantité reçue
   - Validation de la réception
   - Mise à jour automatique du stock
   - Mise à jour du statut du bon d'enlèvement
   - Notification de la validation

### 5.2 Workflow de Facturation
1. Création de la facture
2. Validation des montants
3. Envoi au client
4. Suivi du paiement
5. Réconciliation

### 5.3 Workflow de Maintenance
1. Détection du besoin de maintenance
2. Création de l'ordre de travail
3. Planification de l'intervention
4. Exécution des travaux
5. Validation de l'intervention
6. Mise à jour de l'historique

---

## 6. Notifications

### 6.1 Types de Notifications
- **AUTHORIZATION_REQUEST**: Demande d'autorisation
- **AUTHORIZATION_GRANTED**: Autorisation accordée
- **RECEPTION_CREATED**: Réception créée
- **RECEPTION_VALIDATED**: Réception validée
- **STOCK_UPDATED**: Stock mis à jour
- **WORKFLOW_COMPLETED**: Workflow complété

### 6.2 Priorités
- **HIGH**: Urgent, action immédiate requise
- **MEDIUM**: Important, action requise
- **LOW**: Informationnel

### 6.3 Canaux
- In-app notifications
- Email (à configurer)
- SMS (à configurer)

---

## 7. Fiche de Besoin

### 7.1 Description
La fiche de besoin est un document utilisé pour demander des articles ou des services dans tous les départements de l'entreprise.

### 7.2 Champs Requis
- **Matricule**: Code unique de l'article (intervient dans tous les départements)
- **Désignation**: Description de l'article
- **Quantité**: Quantité demandée
- **Unité**: Unité de mesure
- **Date**: Date de la demande
- **Département**: Département demandeur
- **Demandeur**: Personne qui fait la demande
- **Validation**: Statut de validation (EN_ATTENTE, APPROUVE, REJETE)

### 7.3 Workflow
1. Création de la fiche de besoin
2. Validation par le responsable
3. Traitement de la demande
4. Livraison ou rejet

### 7.4 Documents Imprimés
- Fiche de besoin (PDF)
- Bon de livraison (PDF)
- Rapport d'incident (PDF)

---

## 8. Rapport d'Incident

### 8.1 Description
Le rapport d'incident est utilisé pour documenter les incidents survenus dans les opérations (transport, magasin, parc, etc.).

### 8.2 Champs Requis
- **Matricule**: Code unique de l'article/équipement concerné
- **Date**: Date de l'incident
- **Heure**: Heure de l'incident
- **Lieu**: Lieu de l'incident
- **Département**: Département concerné
- **Description**: Description de l'incident
- **Impact**: Impact sur les opérations
- **Actions**: Actions prises
- **Responsable**: Personne responsable

### 8.3 Workflow
1. Signalement de l'incident
2. Documentation de l'incident
3. Analyse des causes
4. Mise en place des actions correctives
5. Suivi de la résolution

---

## 9. Matricule

### 9.1 Description
Le matricule est un code unique identifiant un article ou un équipement. Il intervient dans tous les départements de l'entreprise (Magasin, Transport, Finance, Parc, etc.).

### 9.2 Caractéristiques
- Code unique par article
- Format standardisé
- Utilisé dans tous les modules
- Permet la traçabilité

### 9.3 Utilisation
- Identification des articles dans le stock
- Identification des équipements dans le parc
- Identification des marchandises dans le transport
- Identification dans les factures
- Identification dans les rapports

---

## 10. Livrables

### 10.1 Documentation
- Cahier des charges (ce document)
- Document des transactions (PDF)
- Guide de déploiement
- Guide d'utilisateur
- Documentation API

### 10.2 Code Source
- Backend FastAPI
- Frontend Next.js
- Scripts de migration
- Tests unitaires
- Tests d'intégration

### 10.3 Configuration
- Fichiers de configuration
- Docker Compose
- Scripts de déploiement
- Scripts de backup

---

## 11. Contraintes

### 11.1 Techniques
- Compatible avec PostgreSQL 17
- Compatible avec les navigateurs modernes
- Responsive design
- Performance optimale

### 11.2 Fonctionnelles
- Respect des workflows métier
- Traçabilité complète
- Intégrité des données
- Sécurité renforcée

### 11.3 Temporelles
- Déploiement en production après configuration PostgreSQL
- Tests complets avant mise en production
- Formation des utilisateurs

---

## 12. Critères d'Acceptation

### 12.1 Fonctionnels
- Tous les workflows opérationnels
- Toutes les interfaces fonctionnelles
- Intégrité des données garantie
- Notifications fonctionnelles

### 12.2 Techniques
- Performance optimale
- Sécurité renforcée
- Code maintenable
- Tests complets

### 12.3 Utilisateurs
- Interface intuitive
- Documentation complète
- Support technique
- Formation des utilisateurs

---

## 13. Prochaines Étapes

### 13.1 Immédiates
- Configuration PostgreSQL
- Exécution des migrations
- Tests de base
- Déploiement

### 13.2 Court Terme
- Configuration des notifications
- Tests complets
- Formation des utilisateurs
- Mise en production

### 13.3 Long Terme
- Amélioration du reporting
- Intégrations externes
- Amélioration des tests
- Monitoring avancé

---

## 14. Conclusion

Le système KAMLOG EM-ERP est une solution complète de gestion d'entreprise intégrant tous les modules nécessaires pour une gestion efficace des opérations. L'architecture modulaire permet une évolutivité facile et l'intégration de nouvelles fonctionnalités.

**Statut Actuel**: 98% complet  
**Prêt pour déploiement**: Après configuration PostgreSQL

---

**Document Version**: 2.0  
**Date de mise à jour**: 15 Juin 2026  
**Auteur**: Cascade AI Assistant
