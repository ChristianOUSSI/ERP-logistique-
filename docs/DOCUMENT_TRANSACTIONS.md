# Document des Transactions - KAMLOG EM-ERP

**Version**: 1.0  
**Date**: 15 Juin 2026  
**Projet**: KAMLOG EM-ERP

---

## 1. Introduction

### 1.1 Objectif
Ce document décrit toutes les transactions du système KAMLOG EM-ERP, incluant les opérations CRUD, les workflows métier, et les intégrations entre modules.

### 1.2 Portée
Ce document couvre:
- Transactions de création, lecture, mise à jour, suppression (CRUD)
- Transactions de workflow
- Transactions d'intégration entre modules
- Transactions de notification
- Transactions de reporting

---

## 2. Transactions CRUD

### 2.1 Module Magasin

#### 2.1.1 Articles
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer article | POST | /api/articles | Créer un nouvel article |
| Lire article | GET | /api/articles/{id} | Lire un article par ID |
| Lister articles | GET | /api/articles | Lister tous les articles |
| Mettre à jour article | PUT | /api/articles/{id} | Mettre à jour un article |
| Supprimer article | DELETE | /api/articles/{id} | Supprimer un article |

#### 2.1.2 Bons d'Enlèvement Mag3
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer bon d'enlèvement | POST | /api/removal-slips | Créer un bon d'enlèvement |
| Lire bon d'enlèvement | GET | /api/removal-slips/{id} | Lire un bon d'enlèvement |
| Lister bons d'enlèvement | GET | /api/removal-slips | Lister tous les bons d'enlèvement |
| Mettre à jour bon d'enlèvement | PUT | /api/removal-slips/{id} | Mettre à jour un bon d'enlèvement |
| Supprimer bon d'enlèvement | DELETE | /api/removal-slips/{id} | Supprimer un bon d'enlèvement |
| Autoriser bon d'enlèvement | POST | /api/removal-slips/{id}/authorize | Autoriser un bon d'enlèvement |

#### 2.1.3 Réceptions Mag3
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer réception | POST | /api/reception-mag3 | Créer une réception |
| Lire réception | GET | /api/reception-mag3/{id} | Lire une réception |
| Lister réceptions | GET | /api/reception-mag3 | Lister toutes les réceptions |
| Mettre à jour réception | PUT | /api/reception-mag3/{id} | Mettre à jour une réception |
| Supprimer réception | DELETE | /api/reception-mag3/{id} | Supprimer une réception |
| Valider réception | POST | /api/reception-mag3/{id}/validate | Valider une réception |

#### 2.1.4 Mouvements de Stock
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer mouvement | POST | /api/stock-movements | Créer un mouvement de stock |
| Lire mouvement | GET | /api/stock-movements/{id} | Lire un mouvement de stock |
| Lister mouvements | GET | /api/stock-movements | Lister tous les mouvements de stock |
| Mettre à jour mouvement | PUT | /api/stock-movements/{id} | Mettre à jour un mouvement de stock |
| Supprimer mouvement | DELETE | /api/stock-movements/{id} | Supprimer un mouvement de stock |

### 2.2 Module Transport

#### 2.2.1 Déclarations de Marchandises
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer déclaration | POST | /api/goods-declarations | Créer une déclaration de marchandises |
| Lire déclaration | GET | /api/goods-declarations/{id} | Lire une déclaration de marchandises |
| Lister déclarations | GET | /api/goods-declarations | Lister toutes les déclarations |
| Mettre à jour déclaration | PUT | /api/goods-declarations/{id} | Mettre à jour une déclaration |
| Supprimer déclaration | DELETE | /api/goods-declarations/{id} | Supprimer une déclaration |

#### 2.2.2 Déclarations de Conteneurs
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer déclaration conteneur | POST | /api/container-declarations | Créer une déclaration de conteneur |
| Lire déclaration conteneur | GET | /api/container-declarations/{id} | Lire une déclaration de conteneur |
| Lister déclarations conteneurs | GET | /api/container-declarations | Lister toutes les déclarations de conteneurs |
| Mettre à jour déclaration conteneur | PUT | /api/container-declarations/{id} | Mettre à jour une déclaration de conteneur |
| Supprimer déclaration conteneur | DELETE | /api/container-declarations/{id} | Supprimer une déclaration de conteneur |

