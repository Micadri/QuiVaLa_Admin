import { fetchVisits } from './api.js';

// Stockage local des visites pour permettre une recherche rapide sans recharger l'API
let currentVisits = []; 

/**
 * Fonction utilitaire qui gère uniquement l'affichage des lignes HTML dans le tableau.
 * @param {Array} visits - Le tableau d'objets (filtré ou complet) à afficher.
 */
const displayVisits = (visits) => {
    const tableBody = document.querySelector('#visits-table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (visits.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7">Aucune visite trouvée.</td></tr>';
        return;
    }

    // Itération et construction dynamique
    visits.forEach(visit => {
        const acf = visit.acf || {};
        const details = visit.details_complets || {};
        const visitor = details.visiteur || {};
        
        let displayedTarget = '-';
        let displayedRoom = '-';

        if (details.personnel) {
            displayedTarget = `Personnel : ${details.personnel['personnel-nom']}`;
            displayedRoom = details.personnel['personnel-local'] || details.personnel['local'];
        } else if (details.formation) {
            displayedTarget = `Formation : ${details.formation['formation-nom']}`;
            displayedRoom = details.formation['formation-local'];
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${visitor['visiteur-prenom'] || '-'}</td>
            <td>${visitor['visiteur-nom'] || '-'}</td>
            <td>${acf.date || '-'}</td>
            <td>${acf.heure_entree || '-'}</td>
            <td>${acf.heure_sortie || '-'}</td>
            <td>${displayedTarget}</td>
            <td>${displayedRoom}</td>
        `;
        
        tableBody.appendChild(tr);
    });
};

/**
 * Récupère dynamiquement la liste complète depuis l'API et met à jour le tableau.
 */
export const renderVisitsTable = async () => {
    const tableBody = document.querySelector('#visits-table tbody');
    if (!tableBody) return;

    try {
        tableBody.innerHTML = '<tr><td colspan="7">Chargement des données...</td></tr>';
        
        currentVisits = await fetchVisits();
        displayVisits(currentVisits);
        
    } catch (error) {
        tableBody.innerHTML = '<tr><td colspan="7" style="color:red;">Impossible de charger les visites.</td></tr>';
    }
};

/**
 * Filtre les visites stockées en mémoire en fonction d'une requête de recherche (Nom, Email, Formation, Personnel, Local).
 * @param {string} query - La chaîne de caractères saisie par l'utilisateur.
 */
export const filterVisits = (query) => {
    const lowerQuery = query.toLowerCase();
    
    const filtered = currentVisits.filter(visit => {
        const details = visit.details_complets || {};
        const visitor = details.visiteur || {};
        const formation = details.formation || {};
        const personnel = details.personnel || {};

        // Variables liées au visiteur
        const prenom = (visitor['visiteur-prenom'] || '').toLowerCase();
        const nom = (visitor['visiteur-nom'] || '').toLowerCase();
        const email = (visitor['visiteur-email'] || '').toLowerCase();
        
        // Variables liées à la formation et son local
        const formationNom = (formation['formation-nom'] || '').toLowerCase();
        const formationLocal = (formation['formation-local'] || '').toLowerCase();

        // Variables liées au personnel et son local
        const personnelNom = (personnel['personnel-nom'] || '').toLowerCase();
        const personnelLocal = (personnel['personnel-local'] || personnel['local'] || '').toLowerCase();

        // On vérifie si la requête est incluse dans l'un de ces champs
        return prenom.includes(lowerQuery) || 
               nom.includes(lowerQuery) || 
               email.includes(lowerQuery) || 
               formationNom.includes(lowerQuery) ||
               formationLocal.includes(lowerQuery) ||
               personnelNom.includes(lowerQuery) ||
               personnelLocal.includes(lowerQuery);
    });

    displayVisits(filtered);
};