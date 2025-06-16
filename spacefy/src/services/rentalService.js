import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            console.log('🔍 Iniciando busca de espaços alugados para userId:', userId);
            const token = await AsyncStorage.getItem('token');
            console.log('🔑 Token disponível:', !!token);
            
            const response = await api.get(`/rentals/user/${userId}`);
            console.log('✅ Resposta da API recebida:', {
                status: response.status,
                hasData: !!response.data,
                dataLength: response.data?.length
            });
            
            if (!response.data || !Array.isArray(response.data)) {
                console.error('❌ Formato de resposta inválido:', response.data);
                throw new Error('Formato de resposta inválido');
            }
            
            console.log('📦 Dados dos aluguéis:', JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error) {
            console.error('❌ Erro detalhado ao buscar espaços alugados:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
            });
            throw new Error('Erro ao buscar espaços do aluguel');
        }
    }
}; 