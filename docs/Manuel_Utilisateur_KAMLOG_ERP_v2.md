# Manuel d’utilisation (Ultra-détaillé) — KAMLOG EM-ERP

> **Version : v2 (brouillon enrichi)**
>
> Ce document est conçu pour être une base de manuel **≥ 25 pages** et pour décrire **toutes** les fonctionnalités : modules, interactions, logique RBAC, sécurité, workflows bout-en-bout, et ce qui est **connecté / partiel / placeholder**.

> **Note importante (fiabilité documentaire)** : comme le projet a de nombreuses pages/flux et que l’extraction exhaustive “UI ↔ API ↔ services” nécessite une cartographie plus profonde, ce document v2 contient :
> - une **structure complète** et **opérationnelle** prête à être complétée cellule par cellule,
> - les sections **déjà inférables** avec précision à partir du code (architecture, routes, middlewares, CORS, health checks, exemple de tiers).
> Ensuite, la rédaction doit être complétée en “poursuivant la revue repo” pour remplir chaque module avec les actions UI exactes.

---

## Sommaire

1. Introduction
2. Philosophie de l’ERP (workflow global)
3. Accès au système : connexion, session, sécurité
4. Rôles (RBAC) et permissions
5. Navigation générale (UI)
6. Santé & diagnostics (health checks)
7. Scénario transversal “de bout en bout”
8. Administration & Audit
9. Données Maîtres — Tiers
10. Données Maîtres — Articles / catalogue
11. Transport (K-Transport)
12. Documents (K-Docs)
13. Parc & Yard Management (Gate / Workshop / Maintenance)
14. Magasin (Mag3, Stocks, Reception/Removal)
15. Finance (Factures, Encaissements, Lettrage)
16. Transactions & Journal
17. Notifications
18. Incidents & Support interne
19. Achats (Purchase / Requisitions)
20. RH (Employés / Congés / Paie)
21. Gateway & intégration inter-modules
22. Portails externes : B2B & Client Portal
23. Fonctionnalités cachées / en cours / placeholder
24. Annexe A — Glossaire
25. Annexe B — Cartographie API (par préfixe)
26. Annexe C — Procédure d’exploitation minimale

---

## 1) Introduction

### 1.1 À qui s’adresse ce manuel ?
Ce manuel est destiné à toute personne amenée à utiliser KAMLOG EM-ERP au quotidien :
- opérateurs logistiques (dispatch, suivi véhicules),
- agents magasin (réceptions, stocks, Mag3),
- agents finance (facturation, encaissements, lettrage),
- administrateurs (utilisateurs, rôles, audit),
- responsables supervision (tableaux de bord),
- utilisateurs externes (portail client / B2B),
- équipe CADC (support et évolution).

### 1.2 Ce que KAMLOG EM-ERP fait (résumé)
KAMLOG EM-ERP est un **ERP logistique portuaire** sous forme de **monolithe modulaire** :
- **Backend** : FastAPI
- **Frontend** : Next.js
- **DB** : PostgreSQL
- **Cache & mécanismes transverses** : Redis
- **Documents/objets** : MinIO (prévu/optionnel)
- **Observabilité** : Prometheus côté API
- **Middlewares** : AuditMiddleware, IdempotencyMiddleware, rate limiting (SlowAPI)

---

## 2) Philosophie de l’ERP (workflow global)

Le système est conçu comme une chaîne :
1. **Données Maîtres** (Tiers, Articles)
2. **Transport / Dispatch** (création OT / missions)
3. **Documents (K-Docs)** (génération BL)
4. **Parc / Gate** (Gate In / Gate Out, workshop maintenance)
5. **Magasin / Stock** (réceptions, Mag3, mouvements)
6. **Finance** (factures depuis OT, encaissements, lettrage)
7. **Audit & Notifications** (traçabilité et information)

> Règle de base : **aucune action “opérationnelle” ne doit être faite sans les données maîtres correspondantes**.

---

## 3) Accès au système : connexion, session, sécurité

### 3.1 URLs & endpoints principaux
- Frontend Next.js : port 3000 (local via docker-compose)
- API FastAPI : port 8000
- Swagger : `http://localhost:8000/api/docs`
- ReDoc : `http://localhost:8000/api/redoc`

### 3.2 Démarrage local (docker-compose)
Le repo inclut un démarrage docker-compose pour :
- `db` (PostgreSQL)
- `redis`
- `minio`
- `api` (FastAPI)
- `frontend` (Next.js)

### 3.3 Health checks
Le backend expose :
- `GET /api/health`
  - renvoie `ok` si `startup_errors` est vide
  - renvoie `degraded` avec erreurs si dépendances indisponibles
- `GET /api/health/detailed`
  - vérifie DB (obligatoire), Redis (optionnel), MinIO (optionnel)

