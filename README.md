# 🏢 QuiVaLa

**QuiVaLa** est une infrastructure numérique développée pour gérer efficacement les flux d'entrées et de sorties au sein d'une entreprise. Le projet se divise en deux outils interconnectés : une application sur tablette destinée à l'accueil des visiteurs, et un tableau de bord sécurisé sur ordinateur pour l'administration.

👤 **Auteur :** Adrien Micheroux

---

## 🛠️ Technologies Utilisées

Ce projet repose sur une architecture **Headless** et modulaire, favorisant la performance et la séparation claire entre le back-end et le front-end, sans dépendre de frameworks lourds.

**Back-end (API / Base de données) :**
* **WordPress (Headless) :** Utilisé uniquement comme moteur de base de données et gestionnaire de contenu.
* **ACF Pro (Advanced Custom Fields) :** Création de relations complexes entre les visiteurs, le personnel et les formations.
* **API REST WP :** Création d'endpoints sur mesure et optimisation des requêtes relationnelles (solution au problème N+1).
* **JWT Authentication :** Sécurisation des routes API et gestion des sessions admin.

**Front-end (Application & Dashboard) :**
* **Vanilla JavaScript (ES6+) :** Architecture modulaire (`import`/`export`) sans framework JS (ni Vue, ni React).
* **HTML5 & CSS3 :** Interfaces brutes et fonctionnelles.
* **Fetch API :** Communication asynchrone avec le serveur WordPress.

---

## ⚙️ Comment ça fonctionne pour l'utilisateur ?

Le parcours utilisateur est pensé pour être fluide et autonome selon le profil :

### 1. Pour les Visiteurs (Application Tablette)
* **Entrée :** Le visiteur saisit ses coordonnées (Nom, Prénom, Email) et choisit le motif de sa visite (rencontrer un membre du personnel ou suivre une formation). Le système lui attribue un identifiant unique et lui indique où se rendre.
* **Sortie :** En quittant le bâtiment, le visiteur encode son identifiant pour valider son départ.
* **Retour :** S'il revient un autre jour, une simple recherche via son adresse email permet au système de le reconnaître, accélérant ainsi son enregistrement.

### 2. Pour l'Administration (Tableau de Bord)
* **Sécurité :** L'administrateur se connecte via une page de login sécurisée par jeton JWT.
* **Live Tracking :** Un tableau de bord affiche en temps réel qui se trouve actuellement dans le bâtiment.
* **Historique :** Accès à l'ensemble des logs de visites passées.

---

## 🚀 Étapes actuelles (Ce qui est fait)

* [x] **Architecture de la Base de Données :** Configuration des Custom Post Types (Visiteurs, Personnel, Formations, Visites) dans WordPress.
* [x] **Configuration de l'API REST :** Interconnexion des champs ACF et injection des données relationnelles (`details_complets`) pour optimiser les requêtes GET.
* [x] **Architecture Front-end Modulaire :** Mise en place d'un environnement Vanilla JS ventilé par responsabilités (`api.js`, `auth.js`, `router.js`, `main.js`).
* [x] **Système d'Authentification :** Développement du flux de connexion, avec génération de requêtes POST sécurisées et stockage du token JWT dans le `localStorage`.
* [x] **Sécurisation des routes front-end :** Redirection automatique selon l'état de connexion de l'utilisateur (Vérification JWT).

---

## 🎯 Étapes à venir (Roadmap)

### Version 1 (En cours)
* [ ] **Développement du Dashboard :** Consommer l'API pour générer le tableau des présences "en direct" et l'historique complet.
* [ ] **Développement de l'Application Tablette :** Création des interfaces d'entrée, de sortie et de retour.
* [ ] **Interactions API CRUD :** Mise en place des requêtes POST et PUT depuis la tablette pour enregistrer et clôturer les visites en base de données.
* [ ] **Design & Intégration :** Application d'une surcouche CSS simple, fonctionnelle (et potentiellement en noir et blanc) pour l'ensemble des vues.

### Version 2
* [ ] **Génération de QR Codes :** Attribution d'un QR code unique au visiteur lors de son entrée.
* [ ] **Scan de sortie/retour :** Remplacement de la saisie manuelle de l'ID par un scan rapide du QR code pour les sorties et les retours.