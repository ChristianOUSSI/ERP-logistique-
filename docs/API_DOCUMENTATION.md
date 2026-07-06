# API Documentation

## Source de verite

Pour les schemas exacts, les payloads et les validations, la source de verite est l'application FastAPI elle-meme:

- Swagger: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

Ce document sert de cartographie maintenable des prefixes exposes par le backend actuel.

## Base URL

```text
http://localhost:8000/api
```

## Authentification

- JWT bearer token
- endpoints MFA presents dans le groupe `auth`
- RBAC applique selon les routeurs et permissions

## Endpoints transverses

- `GET /api/health`
- `GET /api/health/detailed`

## Prefixes exposes

| Prefixe | Domaine |
| --- | --- |
| `/api/auth` | login, refresh, me, logout, MFA |
| `/api/tiers` | tiers et operations associees |
| `/api/transport` | flotte, chauffeurs, missions, carburant et operations transport |
| `/api/finance` | factures, encaissements, rapprochements et vues finance |
| `/api/parc` | zones, emplacements, flotte parc et operations associees |
| `/api/documents` | generation et recuperation documentaire |
| `/api/alerts` | alertes fonctionnelles et techniques |
| `/api/magasin` | magasins, articles, declarations, receptions, stocks, commandes |
| `/api/gateway` | passerelles inter-modules |
| `/api/transactions` | journal et mouvements transactionnels |
| `/api/transport/goods-declarations` | declarations de marchandises |
| `/api/magasin/removal-slips` | bons d'enlevement Mag3 |
| `/api/magasin/receptions-mag3` | receptions Mag3 |
| `/api/master-data` | donnees de reference frontend/backend |
| `/api/admin` | administration, roles, utilisateurs, audit |
| `/api/admin/agencies` | gestion des agences |
| `/api/suppliers` | fournisseurs |
| `/api/notifications` | notifications applicatives |
| `/api/purchase` | demandes et workflows d'achat |

## Fichiers routeurs correspondants

- `kamlog-backend/app/routers/auth.py`
- `kamlog-backend/app/routers/tiers.py`
- `kamlog-backend/app/routers/transport.py`
- `kamlog-backend/app/routers/finance.py`
- `kamlog-backend/app/routers/parc.py`
- `kamlog-backend/app/routers/documents.py`
- `kamlog-backend/app/routers/alerts.py`
- `kamlog-backend/app/routers/magasin.py`
- `kamlog-backend/app/routers/gateway.py`
- `kamlog-backend/app/routers/transactions.py`
- `kamlog-backend/app/routers/goods_declaration.py`
- `kamlog-backend/app/routers/removal_slip.py`
- `kamlog-backend/app/routers/reception_mag3.py`
- `kamlog-backend/app/routers/master_data.py`
- `kamlog-backend/app/routers/admin.py`
- `kamlog-backend/app/routers/admin_agency.py`
- `kamlog-backend/app/routers/suppliers.py`
- `kamlog-backend/app/routers/notifications.py`
- `kamlog-backend/app/routers/purchase.py`

## Remarques de maintenance

- les prefixes ci-dessus sont extraits de `kamlog-backend/app/main.py`;
- les contrats exacts doivent etre derives de Swagger/OpenAPI et non recopies manuellement;
- la doc detaillee endpoint par endpoint est volontairement reduite pour eviter l'obsolescence rapide.

## Ce qui manque encore

- une reference API stable par module avec exemples reellement testes;
- une matrice publique roles -> permissions -> endpoints;
- une documentation des erreurs applicatives partagee entre frontend et backend;
- une liste officielle des endpoints encore experimentaux ou purement UI-driven.
