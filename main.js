import { login, logout } from './auth.js';
import { protectRoute, redirectIfLoggedIn } from './router.js';
import { 
    renderVisitsTable, 
    filterVisits, 
    applyHistoryFilters, 
    resetHistoryFilter, 
    exportToCSV 
} from './dashboard.js';

// --- GESTION DU THÈME SOMBRE / CLAIR ---
const initTheme = () => {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    // Récupérer la préférence sauvegardée, ou forcer 'dark' par défaut (Dark Luxury)
    const savedTheme = localStorage.getItem('quivala-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('quivala-theme', newTheme);
        themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
};

// ==========================================
// POINT D'ENTRÉE PRINCIPAL (UN SEUL ECOUTEUR)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialisation du design
    initTheme(); 

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
                    historySection.classList.remove('hidden');
                    mainSection.classList.add('hidden');
                    toggleHistoryBtn.textContent = "Retour à l'accueil";
                    toggleHistoryBtn.classList.remove('primary');
                    toggleHistoryBtn.style.backgroundColor = "#6c757d"; 
                    toggleHistoryBtn.style.color = "#fff";
                } else {
                    historySection.classList.add('hidden');
                    mainSection.classList.remove('hidden');
                    toggleHistoryBtn.textContent = "Voir l'historique";
                    toggleHistoryBtn.classList.add('primary');
                    toggleHistoryBtn.style.backgroundColor = ""; // Reset du bg inline
                }
            });
        }

        // --- RECHERCHE EN DIRECT (Section principale) ---
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                filterVisits(e.target.value);
            });
        }

        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                if(searchInput) searchInput.value = ''; 
                renderVisitsTable(); 
            });
        }

        // --- FILTRES DE L'HISTORIQUE (Dates, Type, Local) ---
        const btnApplyFilters = document.getElementById('btn-apply-filters');
        if (btnApplyFilters) {
            btnApplyFilters.addEventListener('click', () => {
                const startVal = document.getElementById('filter-start-date').value;
                const endVal = document.getElementById('filter-end-date').value;
                const typeVal = document.getElementById('filter-type').value;
                const localVal = document.getElementById('filter-local').value;
                
                // On applique les 4 filtres d'un coup
                applyHistoryFilters(startVal, endVal, typeVal, localVal);
            });
        }

        // --- RÉINITIALISATION DES FILTRES ---
        const btnResetFilters = document.getElementById('btn-reset-filters');
        if (btnResetFilters) {
            btnResetFilters.addEventListener('click', () => {
                document.getElementById('filter-start-date').value = '';
                document.getElementById('filter-end-date').value = '';
                document.getElementById('filter-type').value = '';
                document.getElementById('filter-local').value = '';
                
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