#### 2.2.3 Tickets Carburant
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer ticket carburant | POST | /api/fuel-tickets | Créer un ticket carburant |
| Lire ticket carburant | GET | /api/fuel-tickets/{id} | Lire un ticket carburant |
| Lister tickets carburant | GET | /api/fuel-tickets | Lister tous les tickets carburant |
| Mettre à jour ticket carburant | PUT | /api/fuel-tickets/{id} | Mettre à jour un ticket carburant |
| Supprimer ticket carburant | DELETE | /api/fuel-tickets/{id} | Supprimer un ticket carburant |

### 2.3 Module Finance

#### 2.3.1 Factures
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer facture | POST | /api/invoices | Créer une facture |
| Lire facture | GET | /api/invoices/{id} | Lire une facture |
| Lister factures | GET | /api/invoices | Lister toutes les factures |
| Mettre à jour facture | PUT | /api/invoices/{id} | Mettre à jour une facture |
| Supprimer facture | DELETE | /api/invoices/{id} | Supprimer une facture |

#### 2.3.2 Transactions Bancaires
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer transaction bancaire | POST | /api/bank-transactions | Créer une transaction bancaire |
| Lire transaction bancaire | GET | /api/bank-transactions/{id} | Lire une transaction bancaire |
| Lister transactions bancaires | GET | /api/bank-transactions | Lister toutes les transactions bancaires |
| Mettre à jour transaction bancaire | PUT | /api/bank-transactions/{id} | Mettre à jour une transaction bancaire |
| Supprimer transaction bancaire | DELETE | /api/bank-transactions/{id} | Supprimer une transaction bancaire |

#### 2.3.3 Réconciliation Bancaire
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer réconciliation | POST | /api/bank-reconciliation | Créer une réconciliation bancaire |
| Lire réconciliation | GET | /api/bank-reconciliation/{id} | Lire une réconciliation bancaire |
| Lister réconciliations | GET | /api/bank-reconciliation | Lister toutes les réconciliations bancaires |
| Mettre à jour réconciliation | PUT | /api/bank-reconciliation/{id} | Mettre à jour une réconciliation bancaire |
| Supprimer réconciliation | DELETE | /api/bank-reconciliation/{id} | Supprimer une réconciliation bancaire |

### 2.4 Module Parc

#### 2.4.1 Véhicules
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer véhicule | POST | /api/vehicles | Créer un véhicule |
| Lire véhicule | GET | /api/vehicles/{id} | Lire un véhicule |
| Lister véhicules | GET | /api/vehicles | Lister tous les véhicules |
| Mettre à jour véhicule | PUT | /api/vehicles/{id} | Mettre à jour un véhicule |
| Supprimer véhicule | DELETE | /api/vehicles/{id} | Supprimer un véhicule |

#### 2.4.2 Ordres de Travail
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer ordre de travail | POST | /api/work-orders | Créer un ordre de travail |
| Lire ordre de travail | GET | /api/work-orders/{id} | Lire un ordre de travail |
| Lister ordres de travail | GET | /api/work-orders | Lister tous les ordres de travail |
| Mettre à jour ordre de travail | PUT | /api/work-orders/{id} | Mettre à jour un ordre de travail |
| Supprimer ordre de travail | DELETE | /api/work-orders/{id} | Supprimer un ordre de travail |

### 2.5 Module Master Data

#### 2.5.1 Fournisseurs
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer fournisseur | POST | /api/suppliers | Créer un fournisseur |
| Lire fournisseur | GET | /api/suppliers/{id} | Lire un fournisseur |
| Lister fournisseurs | GET | /api/suppliers | Lister tous les fournisseurs |
| Mettre à jour fournisseur | PUT | /api/suppliers/{id} | Mettre à jour un fournisseur |
| Supprimer fournisseur | DELETE | /api/suppliers/{id} | Supprimer un fournisseur |
| Créer profil fournisseur | POST | /api/suppliers/{id}/profile | Créer un profil fournisseur |

#### 2.5.2 Incoterms
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer incoterm | POST | /api/incoterms | Créer un incoterm |
| Lire incoterm | GET | /api/incoterms/{id} | Lire un incoterm |
| Lister incoterms | GET | /api/incoterms | Lister tous les incoterms |
| Mettre à jour incoterm | PUT | /api/incoterms/{id} | Mettre à jour un incoterm |
| Supprimer incoterm | DELETE | /api/incoterms/{id} | Supprimer un incoterm |

