import { login, logout } from './auth.js';
import { protectRoute, redirectIfLoggedIn } from './router.js';
// NOUVEAU : Importation de filterVisits
import { renderVisitsTable, filterVisits } from './dashboard.js';

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

        // Écouteur pour la barre de recherche (réaction en direct à chaque frappe)
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
                if(searchInput) searchInput.value = ''; // On vide le champ de recherche
                renderVisitsTable(); // On recharge les données depuis l'API
            });
        }

        // Premier chargement de la table
        renderVisitsTable();
    }
});