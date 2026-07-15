import { fetchVisits } from './api.js';

export const renderVisitsTable = async () => {
    const tableBody = document.querySelector('#visits-table tbody');
    if (!tableBody) return;

    try {
        // Message d'attente
        tableBody.innerHTML = '<tr><td colspan="7">Chargement des données...</td></tr>';
        
        // Récupération des données depuis WordPress
        const visites = await fetchVisits();
        
        // On vide le tableau
        tableBody.innerHTML = '';

        if (visites.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">Aucune visite trouvée.</td></tr>';
            return;
        }

        // Boucle sur chaque visite
        visites.forEach(visite => {
            const acf = visite.acf || {};
            const details = visite.details_complets || {};
            const visiteur = details.visiteur || {};
            
            // Variables par défaut pour la cible et le local
            let cibleAffichee = '-';
            let localAffiche = '-';

            // Logique conditionnelle : Personnel OU Formation
            if (details.personnel) {
                cibleAffichee = `Personnel: ${details.personnel['personnel-nom']}`;
                localAffiche = details.personnel['personnel-local'];
            } else if (details.formation) {
                cibleAffichee = `Formation: ${details.formation['formation-nom']}`;
                localAffiche = details.formation['formation-local'];
            }

            // Création de la ligne HTML
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${visiteur['visiteur-prenom'] || '-'}</td>
                <td>${visiteur['visiteur-nom'] || '-'}</td>
                <td>${acf.date || '-'}</td>
                <td>${acf.heure_entree || '-'}</td>
                <td>${acf.heure_sortie || '-'}</td>
                <td>${cibleAffichee}</td>
                <td>${localAffiche}</td>
            `;
            
            tableBody.appendChild(tr);
        });

    } catch (error) {
        tableBody.innerHTML = '<tr><td colspan="7" style="color:red;">Impossible de charger les visites.</td></tr>';
    }
};