#### 2.5.3 Types de Conteneurs
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer type de conteneur | POST | /api/container-types | Créer un type de conteneur |
| Lire type de conteneur | GET | /api/container-types/{id} | Lire un type de conteneur |
| Lister types de conteneurs | GET | /api/container-types | Lister tous les types de conteneurs |
| Mettre à jour type de conteneur | PUT | /api/container-types/{id} | Mettre à jour un type de conteneur |
| Supprimer type de conteneur | DELETE | /api/container-types/{id} | Supprimer un type de conteneur |

#### 2.5.4 Unités de Mesure
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer unité de mesure | POST | /api/units | Créer une unité de mesure |
| Lire unité de mesure | GET | /api/units/{id} | Lire une unité de mesure |
| Lister unités de mesure | GET | /api/units | Lister toutes les unités de mesure |
| Mettre à jour unité de mesure | PUT | /api/units/{id} | Mettre à jour une unité de mesure |
| Supprimer unité de mesure | DELETE | /api/units/{id} | Supprimer une unité de mesure |

#### 2.5.5 Catégories d'Articles
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer catégorie d'article | POST | /api/article-categories | Créer une catégorie d'article |
| Lire catégorie d'article | GET | /api/article-categories/{id} | Lire une catégorie d'article |
| Lister catégories d'articles | GET | /api/article-categories | Lister toutes les catégories d'articles |
| Mettre à jour catégorie d'article | PUT | /api/article-categories/{id} | Mettre à jour une catégorie d'article |
| Supprimer catégorie d'article | DELETE | /api/article-categories/{id} | Supprimer une catégorie d'article |

### 2.6 Module Admin

#### 2.6.1 Utilisateurs
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer utilisateur | POST | /api/users | Créer un utilisateur |
| Lire utilisateur | GET | /api/users/{id} | Lire un utilisateur |
| Lister utilisateurs | GET | /api/users | Lister tous les utilisateurs |
| Mettre à jour utilisateur | PUT | /api/users/{id} | Mettre à jour un utilisateur |
| Supprimer utilisateur | DELETE | /api/users/{id} | Supprimer un utilisateur |

#### 2.6.2 Rôles
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer rôle | POST | /api/roles | Créer un rôle |
| Lire rôle | GET | /api/roles/{id} | Lire un rôle |
| Lister rôles | GET | /api/roles | Lister tous les rôles |
| Mettre à jour rôle | PUT | /api/roles/{id} | Mettre à jour un rôle |
| Supprimer rôle | DELETE | /api/roles/{id} | Supprimer un rôle |

#### 2.6.3 Permissions
| Transaction | Méthode | Endpoint | Description |
|-------------|---------|----------|-------------|
| Créer permission | POST | /api/permissions | Créer une permission |
| Lire permission | GET | /api/permissions/{id} | Lire une permission |
| Lister permissions | GET | /api/permissions | Lister toutes les permissions |
| Mettre à jour permission | PUT | /api/permissions/{id} | Mettre à jour une permission |
| Supprimer permission | DELETE | /api/permissions/{id} | Supprimer une permission |

---

## 3. Transactions de Workflow

### 3.1 Workflow Mag3

#### 3.1.1 Création du Bon d'Enlèvement
**Transaction**: `POST /api/removal-slips`

**Payload**:
```json
{
  "article_id": 1,
  "quantity": 100,
  "source_warehouse_id": 1,
  "destination_warehouse_id": 2,
  "requested_by": 1,
  "notes": "Demande urgente"
}
```

**Réponse**:
```json
{
  "id": 1,
  "status": "EN_ATTENTE",
  "article_id": 1,
  "quantity": 100,
  "source_warehouse_id": 1,
  "destination_warehouse_id": 2,
  "requested_by": 1,
  "created_at": "2026-06-15T10:00:00Z",
  "notification_sent": true
}
```

**Notifications envoyées**:
- Type: AUTHORIZATION_REQUEST
- Destinataires: Responsable du magasin
- Priorité: HIGH

#### 3.1.2 Autorisation du Bon d'Enlèvement
**Transaction**: `POST /api/removal-slips/{id}/authorize`

**Payload**:
```json
{
  "authorized_by": 2,
  "authorization_notes": "Autorisé pour livraison"
}
```

**Réponse**:
```json
{
  "id": 1,
  "status": "AUTORISE",
  "authorized_by": 2,
  "authorized_at": "2026-06-15T10:30:00Z",
  "notification_sent": true
}
```

**Notifications envoyées**:
- Type: AUTHORIZATION_GRANTED
- Destinataires: Demandeur
- Priorité: MEDIUM

#### 3.1.3 Création de la Réception
**Transaction**: `POST /api/reception-mag3`