### 3.4 Sécurité transport des sessions
Côté frontend, les appels backend sont faits via un **client Axios central** (`src/lib/api-client.ts`) :
- **Connexion** : le frontend récupère un token/séquence de session après authentification.
- **Transport des requêtes** : le client attache automatiquement les en-têtes nécessaires.
- **Gestion d’expiration** : si le token expire, le client redirige vers l’écran de connexion (selon l’implémentation).
- **Anti-double-soumission** : certaines opérations s’appuient sur un identifiant d’idempotence côté backend.
- **Erreurs standardisées** : les réponses d’erreur sont compréhensibles côté UI (toast/alert) + code de diagnostic.

> Objectif utilisateur : vous n’avez pas à “gérer” ces détails. Votre action se limite à cliquer, valider et suivre les statuts.

### 3.5 Sécurité applicative : RBAC + Audit
En complément du contrôle d’accès (RBAC), chaque action importante est journalisée :
- **qui** a fait l’action (utilisateur),
- **quoi** (ressource / endpoint),
- **quand** (timestamp),
- **avec quelles données** (selon niveau de journalisation).

### 3.6 MFA / Sécurité renforcée (si activée)
Selon la configuration :
- **MFA** = ajout d’une seconde étape à la connexion (TOTP)
- **Codes de secours** = utilisation si l’app MFA est indisponible.

Le backend fournit/contrôle :
- `POST /api/auth/mfa/setup`
- `POST /api/auth/mfa/enable`
- `POST /api/auth/mfa/disable`
- `POST /api/auth/mfa/verify-backup`
- `GET /api/auth/mfa/status`

### 3.7 Bonnes pratiques d’utilisation
- Ne laissez jamais une session ouverte sur un poste partagé.
- En cas d’erreur “non autorisé”, ne répétez pas : vérifiez d’abord votre rôle.
- Pour les opérations critiques (validation, génération document), attendez la fin du statut côté UI.
- En cas de double clic/lenteur réseau, l’idempotence côté backend protège certaines opérations.

---

## 4) Rôles (RBAC) et permissions

KAMLOG utilise une stratégie **RBAC** (Role-Based Access Control) :
- Un utilisateur appartient à **une ou plusieurs roles**.
- Les roles possèdent des **permissions** (codes de permissions en base).
- L’accès à un endpoint/une action dépend des permissions ou d’un rôle spécial **admin**.

### 4.1 Comment l’API décide que vous avez le droit
Le contrôle RBAC se base sur `app/utils/rbac.py` :
- si l’utilisateur a un rôle `admin` : accès autorisé (saut des checks permission/module)
- sinon :
  - **permissions exactes** : `require_permission("<permission-code>")`
  - **accès par module** : `check_module_permission("<module>")` vérifie si vous avez une permission qui commence par `"<module>:"`
  - rôle exact : `require_role([...])` autorise selon les codes de roles.

### 4.2 Codes et conventions de permissions
Les permissions sont stockées sous forme de **codes**.
- Pour le contrôle “par module” : codes qui commencent par `module:`
  - exemple conceptuel : `transport:create`, `magasin:reception`, etc.
- Pour la “permission exacte” : un code précis est requis.
- Pour un rôle complet (optionnel côté seed/config) : `*` peut indiquer un accès total.

> Le manuel “parle bien” ici : si vous ne savez pas le code permission exact, vous devez vous appuyer sur l’UI (menus désactivés/absents) et sur la section Admin (chapitre 8) pour afficher la matrice.

### 4.3 Erreurs fréquentes et ce qu’elles signifient
1) **401 Non authentifié**
- Cause : token manquant/expiré.
- Action : reconnectez-vous (ou rafraîchissez votre session).

2) **403 Forbidden — “Roles not authorized.”**
- Cause : vous êtes authentifié, mais aucun de vos roles n’est dans la liste attendue.
- Action : contactez un admin pour changer votre rôle.

3) **403 Forbidden — “Permission <code> not granted”**
- Cause : permission exacte manquante.
- Action : contactez l’admin pour ajouter la permission au rôle.

4) **403 Forbidden — “Access denied to module <module>”**
- Cause : vous n’avez aucune permission `module:`.
- Action : ajout d’une permission commençant par `module:` au rôle.

### 4.4 Rôles typiques (exemples de rendu)
Le backend expose des endpoints d’administration permettant de lister roles/permissions.
- `GET /api/admin/roles`
- `GET /api/admin/permissions`

Exemples (à adapter à vos seeds) :
- **guest** : accès minimal (souvent lecture très limitée)
- **admin** : accès total
- **transport_agent** : accès au module Transport (permissions `transport:*`)
- **warehouse_agent** : accès au module Magasin (permissions `magasin:*`)
- **finance_agent** : accès Finance (permissions `finance:*`)

> Important : les “codes” exacts dépendent des données en DB (seed). La logique de contrôle est celle décrite plus haut.

