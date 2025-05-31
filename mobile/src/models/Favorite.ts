import { Favorite as FavoriteType, CreateFavoriteParams } from '../types/favorite';

/**
 * Classe que representa um espaço favoritado
 * Implementa a lógica de negócio relacionada a favoritos
 */
export class Favorite implements FavoriteType {
  id?: number;
  spaceId: string;
  userId: string;
  createdAt: Date;
  lastViewed: Date;

  constructor(params: CreateFavoriteParams) {
    this.spaceId = params.spaceId;
    this.userId = params.userId;
    this.createdAt = new Date();
    this.lastViewed = new Date();
  }

  /**
   * Cria uma nova instância de Favorite a partir de dados do banco
   * @param data Dados do banco de dados
   * @returns Nova instância de Favorite
   */
  static fromDatabase(data: FavoriteType): Favorite {
    const favorite = new Favorite({
      spaceId: data.spaceId,
      userId: data.userId
    });
    favorite.id = data.id;
    favorite.createdAt = new Date(data.createdAt);
    favorite.lastViewed = new Date(data.lastViewed);
    return favorite;
  }

  /**
   * Atualiza a data da última visualização
   */
  updateLastViewed(): void {
    this.lastViewed = new Date();
  }

  /**
   * Converte o modelo para um objeto plano
   * @returns Objeto com os dados do favorito
   */
  toJSON(): FavoriteType {
    return {
      id: this.id,
      spaceId: this.spaceId,
      userId: this.userId,
      createdAt: this.createdAt,
      lastViewed: this.lastViewed
    };
  }
} 