import api from './api';

export const rentalService = {
    createRental: async (rentalData) => {
        try {
            console.log('📝 Dados da reserva:', rentalData);
            const response = await api.post('/rentals', rentalData);
            console.log('✅ Resposta da API:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erro ao criar aluguel:', error);
            if (error.response) {
                console.error('📄 Dados do erro:', error.response.data);
                console.error('🔢 Status do erro:', error.response.status);
                throw new Error(error.response.data.error || 'Erro ao criar aluguel');
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

    getRentalsByOwner: async (ownerId) => {
        try {
            const response = await api.get(`/rentals/owner/${ownerId}`);
            return response.data;
        } catch (error) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Erro ao buscar reservas do locador');
        }
    },

    getRentedDatesBySpace: async (spaceId) => {
        try {
            console.log('Chamando API para espaço:', spaceId);
            const response = await api.get(`/rentals/space/${spaceId}/dates`);
            console.log('Resposta da API:', response);
            return response.data;
        } catch (error) {
            console.error('Erro detalhado:', error);
            if (error.response) {
                console.error('Dados do erro:', error.response.data);
                console.error('Status do erro:', error.response.status);
            }
            throw error;
        }
    }
}; 