### 4.5 RBAC “sur l’interface” : ce que vous verrez en pratique
Concrètement :
- certains menus/pages peuvent ne pas apparaître
- certains boutons sont désactivés ou affichent une erreur 403
- les actions critiques (validation, génération document, clôture) sont généralement protégées par RBAC + audit.

---

## 7) Scénario transversal “de bout en bout” (OT → BL → Mag3 → Finance → Audit)

Ce scénario décrit une chaîne complète typique. Les noms exacts des boutons peuvent varier selon l’écran, mais la logique métier reste la même.

### 7.1 Prérequis (les maîtres obligatoires)
Avant toute opération :
1) **Tiers** :
- client (acheteur)
- fournisseur/transport si nécessaire
2) **Articles** :
- codes article (services/logistique) utilisés pour la facturation et/ou les quantités
3) **Règles/RBAC** :
- le rôle de l’utilisateur doit permettre d’exécuter Transport, Documents, Magasin, Finance.

### 7.2 Étape A — Transport : créer et valider un Ordre de Transport (OT)
Objectif : produire la mission “officielle” qui sera ensuite facturée et documentée.
- UI (Transport / Dispatch) :
  1. sélectionner le **client tiers**
  2. saisir origine/destination
  3. assigner camion/chauffeur si requis
  4. **valider l’OT**

Statuts attendus (conceptuellement) :
- Brouillon → Validé/Prêt pour traitement documentaire

### 7.3 Étape B — Documents : générer le BL (via K-Docs)
Objectif : transformer l’OT validé en un document d’expédition.
- UI (Documents K-Docs) :
  1. rechercher l’OT validé
  2. cliquer “Générer BL” / “Imprimer Bon de Livraison”

Fiabilité : la génération BL s’appuie sur les données déjà présentes (OT + tiers + articles), pas sur une saisie libre.

### 7.4 Étape C — Parc / Gate (si activé) : traçabilité entrée/sortie
Objectif : tracer physiquement le passage dans la cour.
- UI (Parc Gate In / Gate Out) :
  - valider arrivée/départ (souvent avec numéro conteneur/OT)

### 7.5 Étape D — Magasin (Mag3) : Réception / Mouvement
Objectif : refléter physiquement les quantités en stock.
- UI (Magasin → Réceptions Mag3) :
  1. sélectionner le document source (souvent BL validé / OT validé)
  2. saisir/valider la réception (quantités)
  3. valider les mouvements

Résultat : le stock devient consultable et les mouvements sont tracés.

### 7.6 Étape E — Finance : générer la facture + encaissements/lettrage
Objectif : monétiser l’opération logistique.
- UI (Finance → Factures clients) :
  1. rechercher l’OT (ou le BL lié)
  2. créer la facture
  3. valider/enregistrer + imprimer/envoyer

Puis :
- UI (Finance → Paiements/Encaissements) : enregistrer paiement
- UI (Finance → Lettrage) : lier encaissement ↔ facture

### 7.7 Audit & Notifications : preuve et traçabilité
Le backend enregistre un audit via `AuditMiddleware` :
- user_id, agency_id
- endpoint/path, query params, résumé body
- status code, durée
- heuristique tcode/module depuis le path

En pratique, cela sert à :
- retrouver “qui a fait quoi”
- vérifier l’enchaînement (OT → BL → stock → facture)
- investiguer en cas d’écart

---

## 5) Navigation générale (UI)

Cette section décrit comment travailler efficacement dans KAMLOG EM-ERP : comment se repérer dans l’interface, quelles conventions suivent les écrans (listes, formulaires, statuts), et comment éviter les erreurs classiques.

### 5.1 Principaux repères
- **Barre supérieure** : accès rapide aux grands modules (Transport, Documents, Parc, Magasin, Finance…), et actions globales (profil, déconnexion).
- **Menu latéral** : structure par module puis sous-écrans (listes, création, détail).
- **Zone centrale** :
  - **Listes** : tableau + filtres + pagination.
  - **Détails** : informations + historique/traçabilité quand disponible.
  - **Formulaires** : création/modification d’un enregistrement.

### 5.2 Conventions UI à connaître
- **Champs obligatoires** : souvent marqués visuellement (ou validés côté API). En cas d’erreur, l’API renvoie un 4xx avec un message exploitable.
- **Boutons d’action** : les actions critiques (valider une mission, clôturer un traitement, générer un document, bloquer/débloquer un véhicule) sont généralement protégées par RBAC.
- **Statuts** : presque toutes les entités ont un attribut `statut` ou un workflow (Brouillon → Validé → Terminé…).

### 5.3 Comment comprendre les erreurs
- **401** : vous n’êtes pas authentifié (session expirée).
- **403** : authentifié mais RBAC refuse (permissions/roles).
- **400** : donnée invalide (cohérence métier : identifiant déjà existant, montant incohérent, etc.).

