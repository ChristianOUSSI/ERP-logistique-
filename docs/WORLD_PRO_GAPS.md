# WORLD-PRO GAP ANALYSIS — KAMLOG EM-ERP

**Objectif** : lister strictement les lacunes (doc ↔ code ↔ exigences ERP world-pro) observées à partir du code backend déjà inspecté.

> Important : ce document est basé sur des lectures ciblées (main.py, rbac/security/cache/sanitization/logger, tiers/reception_mag3/removal_slip/goods_declaration routers, magasin_service partiel, mag3_workflow_service, notification_service, transport_service (partiel), parc_service (partiel)). Les gaps ci-dessous sont donc **avérés** pour les zones inspectées.

---

## 0) Référentiel “World-Pro” utilisé

Pour qualifier une lacune, j’applique les critères :
1. **Atomicité / cohérence transactionnelle** sur opérations critiques (stock, statut workflow, facturation, audit).
2. **Traçabilité non-répudiation** (audit exact + corrélation request).
3. **Intégrité données** (Decimal/quantize, pas de float sur compta/stock).
4. **Sécurité prouvable** (contrat RBAC unifié, shape user constante, pas de mélange de middlewares/implémentations).
5. **Idempotence** (anti-doublon robuste sur retries réseau / re-exécution).
6. **Notifications** persistées (pas de “simulations” + pas de hardcode) et data-driven.
7. **Multi-tenancy** isolé (filtrage systématique par agency/tenant sur mutations et lectures sensibles).
8. **Cache** correctement utilisé (pas d’API async appelée comme sync).
9. **Observabilité** : logs structurés + erreurs propagées, pas de `print`.

---

## 1) Gaps critiques détectés (prouvés par code)

### 1.1 Workflow Mag3 non atomique + erreur stock non bloquante
**Fichiers** :
- `kamlog-backend/app/services/mag3_workflow_service.py`
- (appel stock) `kamlog-backend/app/services/magasin_service.py` (extraits)

**Constats**
- `validate_reception_workflow()` encapsule la mise à jour stock dans un `try/except` qui **log via `print(...)` et continue**.
- Résultat : une réception peut être marquée validée alors que la mise à jour du stock a échoué.

**Impact**
- Incohérence ERP : statut business ≠ état physique stock.
- Audit & conformité : l’audit peut refléter un succès sans effet réel.

**World-Pro attendu**
- Workflow encapsulé dans une **transaction unique** (ou saga/outbox robuste).
- Si stock update échoue :
  - rollback workflow
  - statut réception à `ERREUR_WORKFLOW` / `FAILED`
  - notification erreur + audit erreur.

---

### 1.2 Notifications non persistées en base + hardcodes destinataires
**Fichiers** :
- `kamlog-backend/app/services/notification_service.py`
- `kamlog-backend/app/services/mag3_workflow_service.py`

**Constats**
- `NotificationService.create_notification()` contient `# TODO: Enregistrer dans la base de données` et retourne un dict.
- `print(f"Notification créée...")` est utilisé.
- destinataires dans Mag3 sont hardcodés :
  - `responsables = ["admin", "responsable_magasin"]`
  - `magasiniers = ["magasinier1", "magasinier2"]`
  - `responsables_stock = ["responsable_stock", "admin"]`

**Impact**
- En prod, notifications peuvent ne jamais apparaître (ou uniquement dans la console).
- Contrôle RBAC/tenant impossible : pas de mapping data-driven.

**World-Pro attendu**
- Table `notifications` (ou entité) + persistance réelle.
- Destinataires déterminés par :
  - agency_id/tenant
  - rôles/permissions
  - préférences notification

---

### 1.3 Idempotence non prouvée
**Fichiers** : `app/main.py` (import/usage middleware), middlewares (non vérifiés en totalité)

**Constats**
- `IdempotencyMiddleware` est référencé dans `main.py` mais les implémentations n’ont pas été inspectées ici.
- En pratique, les endpoints workflow peuvent créer plusieurs enregistrements lors de retries (absence de contrat visible Idempotency-Key).

**Impact**
- Doublons : stock, documents, notifications, passerelles.

**World-Pro attendu**
- Idempotency-Key requis sur mutations.
- Persistance “request_id → résultat” (outbox) et verrouillage transactionnel.

---

### 1.4 RBAC : contrats non uniformes (deux systèmes)
**Fichiers** :
- `kamlog-backend/app/utils/rbac.py`
- routers tiers utilisent `require_permission/require_role`
- routers Magasin utilisent `app.utils.permissions.check_permission/get_current_user`

**Constats**
- `rbac.py` : permissions mappées en dur via `ROLE_PERMISSIONS`.
- TODO explicite : “TODO Implémenter système de permissions plus avancé avec une table”.
- Présence d’un autre module `app/utils/permissions.py` (non inspecté en totalité ici) suggère 2 contrats RBAC.

