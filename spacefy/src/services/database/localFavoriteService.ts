import { databaseService } from './databaseService';
import { LocalSpace, LocalFavorite } from '../../types/database';
import { Space } from '../../types/favorite';
import { localAuthService } from './localAuthService';

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

        // Usando apenas as colunas que existem na tabela spaces, sem os campos automáticos
        const sanitizedData = {
            _id: space._id,
            space_name: space.space_name,
            image_url: sanitizedImageUrl,
            location: sanitizedLocation,
            price_per_hour: space.price_per_hour,
            space_description: space.space_description || '',
            space_amenities: sanitizedAmenities,
            space_type: space.space_type || '',
            max_people: space.max_people || 0,
            week_days: sanitizedWeekDays,
            space_rules: sanitizedRules,
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
        try {
            console.log('💾 Iniciando salvamento de favorito:', { spaceId: space._id, userId });

            // Valida os dados antes de salvar
            if (!space._id || !userId) {
                throw new Error('ID do espaço e ID do usuário são obrigatórios');
            }

            // Verifica se o usuário existe
            const userExists = await databaseService.executeQuery<any>(
                'SELECT id FROM users WHERE id = ?',
                [userId]
            );

            if (!userExists || userExists.length === 0) {
                throw new Error('Usuário não encontrado');
            }

            // Sanitiza os dados do espaço
            const sanitizedSpace = this.sanitizeSpaceData(space);
            console.log('📝 Dados do espaço preparados:', sanitizedSpace);

            // Insere ou atualiza o espaço
            const insertSpaceQuery = `
                INSERT OR REPLACE INTO spaces (
                    _id, space_name, image_url, location, price_per_hour,
                    space_description, space_amenities, space_type, max_people,
                    week_days, space_rules, last_updated
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await databaseService.executeQuery(insertSpaceQuery, [
                sanitizedSpace._id,
                sanitizedSpace.space_name,
                sanitizedSpace.image_url,
                sanitizedSpace.location,
                sanitizedSpace.price_per_hour,
                sanitizedSpace.space_description,
                sanitizedSpace.space_amenities,
                sanitizedSpace.space_type,
                sanitizedSpace.max_people,
                sanitizedSpace.week_days,
                sanitizedSpace.space_rules,
                sanitizedSpace.last_updated
            ]);

            // Insere o favorito
            const now = new Date().toISOString();
            const insertFavoriteQuery = `
                INSERT OR REPLACE INTO favorite_spaces (
                    space_id, user_id, created_at, last_viewed
                ) VALUES (?, ?, ?, ?)
            `;

            await databaseService.executeQuery(insertFavoriteQuery, [
                space._id,
                userId,
                now,
                now
            ]);

            console.log('✅ Favorito salvo com sucesso');
        } catch (error) {
            console.error('❌ Erro ao salvar favorito:', error);
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
            console.log('🔍 Buscando favoritos para usuário:', userId);

            if (!userId) {
                console.error('❌ ID do usuário não fornecido');
                throw new Error('ID do usuário é obrigatório');
            }

            const favorites = await databaseService.findAll('favorite_spaces', {
                column: 'user_id',
                value: userId
            });

            console.log('📚 Favoritos encontrados:', favorites.length);
            return favorites;
        } catch (error) {
            console.error('❌ Erro ao buscar favoritos:', error);
            throw error;
        }
    }

    async getFavoriteSpaces(userId: string): Promise<LocalSpace[]> {
        try {
            console.log('🔍 Buscando espaços favoritos para usuário:', userId);

            if (!userId) {
                console.error('❌ ID do usuário não fornecido');
                throw new Error('ID do usuário é obrigatório');
            }

            // Verifica se o usuário existe no banco local
            const user = await localAuthService.getCurrentUser();
            console.log('👤 Usuário encontrado no banco local:', user ? {
                id: user.id,
                email: user.email,
                isLoggedIn: user.isLoggedIn
            } : 'Nenhum usuário encontrado');

            // Se não encontrou o usuário específico, mas tem um usuário logado, usa ele
            if (!user || user.id !== userId) {
                const currentUser = await localAuthService.getCurrentUser();
                if (currentUser && currentUser.isLoggedIn) {
                    console.log('✅ Usando usuário logado do banco local');
                    userId = currentUser.id;
                } else {
                    console.error('❌ Nenhum usuário autenticado encontrado');
                    throw new Error('Usuário não autenticado');
                }
            }

            // Busca os favoritos do usuário
            const favorites = await this.getFavorites(userId);
            console.log('📚 Favoritos encontrados:', favorites.length);

            if (favorites.length === 0) {
                console.log('ℹ️ Nenhum favorito encontrado');
                return [];
            }

            // Busca os detalhes dos espaços
            const spaces: LocalSpace[] = [];
            for (const favorite of favorites) {
                try {
                    const space = await databaseService.findOne('spaces', {
                        column: '_id',
                        value: favorite.space_id
                    });

                    if (space) {
                        spaces.push(space);
                    } else {
                        console.log('⚠️ Espaço não encontrado:', favorite.space_id);
                    }
                } catch (error) {
                    console.error('❌ Erro ao buscar espaço:', favorite.space_id, error);
                }
            }

            console.log('✅ Espaços favoritos recuperados:', spaces.length);
            return spaces;
        } catch (error) {
            console.error('❌ Erro ao buscar espaços favoritos:', error);
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