**Payload**:
```json
{
  "removal_slip_id": 1,
  "expected_quantity": 100,
  "received_by": 3,
  "notes": "Réception en attente"
}
```

**Réponse**:
```json
{
  "id": 1,
  "removal_slip_id": 1,
  "status": "EN_COURS",
  "expected_quantity": 100,
  "received_by": 3,
  "created_at": "2026-06-15T11:00:00Z",
  "notification_sent": true
}
```

**Notifications envoyées**:
- Type: RECEPTION_CREATED
- Destinataires: Responsable du magasin destination
- Priorité: MEDIUM

#### 3.1.4 Validation de la Réception
**Transaction**: `POST /api/reception-mag3/{id}/validate`

**Payload**:
```json
{
  "received_quantity": 100,
  "validated_by": 3,
  "validation_notes": "Quantité conforme"
}
```

**Réponse**:
```json
{
  "id": 1,
  "removal_slip_id": 1,
  "status": "COMPLETEE",
  "expected_quantity": 100,
  "received_quantity": 100,
  "validated_by": 3,
  "validated_at": "2026-06-15T11:30:00Z",
  "stock_updated": true,
  "removal_slip_status": "COMPLETEE",
  "notification_sent": true
}
```

**Transactions internes**:
- Mise à jour du stock (source: -100, destination: +100)
- Mise à jour du statut du bon d'enlèvement
- Création du mouvement de stock

**Notifications envoyées**:
- Type: RECEPTION_VALIDATED
- Destinataires: Demandeur, Responsable du magasin source
- Priorité: HIGH
- Type: STOCK_UPDATED
- Destinataires: Responsable du magasin destination
- Priorité: MEDIUM
- Type: WORKFLOW_COMPLETED
- Destinataires: Demandeur, Responsable du magasin source, Responsable du magasin destination
- Priorité: HIGH

### 3.2 Workflow de Facturation

#### 3.2.1 Création de la Facture
**Transaction**: `POST /api/invoices`

**Payload**:
```json
{
  "client_id": 1,
  "amount": 1000.00,
  "due_date": "2026-07-15",
  "items": [
    {
      "article_id": 1,
      "quantity": 10,
      "unit_price": 100.00
    }
  ]
}
```

**Réponse**:
```json
{
  "id": 1,
  "client_id": 1,
  "amount": 1000.00,
  "status": "EN_ATTENTE",
  "due_date": "2026-07-15",
  "created_at": "2026-06-15T12:00:00Z"
}
```

#### 3.2.2 Validation de la Facture
**Transaction**: `POST /api/invoices/{id}/validate`

**Payload**:
```json
{
  "validated_by": 2
}
```

**Réponse**:
```json
{
  "id": 1,
  "status": "VALIDEE",
  "validated_by": 2,
  "validated_at": "2026-06-15T12:30:00Z"
}
```

#### 3.2.3 Envoi au Client
**Transaction**: `POST /api/invoices/{id}/send`

**Payload**:
```json
{
  "sent_by": 2
}
```

**Réponse**:
```json
{
  "id": 1,
  "status": "ENVOYEE",
  "sent_by": 2,
  "sent_at": "2026-06-15T13:00:00Z"
}
```

---

## 4. Transactions d'Intégration

### 4.1 Intégration Magasin → Finance

#### 4.1.1 Création de Facture à partir de Réception
**Transaction**: `POST /api/invoices/from-reception`

**Payload**:
```json
{
  "reception_id": 1,
  "client_id": 1
}
```

**Réponse**:
```json
{
  "id": 1,
  "reception_id": 1,
  "client_id": 1,
  "amount": 1000.00,
  "status": "EN_ATTENTE"
}
```

### 4.2 Intégration Transport → Magasin

#### 4.2.1 Création de Mouvement de Stock à partir de Déclaration
**Transaction**: `POST /api/stock-movements/from-declaration`

**Payload**:
```json
{
  "declaration_id": 1,
  "warehouse_id": 1
}
```

**Réponse**:
```json
{
  "id": 1,
  "declaration_id": 1,
  "warehouse_id": 1,
  "quantity": 100,
  "movement_type": "ENTREE"
}
```

### 4.3 Intégration Parc → Finance

#### 4.3.1 Création de Transaction Bancaire à partir d'Ordre de Travail
**Transaction**: `POST /api/bank-transactions/from-work-order`

**Payload**:
```json
{
  "work_order_id": 1,
  "amount": 500.00,
  "transaction_type": "DEBIT"
}
```

