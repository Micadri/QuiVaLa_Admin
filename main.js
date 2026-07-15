import { login, logout } from './auth.js';
import { protectRoute, redirectIfLoggedIn } from './router.js';
import { renderVisitsTable } from './dashboard.js'; 

/**
 * Point d'entrée de l'application (Bootstrap).
 * Analyse le chemin actuel pour instancier la logique applicative correspondante.
 */
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

                // Transformation directe des données du formulaire en objet littéral
                const formData = new FormData(e.target);
                const credentials = Object.fromEntries(formData);

                try {
                    await login(credentials);
                    window.location.href = 'index.html'; 
                } catch (error) {
                    // Nettoyage préventif des balises HTML pouvant provenir des erreurs d'API WP
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

        // Récupération de l'identité de l'administrateur de session
        const adminName = localStorage.getItem('adminName');
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage && adminName) {
            welcomeMessage.textContent = `Bienvenue, ${adminName} !`;
        }

        // Attachement de l'événement de déconnexion
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }

        // Lancement de la récupération et du rendu des données
        renderVisitsTable(); 
    }
});