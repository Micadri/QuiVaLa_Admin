import { fetchVisits } from './api.js';

/**
 * Récupère dynamiquement la liste des visites et l'injecte dans la table HTML du tableau de bord.
 */
export const renderVisitsTable = async () => {
    const tableBody = document.querySelector('#visits-table tbody');
    if (!tableBody) return;

    try {
        // Rendu d'un état de chargement pour l'utilisateur
        tableBody.innerHTML = '<tr><td colspan="7">Chargement des données...</td></tr>';
        
        // Requête vers le endpoint de l'API REST
        const visits = await fetchVisits();
        
        // Nettoyage de la table avant injection
        tableBody.innerHTML = '';

        if (visits.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">Aucune visite en cours trouvée.</td></tr>';
            return;
        }

        // Itération et construction dynamique des lignes de données
        visits.forEach(visit => {
            const acf = visit.acf || {};
            const details = visit.details_complets || {};
            const visitor = details.visiteur || {};
            
            let displayedTarget = '-';
            let displayedRoom = '-';

            // Logique d'affichage dynamique selon le motif (Personnel VS Formation)
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

    } catch (error) {
        tableBody.innerHTML = '<tr><td colspan="7" style="color:red;">Impossible de charger les visites.</td></tr>';
    }
};