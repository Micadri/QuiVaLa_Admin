import { ENV } from './env.js';

export const fetchJwtToken = async (credentials) => {
    try {
        const response = await fetch(`${ENV.API_URL}/jwt-auth/v1/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Identifiants incorrects");
        return data;
    } catch (error) {
        throw error; 
    }
};

// NOUVELLE FONCTION : Récupération des visites
export const fetchVisits = async () => {
    const token = localStorage.getItem('admin_jwt');
    
    try {
        const response = await fetch(`${ENV.API_URL}/wp/v2/visite`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Indispensable pour l'API
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données.");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
};