### 5.4 Bonnes pratiques opérateur
- Travailler du **haut vers le bas du workflow global** : Tiers/Articles → OT/Missions → BL → Mag3 → Finance.
- Ne jamais “créer” un objet opérationnel sans maîtriser les **données maîtres** associées.
- En cas de lenteur réseau, éviter le double-clic : l’API peut utiliser l’idempotence sur certaines opérations.

---

## 6) Santé & diagnostics (health checks)

KAMLOG EM-ERP expose des endpoints de diagnostic afin que l’équipe exploitation puisse identifier rapidement si la plateforme est fonctionnelle.

### 6.1 Endpoint simple
- `GET /api/health`

Interprétation (conceptuellement) :
- **ok** : startup_errors vide.
- **degraded** : dépendances indisponibles ou état partiel.

### 6.2 Endpoint détaillé
- `GET /api/health/detailed`

Ce que vous devez surveiller :
- **DB** : obligatoire (si down, le système ne doit pas être considéré “sain”).
- **Redis** : optionnel (peut impacter cache, certains mécanismes transverses).
- **MinIO** : optionnel (impact documents/archives si activé).

### 6.3 Actions en cas d’alerte
- Si **DB** en échec : vérifier connectivité Postgres, migrations et credentials.
- Si **Redis** en échec : vérifier service Redis (cache, queues, idempotence/notifications selon implémentation).
- Si **MinIO** en échec : vérifier configuration MinIO et accès bucket.

---

## 7) Scénario transversal “de bout en bout” (rappel complet)

> Chapitre déjà présent : cette version v2 complète l’approche opérationnelle (statuts, contrôle qualité, et où regarder les preuves).

### 7.1 De bout en bout : OT → BL → Parc/Gate → Mag3 → Finance
1. **Tiers & Articles** : vérifier que le client et les articles requis existent et sont activés.
2. **Transport (OT/Mission)** : créer/valider une mission ; assigner camion/chauffeur si requis.
3. **Documents (K-Docs)** : générer le Bon de Livraison (BL) depuis l’OT validé.
4. **Parc / Gate (si activé)** : enregistrer Gate In/Gate Out (traçabilité physique).
5. **Magasin (Mag3)** : réceptionner le stock lié au document source et valider les mouvements.
6. **Finance** : générer la facture ; enregistrer encaissement ; faire le lettrage.
7. **Audit** : vérifier l’historique des actions (qui, quoi, quand) et les notifications associées.

### 7.2 Contrôles de cohérence (avant de valider)
- Les références OT/Mission existent bien (pas de BL “sans source”).
- Les quantités en Mag3 correspondent au document (éviter les écarts de réception).
- Les permissions RBAC du profil utilisateur permettent l’action de validation.

---

## 8) Administration & Audit

### 8.1 Objectif
L’administration regroupe : gestion des utilisateurs, assignation des roles/permissions, et consultation des traces (audit) pour la conformité.

### 8.2 Ce que couvre l’audit
Chaque action importante est journalisée :
- **acteur** : `user_id` / username
- **scope** : agency/site (selon modèle)
- **cible** : endpoint/ressource (path)
- **payload** : résumé utile (selon niveau)
- **status** : code retour + durée

### 8.3 Accès admin (logique)
- Les endpoints d’administration dépendent de RBAC.
- Les listes (roles/permissions) et l’assignation se font typiquement depuis le module Admin.

### 8.4 Conduite en cas de “mauvaise autorisation”
- Vérifier le **role** effectif de l’utilisateur.
- Vérifier la **permission exacte** attendue (`<module>:<action>` ou `<permission-code>` selon le check).
- Vérifier si un rôle admin est requis (ex: certaines opérations ne sont pas ouvertes aux dispatchers).

---

## 9) Données Maîtres — Tiers

### 9.1 Objectif
Un **tiers** représente un client, un fournisseur, ou toute entité externe.

### 9.2 Pré-requis
- Avoir un profil utilisateur disposant des permissions de gestion master data.

### 9.3 Parcours opérateur (UI)
1. Ouvrir **Données Maîtres → Tiers**.
2. Cliquer **Nouveau Tiers**.
3. Remplir :
   - Raison sociale
   - Code tiers (identifiant court)
   - Contact/Adresse
4. Activer les services autorisés (transport, magasin, accorage…) selon vos besoins.
5. Enregistrer.

### 9.4 Règles de validation (côté API)
- Un code/identifiant peut être unique : les doublons peuvent provoquer un 400.

### 9.5 Erreurs fréquentes
- **Doublon de code tiers** : récupérer le tiers existant au lieu de créer une nouvelle entrée.
- **403 Forbidden** : rôle/permission insuffisants.

---

## 10) Données Maîtres — Articles / catalogue

### 10.1 Objectif
Les **articles** servent à standardiser les prestations/produits facturés et les lignes de stock.

