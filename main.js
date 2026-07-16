import { login, logout } from './auth.js';
import { protectRoute, redirectIfLoggedIn } from './router.js';
import { 
    renderVisitsTable, 
    filterVisits, 
    filterHistoryByDate, 
    resetHistoryFilter, 
    exportToCSV 
} from './dashboard.js';

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    // ==========================================
    // LOGIQUE DE LA VUE DE CONNEXION (login.html)
    // ==========================================
    if (currentPath.includes('login.html')) {
        redirectIfLoggedIn();
        const loginForm = document.getElementById('login-form');
        const errorDisplay = document.getElementById('login-error');

        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                errorDisplay.style.display = 'none';
                
                const formData = new FormData(e.target);
                const credentials = Object.fromEntries(formData);

                try {
                    await login(credentials);
                    window.location.href = 'index.html';
                } catch (error) {
                    errorDisplay.textContent = error.message.replace(/(<([^>]+)>)/gi, "");
                    errorDisplay.style.display = 'block';
                }
            });
        }
    }

    // ==========================================
    // LOGIQUE DU TABLEAU DE BORD (index.html)
    // ==========================================
    if (currentPath.includes('index.html') || currentPath.endsWith('/')) {
        protectRoute();

        const adminName = localStorage.getItem('adminName');
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage && adminName) {
            welcomeMessage.textContent = `Bienvenue, ${adminName} !`;
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }

        // --- GESTION DU TOGGLE HISTORIQUE/VUE ACTIVE ---
        const toggleHistoryBtn = document.getElementById('toggle-history-btn');
        const mainSection = document.getElementById('main-section');
        const historySection = document.getElementById('history-section');

        if (toggleHistoryBtn && mainSection && historySection) {
            toggleHistoryBtn.addEventListener('click', () => {
                const isHistoryHidden = historySection.classList.contains('hidden');
                
                if (isHistoryHidden) {
                    // On affiche l'historique
                    historySection.classList.remove('hidden');
                    mainSection.classList.add('hidden');
                    toggleHistoryBtn.textContent = "Retour à l'accueil";
                    toggleHistoryBtn.style.backgroundColor = "#6c757d"; // Devient gris
                } else {
                    // On retourne à l'accueil
                    historySection.classList.add('hidden');
                    mainSection.classList.remove('hidden');
                    toggleHistoryBtn.textContent = "Voir l'historique";
                    toggleHistoryBtn.style.backgroundColor = "#007bff"; // Devient bleu
                }
            });
        }

        // Écouteur pour la barre de recherche (recherche en direct)
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                filterVisits(e.target.value);
            });
        }

        // Écouteur pour le bouton Rafraîchir
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                if(searchInput) searchInput.value = ''; 
                renderVisitsTable(); 
            });
        }

        // --- FILTRES DE DATES DE L'HISTORIQUE ---
        const btnApplyDate = document.getElementById('btn-apply-date-filter');
        if (btnApplyDate) {
            btnApplyDate.addEventListener('click', () => {
                const startVal = document.getElementById('filter-start-date').value;
                const endVal = document.getElementById('filter-end-date').value;
                filterHistoryByDate(startVal, endVal);
            });
        }

        const btnResetDate = document.getElementById('btn-reset-date-filter');
        if (btnResetDate) {
            btnResetDate.addEventListener('click', () => {
                document.getElementById('filter-start-date').value = '';
                document.getElementById('filter-end-date').value = '';
                resetHistoryFilter();
            });
        }

        // --- BOUTON EXPORT CSV ---
        const btnExport = document.getElementById('btn-export-csv');
        if (btnExport) {
            btnExport.addEventListener('click', exportToCSV);
        }

        // Premier chargement de la table globale
        renderVisitsTable();
    }
});