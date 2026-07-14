import { login, logout } from './auth.js';
import { protectRoute, redirectIfLoggedIn } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    // ==========================================
    // LOGIQUE DE LA PAGE LOGIN
    // ==========================================
    if (currentPath.includes('login.html')) {
        redirectIfLoggedIn(); // Si déjà co, on l'envoie sur index

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
                    // Si on arrive ici, c'est que le login() a réussi
                    window.location.href = 'index.html'; 
                } catch (error) {
                    errorDisplay.textContent = error.message.replace(/(<([^>]+)>)/gi, "");
                    errorDisplay.style.display = 'block';
                }
            });
        }
    }

    // ==========================================
    // LOGIQUE DE LA PAGE INDEX (DASHBOARD)
    // ==========================================
    if (currentPath.includes('index.html') || currentPath.endsWith('/')) {
        protectRoute(); // Si pas de token, on l'envoie sur login

        // Affichage du nom de l'admin pour le style (même si c'est moche pour l'instant)
        const adminName = localStorage.getItem('admin_name');
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage && adminName) {
            welcomeMessage.textContent = `Bienvenue, ${adminName} !`;
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    }
});