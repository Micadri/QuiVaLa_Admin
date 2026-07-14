import { checkAuth } from './auth.js';

export const protectRoute = () => {
    // Si pas de token, retour au login
    if (!checkAuth()) {
        window.location.href = 'login.html';
    }
};

export const redirectIfLoggedIn = () => {
    // Si déjà connecté, pas besoin de se relogguer
    if (checkAuth()) {
        window.location.href = 'index.html';
    }
};