### 10.2 Pré-requis
- Permissions de création/édition master data.

### 10.3 Parcours opérateur
1. Ouvrir **Données Maîtres → Articles**.
2. Cliquer **Nouveau Article**.
3. Renseigner :
   - libellé / code
   - type (prestation / produit / service)
   - paramètres de facturation (si disponibles)
4. Activer l’article.

### 10.4 Erreurs fréquentes
- Article non activé ⇒ impossibilité de sélectionner l’article dans Transport/Finance/Magasin.

---

## 11) Transport (K-Transport)

K-Transport regroupe la gestion de flotte, chauffeurs, missions (dispatch) et la gestion carburant/maintenance.

### 11.1 Objectifs métier
- Planifier et exécuter des missions de transport.
- Maintenir la flotte : maintenance, pannes, blocage HSE.
- Produire les éléments nécessaires au document (BL) et à la facture.

### 11.2 Pré-requis
- Tiers (clients) existent.
- Camions/chauffeurs sont enregistrés.
- Permissions `transport:*` selon l’action.

### 11.3 Camions (Flotte)
Endpoints (API) utiles :
- `GET /api/transport/camions`
- `POST /api/transport/camions` (role admin/dispatcher + permission write)
- `PUT /api/transport/camions/{camion_id}`
- `POST /api/transport/camions/{camion_id}/maintenance`
- `POST /api/transport/camions/{camion_id}/disponible`

Règles clés :
- Vérification d’unicité de l’immatriculation (sinon 400).

### 11.4 Chauffeurs
- `GET /api/transport/chauffeurs`
- `GET /api/transport/chauffeurs/disponibles`
- `POST /api/transport/chauffeurs` (role admin/dispatcher + permission write)

Règles clés : unicité du numéro de permis.

### 11.5 Missions (dispatch)
Endpoints :
- `GET /api/transport/missions`
- `POST /api/transport/missions`
- `POST /api/transport/missions/{mission_id}/demarrer` → `EN_ROUTE`
- `POST /api/transport/missions/{mission_id}/terminer` → `TERMINEE`
- `PATCH /api/transport/missions/{mission_id}/statut` : change le statut et broadcast WebSocket + intégration WhatsApp

Statuts à retenir (conceptuellement) : `EN_CHARGEMENT`, `EN_ROUTE`, `LIVREE`, `TERMINEE`, etc.

### 11.6 Carburant
- `GET /api/transport/fuel`
- `POST /api/transport/fuel`

Chaque ticket carburant contient : quantités, prix, montant total, date_plein, kilometrage, station.

### 11.7 Maintenance & Pannes
Flux typique :
1. Déclarer une panne : `POST /api/transport/camions/{camion_id}/pannes`
2. Le camion passe en maintenance (`EN_MAINTENANCE`).
3. Mettre à jour la panne (PUT).
4. Débloquer le camion : `PUT /api/transport/camions/{camion_id}/debloquer`.

### 11.8 Blocage HSE (sécurité)
- `POST /api/transport/camions/{camion_id}/hse-block`

Ce flux :
- crée un contrôle HSE
- crée une panne “BLOCAGE HSE: …”
- bloque le camion via `StatutCamion.BLOQUE_HSE`

### 11.9 E-POD (preuve de livraison)
- `POST /api/transport/missions/{mission_id}/livrer`

Une livraison validée déclenche :
- validation E-POD (signature + nom réceptionnaire)
- génération automatique de la facture (selon service)

### 11.10 GPS & supervision
- `GET /api/transport/gps`

Renvoie les dernières positions (simulées actuellement selon commentaire code) pour nourrir la carte frontend.

---

## 12) Documents (K-Docs)

### 12.1 Objectif
K-Docs génère/édite des documents opérationnels (ex. Bon de Livraison/BL) à partir des données validées.

### 12.2 Pré-requis
- Une **source validée** (OT/Mission et éléments nécessaires : tiers, lignes, quantités).

### 12.3 Règles de génération
- Les documents doivent être basés sur les données existantes (pas de saisie libre incohérente).

### 12.4 Erreurs fréquentes
- Source non validée ⇒ impossibilité de générer.
- RBAC ⇒ 403.

> Remarque : pour une cartographie exhaustive des endpoints K-Docs, l’Annexe B doit être complétée à partir des routers `documents.py`.

---

## 13) Parc & Yard Management (Gate / Workshop / Maintenance)

### 13.1 Objectif
Tracer les mouvements physiques dans la cour logistique : Gate In / Gate Out, et états maintenance en lien avec Transport.

### 13.2 Pré-requis
- Un camion ou véhicule connu dans K-Transport.

### 13.3 Parcours typique
1. Aller dans **Parc → Gate In/Out**.
2. Enregistrer l’entrée ou la sortie (référence OT/Mission, véhicule).
3. Si activé : utiliser OCR pour accélérer la saisie.

