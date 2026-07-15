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
* **Vanilla JavaScript (ES6+) :** Architecture modulaire (`import`/`export`) structurée sans framework JS.
* **HTML5 & CSS3 :** Interfaces brutes et fonctionnelles.
* **Fetch API :** Communication asynchrone sécurisée avec le serveur WordPress.

---

## ⚙️ Fonctionnalités du Tableau de Bord

Le tableau de bord est conçu pour offrir une vue d'ensemble claire et sécurisée aux administrateurs :

* **Sécurité & Authentification :** L'accès au tableau de bord est strictement protégé par une page de login sécurisée générant un jeton JWT. Les routes front-end redirigent automatiquement les utilisateurs non authentifiés.
* **Live Tracking :** Un tableau dynamique affiche en temps réel les visiteurs actuellement présents dans le bâtiment (nom, motif de la visite, local cible et heure d'entrée).
* **Historique complet :** Accès centralisé à l'ensemble des logs de visites passées pour le suivi et la traçabilité.

---

## 🚀 Étapes actuelles (Ce qui est fait)

* [x] **Architecture de la Base de Données :** Configuration des Custom Post Types (Visiteurs, Personnel, Formations, Visites) dans WordPress.
* [x] **Configuration de l'API REST :** Interconnexion des champs ACF et injection des données relationnelles (`details_complets`) pour optimiser drastiquement les requêtes GET.
* [x] **Architecture Front-end Modulaire :** Mise en place d'un environnement Vanilla JS ventilé par responsabilités (`api.js`, `auth.js`, `dashboard.js`, `router.js`, `main.js`).
* [x] **Système d'Authentification :** Développement du flux de connexion avec stockage du token JWT dans le `localStorage` et protection des routes.
* [x] **Affichage Dynamique :** Consommation de l'API sécurisée pour générer et hydrater le tableau HTML des présences avec les données relationnelles conditionnelles (Personnel vs Formation).

---

## 🎯 Étapes à venir (Roadmap)

### Version 1 (En cours)
* [ ] **Filtres de vue (Live vs Historique) :** Implémentation d'un système permettant de basculer entre les visites "en cours" et les visites "clôturées".
* [ ] **Rafraîchissement des données :** Intégration d'une fonction de mise à jour manuelle ou automatique du tableau pour le suivi en direct.
* [ ] **Design & Intégration :** Application d'une surcouche CSS simple, ergonomique et fonctionnelle (thème noir et blanc privilégié) pour faciliter la lecture des données.

### Version 2
* [ ] **Gestion CRUD Admin :** Possibilité de modifier ou supprimer une ligne de visite directement depuis le tableau de bord.
* [ ] **Statistiques :** Ajout de compteurs rapides (nombre de visiteurs du jour, pics d'affluence).