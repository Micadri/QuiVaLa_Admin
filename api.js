import { ENV } from './env.js';

/**
 * Envoie une requête POST d'authentification pour récupérer un jeton JWT.
 * @param {Object} credentials - Identifiants saisis par l'utilisateur (username, password).
 * @returns {Promise<Object>} Les données de session renvoyées par l'API WordPress.
 */
export const fetchJwtToken = async (credentials) => {
    try {
        const response = await fetch(`${ENV.apiUrl}/jwt-auth/v1/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Identifiants incorrects");
        }
        
        return data;
    } catch (error) {
        throw error; 
    }
};

/**
 * Récupère la liste des visites enregistrées auprès de l'API WordPress.
 * Nécessite l'envoi du jeton JWT dans les en-têtes d'autorisation.
 * @returns {Promise<Array>} Liste des objets de visite.
 */
export const fetchVisits = async () => {
    const token = localStorage.getItem('adminJwt');
    
    try {
        const response = await fetch(`${ENV.apiUrl}/wp/v2/visite`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données.");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur d'appel API :", error);
        throw error;
    }
};