**Réponse**:
```json
{
  "id": 1,
  "work_order_id": 1,
  "amount": 500.00,
  "transaction_type": "DEBIT",
  "status": "EN_ATTENTE"
}
```

---

## 5. Transactions de Notification

### 5.1 Création de Notification
**Transaction**: `POST /api/notifications`

**Payload**:
```json
{
  "type": "AUTHORIZATION_REQUEST",
  "priority": "HIGH",
  "recipient_id": 2,
  "title": "Demande d'autorisation",
  "message": "Bon d'enlèvement #1 nécessite une autorisation",
  "data": {
    "removal_slip_id": 1
  }
}
```

**Réponse**:
```json
{
  "id": 1,
  "type": "AUTHORIZATION_REQUEST",
  "priority": "HIGH",
  "recipient_id": 2,
  "title": "Demande d'autorisation",
  "message": "Bon d'enlèvement #1 nécessite une autorisation",
  "status": "NON_LUE",
  "created_at": "2026-06-15T10:00:00Z"
}
```

### 5.2 Lister les Notifications
**Transaction**: `GET /api/notifications`

**Paramètres**:
- `recipient_id`: ID du destinataire
- `status`: Statut de la notification (NON_LUE, LUE, ARCHIVEE)
- `type`: Type de notification

**Réponse**:
```json
{
  "notifications": [
    {
      "id": 1,
      "type": "AUTHORIZATION_REQUEST",
      "priority": "HIGH",
      "recipient_id": 2,
      "title": "Demande d'autorisation",
      "message": "Bon d'enlèvement #1 nécessite une autorisation",
      "status": "NON_LUE",
      "created_at": "2026-06-15T10:00:00Z"
    }
  ],
  "total": 1
}
```

### 5.3 Marquer Notification comme Lue
**Transaction**: `POST /api/notifications/{id}/mark-read`

**Réponse**:
```json
{
  "id": 1,
  "status": "LUE",
  "read_at": "2026-06-15T10:30:00Z"
}
```

---

## 6. Transactions de Reporting

### 6.1 Générer Rapport de Stock
**Transaction**: `POST /api/reports/stock`

**Payload**:
```json
{
  "warehouse_id": 1,
  "article_category_id": 1,
  "date_from": "2026-06-01",
  "date_to": "2026-06-30",
  "format": "PDF"
}
```

**Réponse**:
```json
{
  "report_id": 1,
  "status": "EN_GENERATION",
  "format": "PDF",
  "created_at": "2026-06-15T14:00:00Z"
}
```

### 6.2 Télécharger Rapport
**Transaction**: `GET /api/reports/{id}/download`

**Réponse**: Fichier PDF/Excel

### 6.3 Lister Rapports
**Transaction**: `GET /api/reports`

**Réponse**:
```json
{
  "reports": [
    {
      "id": 1,
      "type": "STOCK",
      "status": "COMPLETE",
      "format": "PDF",
      "created_at": "2026-06-15T14:00:00Z"
    }
  ]
}
```

---

## 7. Transactions de Fiche de Besoin

### 7.1 Créer Fiche de Besoin
**Transaction**: `POST /api/needs-requests`

**Payload**:
```json
{
  "matricule": "ART001",
  "designation": "Article de test",
  "quantity": 10,
  "unit_id": 1,
  "date": "2026-06-15",
  "department_id": 1,
  "requested_by": 1,
  "notes": "Besoin urgent"
}
```

**Réponse**:
```json
{
  "id": 1,
  "matricule": "ART001",
  "designation": "Article de test",
  "quantity": 10,
  "unit_id": 1,
  "date": "2026-06-15",
  "department_id": 1,
  "requested_by": 1,
  "status": "EN_ATTENTE",
  "created_at": "2026-06-15T15:00:00Z"
}
```

### 7.2 Valider Fiche de Besoin
**Transaction**: `POST /api/needs-requests/{id}/validate`

**Payload**:
```json
{
  "validated_by": 2,
  "validation_status": "APPROUVE",
  "notes": "Demande approuvée"
}
```

**Réponse**:
```json
{
  "id": 1,
  "status": "APPROUVE",
  "validated_by": 2,
  "validated_at": "2026-06-15T15:30:00Z",
  "validation_notes": "Demande approuvée"
}
```

### 7.3 Imprimer Fiche de Besoin
**Transaction**: `POST /api/needs-requests/{id}/print`

**Réponse**: Fichier PDF

---

## 8. Transactions de Rapport d'Incident

