import { login, logout } from './auth.js';
import { protectRoute, redirectIfLoggedIn } from './router.js';
import { renderVisitsTable } from './dashboard.js'; 

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    // LOGIQUE DE LA PAGE LOGIN
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

    // LOGIQUE DE LA PAGE INDEX (DASHBOARD)
    if (currentPath.includes('index.html') || currentPath.endsWith('/')) {
        protectRoute(); 

        const adminName = localStorage.getItem('admin_name');
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage && adminName) {
            welcomeMessage.textContent = `Bienvenue, ${adminName} !`;
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }

        // <-- ON DECLENCHE LE CHARGEMENT DU TABLEAU ICI
        renderVisitsTable(); 
    }
});