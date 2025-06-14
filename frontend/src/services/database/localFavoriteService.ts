import { databaseService } from './databaseService';
import { LocalSpace, LocalFavorite } from '../../types/database';
import { Space } from '../../types/favorite';

class LocalFavoriteService {
    private validateSpaceData(space: Space): void {
        console.log('🔍 Validando dados do espaço:', space);

        if (!space._id) {
            console.error('❌ ID do espaço não encontrado');
            throw new Error('ID do espaço é obrigatório');
        }
        if (!space.space_name) {
            console.error('❌ Nome do espaço não encontrado');
            throw new Error('Nome do espaço é obrigatório');
        }
        if (!space.location) {
            console.error('❌ Localização do espaço não encontrada');
            throw new Error('Localização do espaço é obrigatória');
        }
        if (typeof space.price_per_hour !== 'number') {
            console.error('❌ Preço por hora inválido:', space.price_per_hour);
            throw new Error('Preço por hora é obrigatório e deve ser um número');
        }

        // Validação adicional dos campos que serão serializados
        if (space.image_url && !Array.isArray(space.image_url)) {
            console.error('❌ image_url deve ser um array:', space.image_url);
            throw new Error('image_url deve ser um array de strings');
        }
        if (space.space_amenities && !Array.isArray(space.space_amenities)) {
            console.error('❌ space_amenities deve ser um array:', space.space_amenities);
            throw new Error('space_amenities deve ser um array de strings');
        }
        if (space.week_days && !Array.isArray(space.week_days)) {
            console.error('❌ week_days deve ser um array:', space.week_days);
            throw new Error('week_days deve ser um array de strings');
        }
        if (space.space_rules && !Array.isArray(space.space_rules)) {
            console.error('❌ space_rules deve ser um array:', space.space_rules);
            throw new Error('space_rules deve ser um array de strings');
        }

        console.log('✅ Dados do espaço validados com sucesso');
    }

    private sanitizeSpaceData(space: Space): Partial<LocalSpace> {
        console.log('🧹 Sanitizando dados do espaço:', space);

        // Valida os dados antes de sanitizar
        this.validateSpaceData(space);

        // Garante que objetos complexos sejam serializados corretamente
        const sanitizedLocation = JSON.stringify(space.location || {});
        const sanitizedImageUrl = JSON.stringify(space.image_url || []);
        const sanitizedAmenities = JSON.stringify(space.space_amenities || []);
        const sanitizedWeekDays = JSON.stringify(space.week_days || []);
        const sanitizedRules = JSON.stringify(space.space_rules || []);

        const sanitizedData = {
            id: space._id,
            space_name: space.space_name,
            image_url: sanitizedImageUrl,
            location: sanitizedLocation,
            price_per_hour: space.price_per_hour,
            space_description: space.space_description || '',
            space_amenities: sanitizedAmenities,
            space_type: space.space_type || '',
            max_people: space.max_people || 0,
            week_days: sanitizedWeekDays,
            opening_time: space.opening_time || '',
            closing_time: space.closing_time || '',
            space_rules: sanitizedRules,
            owner_name: space.owner_name || '',
            owner_phone: space.owner_phone || '',
            owner_email: space.owner_email || '',
            last_updated: new Date().toISOString()
        };

        console.log('✅ Dados do espaço sanitizados:', {
            ...sanitizedData,
            location: JSON.parse(sanitizedLocation), // Log formatado para melhor visualização
            image_url: JSON.parse(sanitizedImageUrl)
        });
        return sanitizedData;
    }

