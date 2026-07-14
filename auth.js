import { fetchJwtToken } from './api.js';

export const login = async (credentials) => {
    const data = await fetchJwtToken(credentials);
    // On stocke le token et le nom
    localStorage.setItem('admin_jwt', data.token);
    localStorage.setItem('admin_name', data.user_display_name);
    return data;
};

export const logout = () => {
    // On vide le coffre-fort et on jette le mec dehors
    localStorage.removeItem('admin_jwt');
    localStorage.removeItem('admin_name');
    window.location.href = 'login.html';
};

export const checkAuth = () => {
    // Renvoie true si un token existe, sinon false
    return !!localStorage.getItem('admin_jwt');
};