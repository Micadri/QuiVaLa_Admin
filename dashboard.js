import { fetchVisits } from './api.js';

let currentVisits = []; 
let filteredHistoryVisits = []; // Stockage spécifique pour les résultats filtrés de l'historique

/**
 * Rendu générique des lignes dans un tableau ciblé.
 */
const displayVisitsInTable = (visits, tableSelector) => {
    const tableBody = document.querySelector(`${tableSelector} tbody`);
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (visits.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="padding: 10px;">Aucune visite trouvée.</td></tr>';
        return;
    }

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
            <td style="padding: 10px;">${visitor['visiteur-prenom'] || '-'}</td>
            <td style="padding: 10px;">${visitor['visiteur-nom'] || '-'}</td>
            <td style="padding: 10px;">${acf.date || '-'}</td>
            <td style="padding: 10px;">${acf.heure_entree || '-'}</td>
            <td style="padding: 10px;">${acf.heure_sortie || '-'}</td>
            <td style="padding: 10px;">${displayedTarget}</td>
            <td style="padding: 10px;">${displayedRoom}</td>
        `;
        
        tableBody.appendChild(tr);
    });
};

/**
 * Récupère les données de l'API et initialise les deux tableaux.
 */
export const renderVisitsTable = async () => {
    const tableBody = document.querySelector('#visits-table tbody');
    if (!tableBody) return;

    try {
        tableBody.innerHTML = '<tr><td colspan="7" style="padding: 10px;">Chargement des données...</td></tr>';
        
        currentVisits = await fetchVisits();
        filteredHistoryVisits = [...currentVisits]; // Par défaut, l'historique contient tout
        
        // On affiche les données dans les deux vues
        displayVisitsInTable(currentVisits, '#visits-table');
        displayVisitsInTable(filteredHistoryVisits, '#history-table');
        
    } catch (error) {
        tableBody.innerHTML = '<tr><td colspan="7" style="padding: 10px; color:red;">Impossible de charger les visites.</td></tr>';
    }
};

/**
 * Filtre les visites de la section principale (recherche textuelle directe).
 */
export const filterVisits = (query) => {
    const lowerQuery = query.toLowerCase();
    
    const filtered = currentVisits.filter(visit => {
        const details = visit.details_complets || {};
        const visitor = details.visiteur || {};
        const formation = details.formation || {};
        const personnel = details.personnel || {};

        const prenom = (visitor['visiteur-prenom'] || '').toLowerCase();
        const nom = (visitor['visiteur-nom'] || '').toLowerCase();
        const email = (visitor['visiteur-email'] || '').toLowerCase();
        const formationNom = (formation['formation-nom'] || '').toLowerCase();
        const formationLocal = (formation['formation-local'] || '').toLowerCase();
        const personnelNom = (personnel['personnel-nom'] || '').toLowerCase();
        const personnelLocal = (personnel['personnel-local'] || personnel['local'] || '').toLowerCase();

        return prenom.includes(lowerQuery) || 
               nom.includes(lowerQuery) || 
               email.includes(lowerQuery) || 
               formationNom.includes(lowerQuery) ||
               formationLocal.includes(lowerQuery) ||
               personnelNom.includes(lowerQuery) ||
               personnelLocal.includes(lowerQuery);
    });

    displayVisitsInTable(filtered, '#visits-table');
};

/**
 * Convertit une date "JJ/MM/AAAA" en objet Date Javascript pour comparaison.
 */
const parseFrenchDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    return new Date(parts[2], parts[1] - 1, parts[0]);
};

/**
 * Filtre l'historique selon une plage de dates (Debut -> Fin).
 */
export const filterHistoryByDate = (startDateVal, endDateVal) => {
    const startDate = startDateVal ? new Date(startDateVal) : null;
    const endDate = endDateVal ? new Date(endDateVal) : null;

    // Si des dates sont saisies, on réinitialise leurs heures pour comparer uniquement les jours
    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);

    filteredHistoryVisits = currentVisits.filter(visit => {
        const visitDateObj = parseFrenchDate(visit.acf ? visit.acf.date : '');
        if (!visitDateObj) return false;

        if (startDate && visitDateObj < startDate) return false;
        if (endDate && visitDateObj > endDate) return false;

        return true;
    });

    displayVisitsInTable(filteredHistoryVisits, '#history-table');
};

/**
 * Réinitialise les filtres temporels de l'historique.
 */
export const resetHistoryFilter = () => {
    filteredHistoryVisits = [...currentVisits];
    displayVisitsInTable(filteredHistoryVisits, '#history-table');
};

/**
 * Génère et télécharge un fichier CSV basé sur les données actuellement filtrées de l'historique.
 */
export const exportToCSV = () => {
    if (filteredHistoryVisits.length === 0) {
        alert("Aucune donnée à exporter.");
        return;
    }

    // Entêtes du CSV
    const headers = ["Prenom", "Nom", "Email", "Date", "Heure Entree", "Heure Sortie", "Rendez-vous", "Localisation"];
    
    const csvRows = [headers.join(';')]; // Utilisation du point-virgule pour Excel FR

    filteredHistoryVisits.forEach(visit => {
        const acf = visit.acf || {};
        const details = visit.details_complets || {};
        const visitor = details.visiteur || {};
        
        let target = '-';
        let room = '-';

        if (details.personnel) {
            target = details.personnel['personnel-nom'];
            room = details.personnel['personnel-local'] || details.personnel['local'];
        } else if (details.formation) {
            target = details.formation['formation-nom'];
            room = details.formation['formation-local'];
        }

        const row = [
            visitor['visiteur-prenom'] || '',
            visitor['visiteur-nom'] || '',
            visitor['visiteur-email'] || '',
            acf.date || '',
            acf.heure_entree || '',
            acf.heure_sortie || '',
            target,
            room
        ];

        // Nettoyage pour éviter que des points-virgules cassent les colonnes CSV
        const safeRow = row.map(val => `"${val.toString().replace(/"/g, '""')}"`);
        csvRows.push(safeRow.join(';'));
    });

    // Encodage UTF-8 avec BOM (\uFEFF) pour forcer Excel à lire correctement les accents français
    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Téléchargement automatique
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `historique_quivala_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};