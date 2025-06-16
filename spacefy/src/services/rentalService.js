import api from './api';

export const rentalService = {
    createRental: async (rentalData) => {
        try {
            const response = await api.post('/rentals', rentalData);
            return response.data;
        } catch (error) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Erro ao criar aluguel');
        }
    },

    getRentalsByUserID: async (userId) => {
        try {
            const response = await api.get(`/rentals/user/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error('Erro ao buscar aluguéis do usuário');
        }
    },

    getSpacesByUserRentalID: async (userId) => {
        try {
            const response = await api.get(`/rentals/user/${userId}`);
            if (!response.data || !Array.isArray(response.data)) {
                throw new Error('Formato de resposta inválido');
            }
            console.log('Resposta da API de aluguéis:', JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar espaços alugados:', error);
            throw new Error('Erro ao buscar espaços do aluguel');
        }
    }
}; 