### 13.4 Maintenance au niveau parc
- Une panne HSE ou mécanique peut refléter un statut de maintenance qui interdit l’affectation de nouvelles missions.

---

## 14) Magasin (Mag3, Stocks, Reception/Removal)

### 14.1 Objectif
Gérer physiquement les stocks : réception (inbound), enlèvement (removal), mouvements et inventaires.

### 14.2 Pré-requis
- Documents sources disponibles (BL/OT validés).
- Articles définis.

### 14.3 Réception (inbound)
- Identifier la source (BL validé / OT validé selon configuration).
- Renseigner les quantités reçues.
- Valider et valider les mouvements.

### 14.4 Inventaire
- Consultation des quantités par article/entrepôt.
- Mouvements traçés.

### 14.5 Erreurs fréquentes
- Article indisponible/mon non actif ⇒ impossible d’ajouter la ligne.
- Quantités incohérentes ⇒ validation bloquée côté API.

---

## 15) Finance (Factures, Encaissements, Lettrage)

### 15.1 Objectif
Monétiser les opérations : facturer, enregistrer encaissements, lettrer, rapprocher.

### 15.2 Pré-requis
- Missions/OT et documents (BL) disponibles.
- Tiers client définis.

### 15.3 Génération de facture
Parcours :
1. Aller dans **Finance → Factures clients**.
2. Créer une facture à partir d’une source validée.
3. Vérifier lignes/montants.
4. Valider et imprimer/envoyer.

### 15.4 Encaissements & Lettrage
- Enregistrer un paiement.
- Lettrer pour lier paiement ↔ facture.

### 15.5 E-POD vers Finance
Selon l’implémentation transport : la livraison validée déclenche la génération facture automatiquement.

---

## 16) Transactions & Journal

### 16.1 Objectif
Centraliser et consulter les écritures/événements transactionnels et la traçabilité.

### 16.2 Ce que vous trouverez
- historiques de statuts
- mouvements stock
- opérations finance
- audit trail (selon profondeur documentaire)

---

## 17) Notifications

### 17.1 Objectif
Informer les utilisateurs des événements importants : statuts missions, alertes documents expirants, escalades.

### 17.2 Sources
- WebSocket pour updates temps réel (missions)
- endpoints “alertes documents”

### 17.3 Alertes documents expirant
Endpoint transport (exemple dans code) :
- `GET /api/transport/alertes/documents`

Renvoie documents expirant sous 30 jours.

---

## 18) Incidents & Support interne

### 18.1 Objectif
Gérer les incidents applicatifs/opérationnels avec un workflow de support interne.

### 18.2 Bonnes pratiques
- Décrire le problème avec référence : OT/mission, date, écran concerné.
- Joindre si possible un screenshot.

---

## 19) Achats (Purchase / Requisitions)

### 19.1 Objectif
Gérer les achats et leurs validations pour alimenter les approvisionnements et/ou la réception.

> Le détail UI/API dépend des routes `purchase.py` et `suppliers.py` ; l’Annexe B devra refléter les endpoints exacts.

---

## 20) RH (Employés / Congés / Paie)

### 20.1 Objectif
Gérer le personnel et les aspects RH liés à l’exploitation : paie, congés, informations employés.

> Le détail UI/API dépend des routes `rh.py`.

---

## 21) Gateway & intégration inter-modules

### 21.1 Objectif
Assurer la connectivité et l’intégration interne entre modules (transport ↔ docs ↔ finance ↔ stock).

### 21.2 Principe
- Les modules échangent par les entités validées (statuts) : on ne déclenche pas un traitement sans source cohérente.

---

## 22) Portails externes : B2B & Client Portal

### 22.1 Objectif
Offrir aux clients un accès contrôlé à leurs informations (tracking, documents, factures).

### 22.2 Règles de sécurité
- Accès limité aux données du client (tenant/scope via agency/client id).
- Actions sensibles interdites sauf rôle spécifique.

---

## 23) Fonctionnalités cachées / en cours / placeholder

Cette section sert à documenter les fonctionnalités en cours d’implémentation, les écrans de test, et ce qui dépend d’options d’infrastructure.

---

## 24) Annexe A — Glossaire

- **OT** : Ordre de Transport (ou Mission Transport selon usage)
- **BL** : Bon de Livraison
- **Mag3** : module magasin/stock (nom interne)
- **Gate In / Gate Out** : enregistrement entrée/sortie de la cour
- **E-POD** : preuve de livraison électronique (signature)
- **RBAC** : Role-Based Access Control
- **Idempotence** : mécanisme anti-doublon pour éviter des doubles créations

---

## 25) Annexe B — Cartographie API (par préfixe)

> Cartographie dérivée des routers backend présents dans `kamlog-backend/app/routers/*`.
>
> Remarque : le backend expose en général ces endpoints via un préfixe `/api` (ex: `/api/transport/*`).

