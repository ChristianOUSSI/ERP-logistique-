# Manuel d'Utilisation Détaillé : KAMLOG EM-ERP
**Développé et propulsé par CADC (Code Axis Digital Cameroun)**

---

## Sommaire
1. [Introduction et Philosophie du Système](#1-introduction-et-philosophie-du-système)
2. [Premiers Pas : Connexion et Interface](#2-premiers-pas--connexion-et-interface)
3. [Étape 1 : Le Socle - Les Données Maîtres](#3-étape-1--le-socle---les-données-maîtres)
4. [Étape 2 : L'Opérationnel - K-Transport](#4-étape-2--lopérationnel---k-transport)
5. [Étape 3 : Le Terrain - K-Parc (Yard Management) & IA OCR](#5-étape-3--le-terrain---k-parc-yard-management--ia-ocr)
6. [Étape 4 : Les Stocks - Entrepôt / Magasin](#6-étape-4--les-stocks---entrepôt--magasin)
7. [Étape 5 : La Rentabilité - Finance, Paie et Comptabilité](#7-étape-5--la-rentabilité---finance-paie-et-comptabilité)
8. [Les Nouveaux Super-Pouvoirs : Portail Client, E-POD et Cartographie](#8-les-nouveaux-super-pouvoirs--portail-client-e-pod-et-cartographie)
9. [Atelier et Maintenance (K-Maintenance)](#9-atelier-et-maintenance-k-maintenance)
10. [Sécurité et Déconnexion](#10-sécurité-et-déconnexion)
11. [Support Technique (CADC)](#11-support-technique-cadc)

---

## 1. Introduction et Philosophie du Système

Bienvenue dans le manuel d'utilisation ultra-détaillé de **KAMLOG EM-ERP**. Cette plateforme est une solution de gestion intégrée de bout en bout, fièrement conçue et développée par les ingénieurs de **CADC (Code Axis Digital Cameroun)**.

### La Logique Métier (Comment l'ERP réfléchit-il ?)
Pour bien utiliser ce logiciel, il est crucial de comprendre son "flux de travail" (Workflow). Le système est interconnecté ; les informations créées dans un module sont utilisées dans un autre.
**Le principe de base est le suivant :**
1. **Rien ne se crée à partir de zéro dans l'urgence.** Vous devez d'abord déclarer vos clients, fournisseurs et articles dans les **Données Maîtres**.
2. Une fois le client connu du système, le département Logistique peut créer un **Ordre de Transport (OT)** pour ce client.
3. Le camion assigné à cet OT est ensuite suivi dans le module **K-Parc** pour ses entrées/sorties de la cour (Gate In/Gate Out).
4. Le document officiel (Bon de Livraison) est généré en un clic grâce à **K-Docs**.
5. Enfin, le module **Finance** récupère cet OT validé pour générer automatiquement une **Facture**, mais aussi pour calculer la **Paie du Chauffeur** !

Si vous comprenez cette chaîne, vous maîtriserez KAMLOG EM-ERP !

![Logo CADC / KAMLOG](https://via.placeholder.com/800x200.png?text=KAMLOG+EM-ERP+by+CADC)

---

## 2. Premiers Pas : Connexion et Interface

### 2.1. Accéder à l'ERP
La plateforme étant hébergée de manière sécurisée par **CADC**, vous avez besoin d'une connexion internet.
1. Ouvrez votre navigateur web (Google Chrome ou Microsoft Edge de préférence).
2. Tapez l'adresse web de l'ERP fournie par votre administrateur.

### 2.2. Se connecter
1. Sur la page d'accueil, vous verrez l'interface de connexion.
2. Entrez votre **Adresse Email** professionnelle.
3. Entrez votre **Mot de passe**.
4. Cliquez sur le bouton **"Se connecter"**.
*(Si vos identifiants sont erronés, un message d'erreur rouge s'affichera en haut de l'écran).*

### 2.3. Comprendre l'écran principal
L'interface conçue par **Code Axis Digital Cameroun** est divisée en trois parties pour vous faciliter la vie :
- **Le Menu Latéral (à gauche)** : Il change en fonction du module dans lequel vous vous trouvez. C'est ici que vous naviguez entre les différentes pages.
- **La Barre Supérieure (en haut)** : Elle est toujours visible. Vous y trouverez des boutons raccourcis pour changer de grand "Module" (Transport, Finance, Parc...), changer le site physique sur lequel vous travaillez (ex: "Douala, CMR"), et un bouton de déconnexion.
- **La Zone Centrale** : C'est votre espace de travail. C'est ici que les tableaux de bord et les formulaires s'affichent.

---

## 3. Étape 1 : Le Socle - Les Données Maîtres

**Pourquoi ce module ?** C'est l'annuaire de votre entreprise. Si un client ou un article n'est pas créé ici, vous ne pourrez pas travailler avec lui dans les autres modules.

### 3.1. Créer un "Tiers" (Client, Fournisseur, Partenaire)
Un "Tiers" désigne toute entreprise ou personne externe avec laquelle vous travaillez.
1. Dans la barre supérieure, cliquez sur l'icône réseau **Données Maîtres**.
2. Dans le menu latéral gauche, cliquez sur **Tiers**.
3. Vous voyez la liste de tous les tiers existants. Cliquez sur le bouton bleu **"Nouveau Tiers"** ou **"Ajouter"**.
4. **Remplissez le formulaire :**
   - *Raison Sociale* : Le nom de l'entreprise (ex: "Bolloré Logistics").
   - *Code Tiers* : Un identifiant unique court (ex: "BOL001").
   - *Sigle ou Enseigne* : Optionnel.
   - *Contact et Adresse* : Numéro de téléphone et ville.
5. **Activer les services :** Tout en bas du formulaire, vous verrez des cases à cocher ("Autorisé pour l'acconage", "Autorisé pour le transport", etc.). Cochez les cases correspondantes à ce que vous vendez à ce client.
6. Cliquez sur **Enregistrer**.

### 3.2. Gérer les Articles
Même logique. Cliquez sur **Articles** dans le menu latéral pour ajouter ce que vous facturez (ex: "Prestation de transport 40 pieds", "Frais de magasinage").

![Création de Tiers](https://via.placeholder.com/800x400.png?text=Gestion+des+Tiers+par+CADC)

---

## 4. Étape 2 : L'Opérationnel - K-Transport

**Pourquoi ce module ?** C'est le cœur de l'activité logistique. C'est ici que vous coordonnez les camions, les chauffeurs et les marchandises.

### 4.1. Créer un Ordre de Transport (OT) / Dispatch
L'Ordre de Transport est le document officiel qui ordonne à un camion d'aller d'un point A à un point B.
1. Allez dans le module **Transport** (depuis la barre supérieure).
2. Dans le menu de gauche, cliquez sur **Dispatch / Ordres**.
3. Cliquez sur **Créer un Ordre**.
4. Dans la liste déroulante "Client", vous retrouverez les Tiers créés à l'Étape 1 ! Sélectionnez-en un.
5. Indiquez le lieu de départ (Expéditeur) et le lieu d'arrivée (Destinataire).
6. Assignez un **Camion** (ex: "Tracteur TR-001") et un **Chauffeur**.
7. Cliquez sur **Valider l'OT**.

### 4.2. K-Planning (Kanban de Transport)
Pour visualiser visuellement toutes les expéditions :
1. Allez dans **K-Planning**.
2. Le système organise vos missions en colonnes (Programmées, En Chargement, En Route, Livrées).
3. **Imprimer le Bon de Livraison (BL)** : Au survol d'une carte "En Route", cliquez sur l'icône **Imprimante**. KAMLOG va générer automatiquement un BL officiel au format A4 en récupérant toutes les données du système (K-Docs) !

### 4.3. Gestion du Carburant
Avant de lancer un camion sur une longue distance, il faut le ravitailler.
1. Allez dans **Carburant (Fuel)**.
2. Créez un **Bon de Carburant** en indiquant le camion concerné et le volume en litres autorisé.

---

## 5. Étape 3 : Le Terrain - K-Parc (Yard Management) & IA OCR

**Pourquoi ce module ?** Un camion n'est pas toujours sur la route. Parfois, il est garé dans votre cour logistique (Yard), ou en réparation au garage.

### 5.1. L'Intelligence Artificielle au Gate In (Nouveau !)
Pour accélérer l'entrée des camions sans saisie manuelle :
1. Allez dans **Parc > Gate In / Gate Out**.
2. Le gardien uploade une photo (via son smartphone ou son poste) du Bon de Livraison ou de la plaque d'immatriculation.
3. Cliquez sur **Lancer la reconnaissance OCR**. L'intelligence artificielle analysera l'image, et lira le texte pour vous (Fiabilité > 90%) pour auto-remplir le numéro du conteneur et la plaque !

### 5.2. Cartographie de la Cour (Yard Map)
1. Allez dans le module **Parc** (barre supérieure).
2. Cliquez sur **Cartographie du Parc (Yard Map)** dans le menu latéral.
3. Contrairement à la carte routière des transports, cette carte affiche une **vue satellite haute définition** de votre cour. Vous pouvez voir exactement où sont garés les camions ou posés les conteneurs.

---

## 6. Étape 4 : Les Stocks - Entrepôt / Magasin

**Pourquoi ce module ?** Pour tracer tout ce qui entre et sort physiquement des bâtiments de stockage.

### 6.1. La Réception (Mag 3)
1. Allez dans le module **Magasin**.
2. Cliquez sur **Réceptions (Inbound)**.
3. Recherchez un Bon de Livraison (BL) validé par les douanes/achats.
4. Le système vous montre la quantité totale déclarée. Vous pouvez affecter les quantités reçues dans votre entrepôt (Magasin Principal, Magasin Secondaire).
5. Le système vous indique en temps réel le *Reste à Recevoir*.

### 6.2. Gestion des Stocks
1. Allez dans **Inventaire (Stocks)**.
2. Vous avez une vue instantanée sur toutes vos marchandises, filtrable par **Code article**, **Entrepôt**, ou **Client**.
3. Chaque mouvement est automatiquement tracé.

---

## 7. Étape 5 : La Rentabilité - Finance, Paie et Comptabilité

**Pourquoi ce module ?** Le but ultime de l'ERP est de s'assurer que tout le travail logistique est correctement facturé et encaissé, ET que vos employés soient payés.

### 7.1. Générer une Facture
Puisque le module Logistique a déjà fait le travail de créer un "Ordre de Transport" (OT), la facturation est semi-automatique !
1. Allez dans le module **Finance**.
2. Cliquez sur **Factures clients**.
3. Créez une nouvelle facture. Vous pourrez importer directement les données d'un OT validé. Le système de **CADC** remplira le montant, le client et les taxes en respectant les lois locales de la zone OHADA / Cameroun.
4. Enregistrez et imprimez la facture pour l'envoyer au client.

### 7.2. Module RH & Frais de Route (Nouveau !)
Vos chauffeurs reçoivent des per diems, et le module automatise ces calculs complexes.
1. Allez dans **Finance > Rémunérations (Payroll)**.
2. Le système affiche le **Salaire de base + Les Primes de Trajet (variables) + Les Frais de Péage** pour chaque chauffeur de façon transparente.
3. Cliquez sur l'icône de document pour éditer la **Fiche de Paie**.

### 7.3. Rapprochement Bancaire et Lettrage
1. Si le client vous paye (ex: virement bancaire de 500 000 FCFA), enregistrez cet encaissement via **Paiements & Encaissements**.
2. Vous pouvez y effectuer le **Lettrage**, c'est-à-dire lier ce paiement à une ou plusieurs factures pour les marquer comme payées.
3. Le module **Rapprochement bancaire** vous permettra ensuite de comparer les chiffres entrés dans KAMLOG EM-ERP avec le relevé de votre banque.

---

## 8. Les Nouveaux Super-Pouvoirs : Portail Client, E-POD et Cartographie

KAMLOG EM-ERP ne s'arrête pas aux frontières de votre bureau. Il s'étend à vos clients et vos camions !

### 8.1. E-POD : L'Application Mobile pour Chauffeurs
Fini le papier perdu ! Vos chauffeurs accèdent à KAMLOG depuis leur smartphone (lien : `/transport/epod`).
1. Le chauffeur voit sa mission actuelle en gros caractères ("KAMLOG E-POD").
2. Il peut cliquer sur le bouton **Scanner BL & Valider Livraison** pour signer électroniquement, envoyer la preuve directement au système central, et déclencher instantanément la facture !

### 8.2. Le Portail Client B2B
Ne laissez plus vos clients dans le noir.
Vos clients (ex: Nestlé) disposent d'un lien d'accès spécial (`/client-portal`). 
- Ils y trouveront un magnifique tableau de bord de Tracking.
- Ils peuvent voir les statuts "En Route" ou "Livré" de leurs propres expéditions uniquement.
- Ils peuvent télécharger leurs factures sans vous appeler !

### 8.3. La Tour de Contrôle GPS
Dans l'ERP, cliquez sur **Transport > Tour de Contrôle GPS (`/transport/map`)**.
Vous verrez apparaître la carte dynamique du pays (Leaflet) avec de petits camions animés représentant votre flotte "En Route" en temps réel. Parfait pour une supervision haut-niveau (Control Tower).

---

## 9. Atelier et Maintenance (K-Maintenance)

Si un camion tombe en panne ou subit un blocage HSE, le département transport peut le mettre en statut `EN_MAINTENANCE`.
1. Le département technique se rend sur **Transport > Maintenance**.
2. Vous verrez la liste des camions immobilisés avec les descriptions de pannes.
3. Le mécanicien peut cliquer sur **Prendre en charge** pour passer le statut de la panne à `EN_COURS`.
4. Une fois réparé, cliquez sur **Marquer Résolu**.
5. Le responsable peut alors **Débloquer le véhicule** pour qu'il puisse à nouveau recevoir des missions de transport !

---

## 10. Sécurité et Déconnexion

Le logiciel a été codé par **Code Axis Digital Cameroun** avec de hauts standards de sécurité.
- **Si vous quittez votre poste de travail, même pour 10 minutes, vous devez vous déconnecter.**
- En haut à droite de l'écran, cliquez sur l'icône de sortie, ou utilisez le bouton rouge "Déconnexion" tout en bas du menu latéral.
- Une magnifique page de confirmation d'au revoir s'affichera, preuve que votre session est totalement détruite et sécurisée.

---

## 11. Support Technique (CADC)

Si, malgré ce guide, vous rencontrez une difficulté, si un bouton ne clique pas, ou si vous souhaitez ajouter une nouvelle fonctionnalité à l'application, l'équipe de développement est là pour vous !

**Une plateforme technologique conçue avec passion par :**
### CADC (Code Axis Digital Cameroun)
*Nous transformons votre complexité logistique en une simplicité numérique.*
