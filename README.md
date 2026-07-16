# 📊 QuiVaLa - Tableau de Bord Admin

**QuiVaLa** est l'interface d'administration de l'infrastructure de gestion des flux d'entrées et de sorties. Cette application front-end sécurisée permet de surveiller en temps réel les présences au sein d'une entreprise et d'accéder à l'historique complet des visites.

👤 **Auteur :** Adrien Micheroux  
🔗 **Projet lié :** Ce dépôt fonctionne en tandem avec l'application tablette visiteur (`QuiVaLA_App`) et consomme une API Headless WordPress.

---

## 🛠️ Technologies Utilisées

Ce projet repose sur une architecture **Headless** et modulaire, favorisant la performance et la séparation claire entre le back-end et le front-end, sans dépendre de frameworks lourds.

**Back-end (API / Base de données) :**
* **WordPress (Headless) :** Utilisé uniquement comme moteur de base de données et gestionnaire de contenu.
* **ACF Pro (Advanced Custom Fields) :** Création de relations complexes entre les visiteurs, le personnel et les formations.
* **API REST WP :** Création d'endpoints sur mesure et optimisation des requêtes relationnelles (solution au problème N+1).
* **JWT Authentication :** Sécurisation des routes API et gestion des sessions administrateur.

**Front-end (Dashboard Admin) :**
* **Vanilla JavaScript (ES6+) :** Architecture modulaire (`import`/`export`) structurée sans framework JS. Logique de filtrage des données directement en mémoire (côté client) pour des performances instantanées.
* **HTML5 & CSS3 :** Interface premium structurée en "Bento Grid" avec gestion avancée des variables CSS (bascule dynamique entre thème Clair et Sombre).
* **Fetch API :** Communication asynchrone sécurisée avec le serveur WordPress.

---

## ⚙️ Fonctionnalités du Tableau de Bord

Le tableau de bord est conçu pour offrir une vue d'ensemble claire, rapide et sécurisée aux administrateurs :

* **Sécurité & Authentification :** L'accès au tableau de bord est strictement protégé par une page de login sécurisée générant un jeton JWT. Les routes front-end redirigent automatiquement les utilisateurs non authentifiés.
* **Live Tracking & Recherche Instantanée :** Un tableau dynamique affiche les visiteurs avec une barre de recherche globale (par nom, email, formation ou local) qui filtre les résultats instantanément sans surcharger l'API.
* **Historique & Filtres Multicritères :** Une vue dédiée pour interroger l'ensemble des logs de visites passées. Possibilité de croiser les filtres (Plage de dates, Motif de visite, Local cible).
* **Export CSV Intelligent :** Génération et téléchargement à la volée d'un fichier `.csv` reprenant strictement les données actuellement filtrées à l'écran (formaté UTF-8 avec BOM pour une compatibilité parfaite avec Excel).
* **UI/UX Premium :** Design "Dark Luxury" moderne et épuré avec système de cartes (Bento) et un bouton permettant à l'administrateur de basculer sur un mode clair.

---

## 🚀 Étapes actuelles (Ce qui est fait)

* [x] **Architecture de la Base de Données :** Configuration des Custom Post Types (Visiteurs, Personnel, Formations, Visites) dans WordPress.
* [x] **Configuration de l'API REST :** Interconnexion des champs ACF et injection des données relationnelles (`details_complets`) pour optimiser drastiquement les requêtes GET.
* [x] **Architecture Front-end Modulaire :** Mise en place d'un environnement Vanilla JS ventilé par responsabilités (`api.js`, `auth.js`, `dashboard.js`, `router.js`, `main.js`).
* [x] **Système d'Authentification :** Développement du flux de connexion avec stockage du token JWT dans le `localStorage` et protection des routes.
* [x] **Affichage Dynamique :** Consommation de l'API sécurisée pour générer et hydrater le tableau HTML des présences.
* [x] **Moteur de Recherche Local :** Implémentation d'un filtrage en temps réel sur l'ensemble des variables relationnelles.
* [x] **Vue Historique & Exportation :** Création du panneau d'archives avec filtres combinés et algorithme d'exportation au format `.csv`.
* [x] **Design & Intégration (Bento Grid) :** Application de feuilles de styles CSS modulaires (`theme.css`, `login.css`, `dashboard.css`) avec toggle Light/Dark Mode persistant.

---

## 🎯 Étapes à venir (Roadmap)

### Version 2
* [ ] **Gestion CRUD Admin :** Possibilité de modifier ou supprimer une ligne de visite directement depuis le tableau de bord.
* [ ] **Statistiques Globales :** Ajout de compteurs rapides (nombre de visiteurs du jour, pics d'affluence, répartition des motifs d'entrée).