---

### 25.1 Transport (`/api/transport/*`)
- KPIs : `GET /api/transport/kpis`
- Fuel :
  - `GET /api/transport/fuel`
  - `POST /api/transport/fuel`
- Camions :
  - `GET /api/transport/camions`
  - `GET /api/transport/camions/{camion_id}`
  - `POST /api/transport/camions`
  - `PUT /api/transport/camions/{camion_id}`
  - `DELETE /api/transport/camions/{camion_id}`
  - `POST /api/transport/camions/{camion_id}/maintenance`
  - `POST /api/transport/camions/{camion_id}/disponible`
- Chauffeurs :
  - `GET /api/transport/chauffeurs`
  - `GET /api/transport/chauffeurs/{chauffeur_id}`
  - `GET /api/transport/chauffeurs/disponibles`
  - `POST /api/transport/chauffeurs`
  - `PUT /api/transport/chauffeurs/{chauffeur_id}`
  - `DELETE /api/transport/chauffeurs/{chauffeur_id}`
- Missions :
  - `GET /api/transport/missions`
  - `GET /api/transport/missions/{mission_id}`
  - `GET /api/transport/missions/chauffeur/{chauffeur_id}`
  - `GET /api/transport/missions/client/{client_id}`
  - `POST /api/transport/missions`
  - `PUT /api/transport/missions/{mission_id}`
  - `DELETE /api/transport/missions/{mission_id}`
  - `POST /api/transport/missions/{mission_id}/demarrer`
  - `POST /api/transport/missions/{mission_id}/terminer`
  - `PATCH /api/transport/missions/{mission_id}/statut`
- Calcul carburant (helper) : `POST /api/transport/calculer-ecart-carburant`
- GPS (simulé) : `GET /api/transport/gps`
- Pannes & maintenance :
  - `POST /api/transport/camions/{camion_id}/pannes`
  - `GET /api/transport/camions/{camion_id}/pannes`
  - `PUT /api/transport/camions/{camion_id}/pannes/{panne_id}`
  - `PUT /api/transport/camions/{camion_id}/debloquer`
  - `POST /api/transport/camions/{camion_id}/hse-block`
- E-POD / Livraison : `POST /api/transport/missions/{mission_id}/livrer`
- Alertes documents : `GET /api/transport/alertes/documents`
- Documents véhicule/chauffeur :
  - `POST /api/transport/camions/{camion_id}/documents`
  - `GET /api/transport/camions/{camion_id}/documents`
  - `PUT /api/transport/camions/{camion_id}/associer-remorque`
  - `POST /api/transport/chauffeurs/{chauffeur_id}/documents`
  - `GET /api/transport/chauffeurs/{chauffeur_id}/documents`

---

### 25.2 Documents & PDFs (`/api/documents/*`)
- Génération BL : `POST /api/documents/bl` (payload: `mission_id`)
- Génération Interchange (non implémenté côté code) : `POST /api/documents/interchange`
- Génération facture PDF : `POST /api/documents/facture/{facture_id}`

---

### 25.3 Magasin / Stock (`/api/magasin/*`)
- KPIs : `GET /api/magasin/kpis`
- Magasins :
  - `GET /api/magasin/magasins`
  - `GET /api/magasin/magasins/{magasin_id}`
  - `POST /api/magasin/magasins`
  - `PUT /api/magasin/magasins/{magasin_id}`
  - `DELETE /api/magasin/magasins/{magasin_id}`
- Clients :
  - `GET /api/magasin/clients`
  - `GET /api/magasin/clients/{client_id}`
  - `POST /api/magasin/clients`
  - `PUT /api/magasin/clients/{client_id}`
  - `DELETE /api/magasin/clients/{client_id}`
- Articles :
  - `GET /api/magasin/articles`
  - `GET /api/magasin/articles/by-code/{code_article}`
  - `GET /api/magasin/articles/{article_id}`
  - `POST /api/magasin/articles`
  - `PUT /api/magasin/articles/{article_id}`
  - `DELETE /api/magasin/articles/{article_id}`
- Déclarations (BL) :
  - `GET /api/magasin/declarations`
  - `GET /api/magasin/declarations/{declaration_id}`
  - `GET /api/magasin/declarations/bl/{numero_bl}`
  - `GET /api/magasin/declarations/{declaration_id}/receptions-summary`
  - `POST /api/magasin/declarations`
  - `PUT /api/magasin/declarations/{declaration_id}`
  - `POST /api/magasin/declarations/{declaration_id}/valider`
  - `POST /api/magasin/declarations/{declaration_id}/annuler`
- Réceptions :
  - `GET /api/magasin/receptions`
  - `GET /api/magasin/receptions/{reception_id}`
  - `POST /api/magasin/receptions`
  - `PUT /api/magasin/receptions/{reception_id}`
  - `POST /api/magasin/receptions/{reception_id}/completer`
  - `POST /api/magasin/receptions/{reception_id}/annuler`
