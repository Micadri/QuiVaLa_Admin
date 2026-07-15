import { fetchJwtToken } from './api.js';

/**
 * Tente de connecter l'utilisateur et sauvegarde son jeton JWT en cas de succès.
 * @param {Object} credentials - Identifiants de connexion.
 * @returns {Promise<Object>} Données d'authentification utilisateur.
 */
export const login = async (credentials) => {
    const data = await fetchJwtToken(credentials);
    
    // Persistance des données de session
    localStorage.setItem('adminJwt', data.token);
    localStorage.setItem('adminName', data.user_display_name);
    
    return data;
};

/**
 * Supprime les données de session du stockage local et redirige vers l'accueil d'authentification.
 */
export const logout = () => {
    localStorage.removeItem('adminJwt');
    localStorage.removeItem('adminName');
    window.location.href = 'login.html';
};

/**
 * Vérifie l'état d'authentification actuel de l'utilisateur.
 * @returns {boolean} True si un jeton actif est présent, sinon False.
 */
export const checkAuth = () => {
    return !!localStorage.getItem('adminJwt');
};