import Database from '../services/database/database';
import { CreateFavoriteParams } from '../types/favorite';
import { Favorite } from '../models/Favorite';

/**
 * Controlador responsável por gerenciar as operações de favoritos
 * Implementa a lógica de negócios relacionada aos espaços favoritados
 */
export class FavoriteController {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  /**
   * Adiciona um novo espaço aos favoritos
   * @param params Parâmetros para criar um novo favorito
   * @returns O favorito criado
   * @throws {Error} Se houver erro ao adicionar o favorito
   */
  async addFavorite(params: CreateFavoriteParams): Promise<Favorite> {
    try {
      const { spaceId, userId } = params;
      
      // Verifica se o espaço já está favoritado
      const existing = await this.getFavorite(spaceId, userId);
      if (existing) {
        return existing;
      }

      // Cria uma nova instância do modelo
      const favorite = new Favorite(params);

      // Insere o novo favorito
      await this.db.executeSql(
        'INSERT INTO favorites (spaceId, userId, createdAt, lastViewed) VALUES (?, ?, ?, ?)',
        [favorite.spaceId, favorite.userId, favorite.createdAt, favorite.lastViewed]
      );

      // Retorna o favorito criado
      const newFavorite = await this.getFavorite(spaceId, userId);
      if (!newFavorite) {
        throw new Error('Erro ao criar favorito');
      }
      return newFavorite;
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      throw error;
    }
  }

  /**
   * Remove um espaço dos favoritos
   * @param spaceId ID do espaço
   * @param userId ID do usuário
   * @throws {Error} Se houver erro ao remover o favorito
   */
  async removeFavorite(spaceId: string, userId: string): Promise<void> {
    try {
      await this.db.executeSql(
        'DELETE FROM favorites WHERE spaceId = ? AND userId = ?',
        [spaceId, userId]
      );
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      throw error;
    }
  }

  /**
   * Obtém um favorito específico
   * @param spaceId ID do espaço
   * @param userId ID do usuário
   * @returns O favorito encontrado ou null
   * @throws {Error} Se houver erro ao buscar o favorito
   */
  async getFavorite(spaceId: string, userId: string): Promise<Favorite | null> {
    try {
      const result = await this.db.getFirstAsync<Favorite>(
        'SELECT * FROM favorites WHERE spaceId = ? AND userId = ?',
        [spaceId, userId]
      );
      return result ? Favorite.fromDatabase(result) : null;
    } catch (error) {
      console.error('Erro ao buscar favorito:', error);
      throw error;
    }
  }

  /**
   * Lista todos os favoritos de um usuário
   * @param userId ID do usuário
   * @returns Lista de favoritos
   * @throws {Error} Se houver erro ao listar os favoritos
   */
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    try {
      const results = await this.db.getAllAsync<Favorite>(
        'SELECT * FROM favorites WHERE userId = ? ORDER BY lastViewed DESC',
        [userId]
      );
      return results.map(result => Favorite.fromDatabase(result));
    } catch (error) {
      console.error('Erro ao listar favoritos:', error);
      throw error;
    }
  }

  /**
   * Atualiza a data da última visualização de um favorito
   * @param spaceId ID do espaço
   * @param userId ID do usuário
   * @throws {Error} Se houver erro ao atualizar a data
   */
  async updateLastViewed(spaceId: string, userId: string): Promise<void> {
    try {
      const favorite = await this.getFavorite(spaceId, userId);
      if (favorite) {
        favorite.updateLastViewed();
        await this.db.executeSql(
          'UPDATE favorites SET lastViewed = ? WHERE spaceId = ? AND userId = ?',
          [favorite.lastViewed, spaceId, userId]
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar última visualização:', error);
      throw error;
    }
  }

  /**
   * Verifica se um espaço está favoritado
   * @param spaceId ID do espaço
   * @param userId ID do usuário
   * @returns true se o espaço estiver favoritado, false caso contrário
   */
  async isFavorite(spaceId: string, userId: string): Promise<boolean> {
    try {
      const favorite = await this.getFavorite(spaceId, userId);
      return !!favorite;
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
      throw error;
    }
  }
} 