### 8.1 Créer Rapport d'Incident
**Transaction**: `POST /api/incident-reports`

**Payload**:
```json
{
  "matricule": "VEH001",
  "date": "2026-06-15",
  "time": "10:30",
  "location": "Dépôt principal",
  "department_id": 1,
  "description": "Collision avec un autre véhicule",
  "impact": "Dégâts matériels",
  "actions_taken": "Véhicule immobilisé",
  "reported_by": 1
}
```

**Réponse**:
```json
{
  "id": 1,
  "matricule": "VEH001",
  "date": "2026-06-15",
  "time": "10:30",
  "location": "Dépôt principal",
  "department_id": 1,
  "description": "Collision avec un autre véhicule",
  "impact": "Dégâts matériels",
  "actions_taken": "Véhicule immobilisé",
  "reported_by": 1,
  "status": "EN_COURS",
  "created_at": "2026-06-15T16:00:00Z"
}
```

### 8.2 Mettre à Jour Rapport d'Incident
**Transaction**: `PUT /api/incident-reports/{id}`

**Payload**:
```json
{
  "status": "RESOLU",
  "resolution_notes": "Réparation effectuée",
  "resolved_by": 2
}
```

**Réponse**:
```json
{
  "id": 1,
  "status": "RESOLU",
  "resolution_notes": "Réparation effectuée",
  "resolved_by": 2,
  "resolved_at": "2026-06-15T17:00:00Z"
}
```

### 8.3 Imprimer Rapport d'Incident
**Transaction**: `POST /api/incident-reports/{id}/print`

**Réponse**: Fichier PDF

---

## 9. Codes d'Erreur

### 9.1 Erreurs de Validation
| Code | Message | Description |
|------|---------|-------------|
| VAL001 | Données invalides | Les données fournies ne sont pas valides |
| VAL002 | Champ requis manquant | Un champ requis est manquant |
| VAL003 | Format invalide | Le format d'un champ est invalide |
| VAL004 | Valeur hors plage | La valeur est hors de la plage autorisée |

### 9.2 Erreurs d'Authentification
| Code | Message | Description |
|------|---------|-------------|
| AUTH001 | Non authentifié | L'utilisateur n'est pas authentifié |
| AUTH002 | Token invalide | Le token JWT est invalide |
| AUTH003 | Token expiré | Le token JWT a expiré |
| AUTH004 | MFA requis | L'authentification à deux facteurs est requise |

### 9.3 Erreurs d'Autorisation
| Code | Message | Description |
|------|---------|-------------|
| PERM001 | Permission refusée | L'utilisateur n'a pas la permission requise |
| PERM002 | Rôle insuffisant | Le rôle de l'utilisateur est insuffisant |

### 9.4 Erreurs de Ressource
| Code | Message | Description |
|------|---------|-------------|
| RES001 | Ressource non trouvée | La ressource demandée n'existe pas |
| RES002 | Ressource déjà existante | La ressource existe déjà |
| RES003 | Conflit de ressources | Conflit de ressources |

### 9.5 Erreurs de Workflow
| Code | Message | Description |
|------|---------|-------------|
| WFL001 | Statut invalide | Le statut du workflow est invalide |
| WFL002 | Transition non autorisée | La transition de statut n'est pas autorisée |
| WFL003 | Workflow déjà complété | Le workflow est déjà complété |

---

## 10. Performance

### 10.1 Temps de Réponse
- Transactions CRUD: < 200ms
- Transactions de workflow: < 500ms
- Transactions de reporting: < 5s (génération)
- Transactions d'intégration: < 1s

### 10.2 Débit
- 1000 requêtes/second pour les transactions CRUD
- 500 requêtes/second pour les transactions de workflow
- 100 requêtes/second pour les transactions de reporting

---

## 11. Sécurité

### 11.1 Authentification
- Toutes les transactions nécessitent une authentification JWT
- MFA requis pour les transactions sensibles
- Refresh tokens pour la gestion des sessions

### 11.2 Autorisation
- Vérification des permissions sur chaque transaction
- RBAC (Role-Based Access Control)
- Audit trail pour toutes les transactions

### 11.3 Validation
- Validation des données côté backend
- Sanitization des inputs
- Protection contre les injections SQL

---

## 12. Conclusion

Ce document décrit toutes les transactions du système KAMLOG EM-ERP. Il sert de référence pour les développeurs, les testeurs et les administrateurs système.

**Document Version**: 1.0  
**Date de mise à jour**: 15 Juin 2026  
**Auteur**: Cascade AI Assistant