- Stocks :
  - `GET /api/magasin/stocks`
  - `GET /api/magasin/stocks/{magasin_id}/{article_id}`
  - `GET /api/magasin/stocks/article/{article_id}/total`
  - `GET /api/magasin/stocks/total/{article_id}`
  - `POST /api/magasin/stocks/filtres`
- Commandes :
  - `GET /api/magasin/commandes`
  - `GET /api/magasin/commandes/{commande_id}`
  - `POST /api/magasin/commandes`
  - `PUT /api/magasin/commandes/{commande_id}`
  - `POST /api/magasin/commandes/{commande_id}/valider-paiement`
  - `POST /api/magasin/commandes/{commande_id}/preparer`
  - `POST /api/magasin/commandes/{commande_id}/prete`
  - `POST /api/magasin/commandes/{commande_id}/livree`
  - `POST /api/magasin/commandes/{commande_id}/annuler`
- Bandes de livraison :
  - `GET /api/magasin/bandes-livraison`
  - `GET /api/magasin/bandes-livraison/{bande_id}`
  - `POST /api/magasin/bandes-livraison`
  - `PUT /api/magasin/bandes-livraison/{bande_id}`
- Ordres de transfert :
  - `GET /api/magasin/ordres-transfert`
  - `GET /api/magasin/ordres-transfert/{ot_id}`
  - `GET /api/magasin/ordres-transfert/declaration/{declaration_id}`
  - `POST /api/magasin/ordres-transfert`
  - `PUT /api/magasin/ordres-transfert/{ot_id}`
  - `POST /api/magasin/ordres-transfert/{ot_id}/valider`
  - `POST /api/magasin/ordres-transfert/{ot_id}/expedier`
  - `POST /api/magasin/ordres-transfert/{ot_id}/receptionner`
  - `POST /api/magasin/ordres-transfert/{ot_id}/annuler`

---

### 25.4 Finance (`/api/finance/*`)
- KPIs : `GET /api/finance/kpis`
- Analytics : `GET /api/finance/analytics/chart-data`
- Factures :
  - `GET /api/finance/factures`
  - `GET /api/finance/factures/{facture_id}`
  - `GET /api/finance/factures/tiers/{tiers_id}`
  - `POST /api/finance/factures`
  - `PUT /api/finance/factures/{facture_id}`
  - `DELETE /api/finance/factures/{facture_id}`
  - `POST /api/finance/factures/{facture_id}/valider`
  - `POST /api/finance/factures/{facture_id}/annuler`
- Encaissements :
  - `GET /api/finance/encaissements`
  - `GET /api/finance/encaissements/{encaissement_id}`
  - `GET /api/finance/encaissements/tiers/{tiers_id}`
  - `GET /api/finance/encaissements/non-lettrés`
  - `POST /api/finance/encaissements`
  - `PUT /api/finance/encaissements/{encaissement_id}`
  - `DELETE /api/finance/encaissements/{encaissement_id}`
  - `POST /api/finance/encaissements/{encaissement_id}/lettrer/{facture_id}`
- Encours : `GET /api/finance/encours/{tiers_id}`
- Tarifs :
  - `GET /api/finance/tarifs`
  - `GET /api/finance/tarifs/{grille_id}`
  - `GET /api/finance/tarifs/active/{type_service}`
  - `POST /api/finance/tarifs`
  - `PUT /api/finance/tarifs/{grille_id}`
  - `DELETE /api/finance/tarifs/{grille_id}`
  - `POST /api/finance/tarifs/{grille_id}/activer`
- Avoirs :
  - `POST /api/finance/avoirs`
  - `GET /api/finance/avoirs`
  - `GET /api/finance/avoirs/{avoir_id}`
  - `POST /api/finance/avoirs/{avoir_id}/mark-used`
  - `GET /api/finance/avoirs/unutilized/{tiers_id}`
- Calcul TVA (helper) : `POST /api/finance/calculer-tva`

---

## 26) Annexe C — Procédure d’exploitation minimale


### C.1 Journée type (opérations principales)
1. Vérifier **health** : `GET /api/health`.
2. Contrôler/compléter **Tiers** et **Articles**.
3. Créer/valider les **missions** (Transport).
4. Générer les **documents** (BL) si nécessaire.
5. Enregistrer **Gate** (Parc) si activé.
6. Réceptionner en **Magasin** (Mag3).
7. Générer factures et encaisser en **Finance**.
8. Contrôler l’**audit** et les notifications en cas d’écart.

### C.2 Checklist qualité (avant clôture)
- Statuts : missions/OT bien passées au bon état.
- Cohérence : quantités réceptionnées alignées au document.
- Financier : factures générées pour livraisons validées.



