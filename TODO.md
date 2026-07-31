# TODO — Avancement Global & Plan d'Action EVO-LOG SaaS

---

## 📊 État des Tâches (100% Réalisé)

### 1. Authentification & Contrôle d'Accès (RBAC)
- [x] Corriger le rôle et les autorisations `modules_allowed` des utilisateurs connectés dans NextAuth (`auth.ts`) et FastAPI (`auth.py`).
- [x] Implémenter le seeder idempotent (`seed_data.py`) créant 8 comptes réels en BDD (`admin`, `magasinier`, `kamga`, `qhse`, `financier`, `douane`, `parc`, `auditor`).
- [x] Griser dynamiquement les modules non autorisés dans la Sidebar avec icône de cadenas 🔒 et message explicite ("Accès restreint : Votre profil [ROLE] n'est pas autorisé...").
- [x] Intégrer les cases à cocher `modules_allowed` dans la modale d'administration de création d'utilisateurs (`/admin`).

### 2. Design System & Icône PWA 3D
- [x] Générer des assets PWA 3D metallic/indigo professionnels haute résolution (`icon-512x512.png`, `icon-192x192.png`, `apple-touch-icon.png`, `favicon.ico`).
- [x] Déclarer les métadonnées et le Service Worker (`sw.js`) dans Next.js `layout.tsx` et `manifest.json`.
- [x] Valider la compilation complète du frontend (`npm run build` : 153/153 pages statiques générées avec 0 erreur).

### 3. Résilience Conteneur & Déploiement Production
- [x] Rendre les importations Celery/Sentry résilientes et ajouter `REDIS_URL` dans `Settings` (`app/config.py`).
- [x] Implémenter le wrapper `safe_include_router()` dans `app/main.py` pour éviter tout plantage sur les stubs de routeurs.
- [x] Corriger les règles du Builder Dockerfile avec l'auto-aplatissement (`cp -rn /app/EVO-LOG-backend/* /app/`) pour supporter tous les contextes de build Railway (Racine et sous-dossier).
- [x] Pousser et forcer les commits `92e2819`, `1928598`, `2a7a66e` et `7c5bea4` sur toutes les branches distantes (`logistique` et `origin`).

---

## 🎯 Prochaines Étapes de Maintenance

- [ ] Suivre les métriques d'exploitation et les logs d'erreurs en production sur Railway et Vercel.
- [ ] Étendre les scénarios de tests E2E Playwright sur les parcours métiers Magasin WMS et Transport.
