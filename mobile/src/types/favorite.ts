/**
 * Interface que representa um espaço favoritado no banco de dados local
 */
export interface Favorite {
  id?: number;        // ID opcional (pode não existir em novos favoritos)
  spaceId: string;    // ID do espaço que foi favoritado
  userId: string;     // ID do usuário que favoritou
  createdAt: Date;    // Data de criação do favorito
  lastViewed: Date;   // Data da última visualização
}

export interface CreateFavoriteParams {
  spaceId: string;    // ID do espaço a ser favoritado
  userId: string;     // ID do usuário que está favoritando
}