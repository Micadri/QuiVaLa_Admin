import { checkAuth } from './auth.js';

/**
 * Routeur de sécurité : Empêche l'accès aux utilisateurs non authentifiés.
 * Redirige vers la page d'authentification en l'absence de jeton de session.
 */
export const protectRoute = () => {
    if (!checkAuth()) {
        window.location.href = 'login.html';
    }
};

/**
 * Redirige l'utilisateur vers le tableau de bord s'il possède déjà une session valide.
 */
export const redirectIfLoggedIn = () => {
    if (checkAuth()) {
        window.location.href = 'index.html';
    }
};