**Impact**
- Impossible de garantir une sécurité “prouvable”.
- Risque de mélange de `current_user` (User vs dict) selon le décorateur.

**World-Pro attendu**
- Un seul mécanisme RBAC (une source de vérité).
- Un seul type `current_user` garanti.
- Permissions data-driven (table) + tests.

---

### 1.5 Décimaux : float utilisé dans chaîne stock/audit
**Fichiers** :
- `kamlog-backend/app/services/magasin_service.py` (extrait)

**Constats**
- Conversion de `Decimal` vers `float` dans audit/modification stock :
  - `quantite_avant = float(stock.quantite_disponible)`
  - `quantite_apres = float(stock.quantite_disponible)`
- Passerelles utilisent aussi des `float(...)` sur quantités.

**Impact**
- Risque d’arrondi non maîtrisé.
- Contre les exigences world-pro (comptabilité/stock).

**World-Pro attendu**
- Pas de float pour quantités/montants.
- Stocker et tracer en Decimal, avec `quantize` à des échelles définies par unité.

---

### 1.6 Cache Redis : interface async + usage non vérifié
**Fichier** : `app/utils/cache.py`

**Constats**
- `CacheService.get/set` sont **async**.
- Dans les services inspectés, l’usage ressemble à des appels directs sans `await` (à confirmer pour tous fichiers).

**Impact**
- Cache peut ne pas fonctionner (ou être mal utilisé).
- Problèmes de performance et logique.

**World-Pro attendu**
- Unifié :
  - soit tout passer en async + await cache
  - soit wrapper sync (au prix d’un design plus contraignant)

---

### 1.7 Notifications & audit : `print(...)` au lieu de logs structurés
**Fichiers** :
- `mag3_workflow_service.py`
- `notification_service.py`

**Constats**
- `print(...)` au lieu de `logger`.

**Impact**
- Observabilité dégradée ; en prod, les logs structurés sont la norme.

---

## 2) Gaps de conformité doc ↔ code

### 2.1 Documents indiquent “résolu / complet” alors que TODO et hardcodes existent
**Fichiers doc** : `docs/ANALYSE_COMPLETE_ERP.md`, `docs/ARCHITECTURE.md`, `docs/STATUT_GLOBAL_PROJET.md` (non re-parcourus intégralement ici)

**Constats**
- Les documents déclarent MFA/RBAC/audit/idempotency/cache/notifications comme “confirmés complets”.
- Pourtant des éléments de code contredisent :
  - Notifications non persistées + hardcodes
  - Workflow non atomique + print
  - TODO permissions table

**Impact**
- Perte de confiance dans l’architecture annoncée.

**World-Pro attendu**
- Document “Truthful status” : aucune mention “✅ complet” sans preuve code/test.

---

## 3) Liste de corrections recommandées (priorisées)

### P0 (bloquant prod)
1. Workflow Mag3 atomique : transaction + rollback si stock update échoue.
2. Notifications : persistance DB + suppression `print` + destinataires data-driven.
3. RBAC : unifier le mécanisme + type `current_user` constant.
4. Decimal/quantités : supprimer float dans stock/audit/passerelles.

### P1 (stabilité & intégrité)
1. Idempotence : Idempotency-Key sur mutations + table mapping request→result.
2. Cache : unifier async/sync ; garantir `await` ou wrapper.
3. Multi-tenancy : filtre `agency_id` dans toutes les lectures/mutations critiques.

### P2 (qualité & enterprise readiness)
1. Observabilité : corrélation_id request → audit + logs + notifications.
2. Tests :
   - retry idempotent
   - atomicity Mag3 stock vs statut
   - notification persistence
   - precision Decimal
   - RBAC contract uniforme

---

## 4) Plan de mise à jour documentaire (à réaliser)
- Créer/mettre à jour :
  - `docs/WORLD_PRO_GAPS.md` (ce fichier)
  - `docs/ANALYSE_COMPLETE_ERP.md` : remplacer les ✅ “confirmé complet” par un tableau Doc↔Code
  - `docs/ARCHITECTURE.md` : corriger “microservices” vs monolithe, et préciser atomicité/outbox
  - `docs/TESTING_CHECKLIST.md` : ajouter tests P0
  - `docs/DEPLOYMENT.md` : ajouter exigences prod pour transactions, migrations, et cohérence.

---

## 5) Traçabilité des preuves (liens vers fichiers)
- `kamlog-backend/app/services/mag3_workflow_service.py`
- `kamlog-backend/app/services/notification_service.py`
- `kamlog-backend/app/services/magasin_service.py`
- `kamlog-backend/app/utils/rbac.py`
- `kamlog-backend/app/utils/cache.py`

---

**Statut** : “Gap report initial” — basé sur lectures ciblées. Une revue complète exigerait de lire aussi les middlewares audit/idempotency, `app/utils/permissions.py`, et les models/migrations de notifications/audit.