    async saveFavorite(space: Space, userId: string): Promise<void> {
        console.log('💾 Iniciando salvamento de favorito:', { spaceId: space._id, userId });

        try {
            if (!userId) {
                console.error('❌ ID do usuário não fornecido');
                throw new Error('ID do usuário é obrigatório');
            }

            // Sanitiza os dados do espaço antes da transação
            const spaceData = this.sanitizeSpaceData(space);
            console.log('📝 Dados do espaço preparados:', spaceData);

            // Primeiro, verifica se o usuário existe
            const userCheck = await databaseService.executeQuery<{ user_exists: number }>(
                'SELECT 1 as user_exists FROM users WHERE id = ?',
                [userId]
            );

            if (userCheck.length === 0) {
                throw new Error('Usuário não encontrado');
            }

            // Insere ou atualiza o espaço
            const spaceQuery = `
                INSERT INTO spaces (${Object.keys(spaceData).join(', ')})
                VALUES (${Object.keys(spaceData).map(() => '?').join(', ')})
                ON CONFLICT(id) DO UPDATE SET
                ${Object.keys(spaceData).map(key => `${key} = excluded.${key}`).join(', ')};
            `;

            await databaseService.executeQuery(spaceQuery, Object.values(spaceData));

            // Insere o favorito se não existir
            const now = new Date().toISOString();
            const favoriteQuery = `
                INSERT INTO favorite_spaces (space_id, user_id, created_at, last_viewed)
                SELECT ?, ?, ?, ?
                WHERE NOT EXISTS (
                    SELECT 1 FROM favorite_spaces 
                    WHERE space_id = ? AND user_id = ?
                );
            `;

            await databaseService.executeQuery(favoriteQuery, [
                space._id,
                userId,
                now,
                now,
                space._id,
                userId
            ]);

            console.log('✅ Favorito salvo com sucesso');
        } catch (error) {
            console.error('❌ Erro ao salvar favorito:', {
                error,
                spaceId: space._id,
                userId,
                errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
                errorStack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }

    async removeFavorite(spaceId: string, userId: string): Promise<void> {
        try {
            if (!spaceId) {
                throw new Error('ID do espaço é obrigatório');
            }
            if (!userId) {
                throw new Error('ID do usuário é obrigatório');
            }

            await databaseService.delete('favorite_spaces', {
                column: 'space_id',
                value: spaceId
            });
        } catch (error) {
            console.error('Erro ao remover favorito:', error);
            throw error;
        }
    }

    async getFavorites(userId: string): Promise<LocalFavorite[]> {
        try {
            if (!userId) {
                throw new Error('ID do usuário é obrigatório');
            }

            return await databaseService.findAll('favorite_spaces', {
                column: 'user_id',
                value: userId
            });
        } catch (error) {
            console.error('Erro ao buscar favoritos:', error);
            throw error;
        }
    }

    async getFavoriteSpaces(userId: string): Promise<Space[]> {
        try {
            if (!userId) {
                throw new Error('ID do usuário é obrigatório');
            }

            const query = `
                SELECT s.*, f.created_at, f.last_viewed
                FROM spaces s
                INNER JOIN favorite_spaces f ON s.id = f.space_id
                WHERE f.user_id = ?
                ORDER BY f.created_at DESC
            `;

            const results = await databaseService.executeQuery<any>(query, [userId]);

            return results.map(row => ({
                _id: row.id,
                space_name: row.space_name,
                image_url: JSON.parse(row.image_url),
                location: row.location,
                price_per_hour: row.price_per_hour,
                space_description: row.space_description,
                space_amenities: JSON.parse(row.space_amenities),
                space_type: row.space_type,
                max_people: row.max_people,
                week_days: JSON.parse(row.week_days),
                opening_time: row.opening_time,
                closing_time: row.closing_time,
                space_rules: JSON.parse(row.space_rules),
                owner_name: row.owner_name,
                owner_phone: row.owner_phone,
                owner_email: row.owner_email
            }));
        } catch (error) {
            console.error('Erro ao buscar espaços favoritos:', error);
            throw error;
        }
    }

    async isFavorite(spaceId: string, userId: string): Promise<boolean> {
        try {
            if (!spaceId) {
                throw new Error('ID do espaço é obrigatório');
            }
            if (!userId) {
                throw new Error('ID do usuário é obrigatório');
            }

            const query = `
                SELECT COUNT(*) as count
                FROM favorite_spaces
                WHERE space_id = ? AND user_id = ?
            `;

            const results = await databaseService.executeQuery<{ count: number }>(query, [spaceId, userId]);
            return results[0].count > 0;
        } catch (error) {
            console.error('Erro ao verificar favorito:', error);
            throw error;
        }
    }

    async updateLastViewed(spaceId: string, userId: string): Promise<void> {
        try {
            if (!spaceId) {
                throw new Error('ID do espaço é obrigatório');
            }
            if (!userId) {
                throw new Error('ID do usuário é obrigatório');
            }

            await databaseService.update(
                'favorite_spaces',
                { last_viewed: new Date().toISOString() },
                { column: 'space_id', value: spaceId }
            );
        } catch (error) {
            console.error('Erro ao atualizar última visualização:', error);
            throw error;
        }
    }
}

export const localFavoriteService = new LocalFavoriteService(); 