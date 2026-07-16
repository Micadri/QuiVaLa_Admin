import { fetchVisits } from './api.js';

let currentVisits = []; 
let filteredHistoryVisits = []; 

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
            <td style="padding: 10px;">${displayedRoom || '-'}</td>
        `;
        
        tableBody.appendChild(tr);
    });
};

export const renderVisitsTable = async () => {
    const tableBody = document.querySelector('#visits-table tbody');
    if (!tableBody) return;

    try {
        tableBody.innerHTML = '<tr><td colspan="7" style="padding: 10px;">Chargement des données...</td></tr>';
        
        currentVisits = await fetchVisits();
        filteredHistoryVisits = [...currentVisits]; 
        
        displayVisitsInTable(currentVisits, '#visits-table');
        displayVisitsInTable(filteredHistoryVisits, '#history-table');
        
    } catch (error) {
        tableBody.innerHTML = '<tr><td colspan="7" style="padding: 10px; color:red;">Impossible de charger les visites.</td></tr>';
    }
};

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

const parseFrenchDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    return new Date(parts[2], parts[1] - 1, parts[0]);
};

/**
 * Filtre l'historique selon les 4 critères (Date début, Date fin, Type, Local)
 */
export const applyHistoryFilters = (startDateVal, endDateVal, typeVal, localVal) => {
    const startDate = startDateVal ? new Date(startDateVal) : null;
    const endDate = endDateVal ? new Date(endDateVal) : null;

    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);
    
    const lowerType = (typeVal || '').toLowerCase();
    const lowerLocal = (localVal || '').toLowerCase();

    filteredHistoryVisits = currentVisits.filter(visit => {
        const acf = visit.acf || {};
        const details = visit.details_complets || {};

        // 1. Filtre par Date
        const visitDateObj = parseFrenchDate(acf.date || '');
        if (startDate && (!visitDateObj || visitDateObj < startDate)) return false;
        if (endDate && (!visitDateObj || visitDateObj > endDate)) return false;

        // 2. Filtre par Type de visite
        const visitType = (acf['visite-type'] || '').toLowerCase();
        if (lowerType && visitType !== lowerType) return false;

        // 3. Filtre par Local
        let room = '';
        if (details.personnel) {
            room = (details.personnel['personnel-local'] || details.personnel['local'] || '').toLowerCase();
        } else if (details.formation) {
            room = (details.formation['formation-local'] || '').toLowerCase();
        }
        if (lowerLocal && !room.includes(lowerLocal)) return false;

        return true; // Si la ligne passe tous les tests, on la garde
    });

    displayVisitsInTable(filteredHistoryVisits, '#history-table');
};

export const resetHistoryFilter = () => {
    filteredHistoryVisits = [...currentVisits];
    displayVisitsInTable(filteredHistoryVisits, '#history-table');
};

/**
 * Exporte uniquement le tableau filtré (filteredHistoryVisits) en CSV.
 */
export const exportToCSV = () => {
    if (filteredHistoryVisits.length === 0) {
        alert("Aucune donnée à exporter.");
        return;
    }

    const headers = ["Prenom", "Nom", "Email", "Date", "Heure Entree", "Heure Sortie", "Rendez-vous", "Localisation"];
    const csvRows = [headers.join(';')]; 

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
            target || '',
            room || ''
        ];

        // Formatage blindé : on force tout en chaîne de caractères, et on échappe les guillemets
        const safeRow = row.map(val => `"${String(val).replace(/"/g, '""')}"`);
        csvRows.push(safeRow.join(';'));
    });

    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Création du lien de téléchargement
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `historique_quivala_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};