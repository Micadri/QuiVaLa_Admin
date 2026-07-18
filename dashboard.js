import { fetchVisits } from './api.js';

let currentVisits = []; 
let filteredHistoryVisits = []; 

/**
 * NOUVEAU : Formateur de date/heure depuis la donnée brute WordPress
 * Isole la date et l'heure au format "14h25" sans subir les décalages de fuseau horaire.
 */
const formatWPEntry = (wpDateString) => {
    if (!wpDateString) return { date: '-', time: '-' };
    
    // wpDateString ressemble à "2026-07-18T14:25:00"
    const parts = wpDateString.split('T');
    if (parts.length !== 2) return { date: '-', time: '-' };

    const [year, month, day] = parts[0].split('-');
    const [hours, minutes] = parts[1].split(':');

    return {
        date: `${day}/${month}/${year}`,
        time: `${hours}h${minutes}`
    };
};

/**
 * NOUVEAU : Convertisseur d'heure de sortie "Intelligent"
 * Règle le problème du format 12h anglais d'ACF (ex: "4:17" devient "16h17")
 */
const formatExitTime = (exitStr, entryTimeFormatted) => {
    if (!exitStr) return '-';
    
    const match = exitStr.trim().match(/^(\d{1,2})[:h](\d{2})\s*(am|pm)?$/i);
    if (!match) return exitStr.replace(':', 'h');

    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const modifier = match[3] ? match[3].toLowerCase() : null;

    if (modifier === 'pm' && hours < 12) {
        hours += 12;
    } else if (modifier === 'am' && hours === 12) {
        hours = 0;
    } else if (!modifier) {
        // Comparaison avec l'heure d'entrée pour deviner l'après-midi
        let entryHour = 0;
        if (entryTimeFormatted && entryTimeFormatted !== '-') {
            entryHour = parseInt(entryTimeFormatted.split('h')[0], 10);
        }
        
        // Si l'heure de sortie (ex: 4) est plus petite que l'entrée (ex: 14), on ajoute 12h
        if (hours < entryHour && hours < 12) {
            hours += 12;
        } else if (hours >= 1 && hours <= 7 && entryHour === 0) {
            // Sécurité : les départs entre 1h et 7h du matin sont convertis en après-midi
            hours += 12;
        }
    }

    return `${String(hours).padStart(2, '0')}h${minutes}`;
};

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
        
        // Utilisation des formateurs ultra-précis
        const { date: displayedDate, time: displayedEntryTime } = formatWPEntry(visit.date);
        const displayedExitTime = formatExitTime(acf.heure_sortie, displayedEntryTime);
        
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
            <td style="padding: 10px;">${displayedDate}</td>
            <td style="padding: 10px;">${displayedEntryTime}</td>
            <td style="padding: 10px;">${displayedExitTime}</td>
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

        // 1. Filtre par Date (On extrait précisément le jour sans les heures)
        const visitDateObj = visit.date ? new Date(visit.date.split('T')[0]) : null;
        if (visitDateObj) visitDateObj.setHours(0, 0, 0, 0);

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

        return true; 
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
        
        // On s'assure d'avoir la belle heure de sortie dans le fichier Excel !
        const { date: displayedDate, time: displayedEntryTime } = formatWPEntry(visit.date);
        const displayedExitTime = formatExitTime(acf.heure_sortie, displayedEntryTime);
        
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
            displayedDate,
            displayedEntryTime,
            displayedExitTime,
            target || '',
            room || ''
        ];

        const safeRow = row.map(val => `"${String(val).replace(/"/g, '""')}"`);
        csvRows.push(safeRow.join(';'));
    });

    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `historique_quivala_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};