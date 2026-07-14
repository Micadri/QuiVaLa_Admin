import { ENV } from './env.js';

export const fetchJwtToken = async (credentials) => {
    try {
        const response = await fetch(`${ENV.API_URL}/jwt-auth/v1/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Identifiants incorrects");
        }

        return data;

    } catch (error) {
        console.error("Erreur API :", error);
        throw error; 
    }
};