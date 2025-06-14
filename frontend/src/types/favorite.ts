/**
 * Interface que representa um espaço favoritado no banco de dados local
 */
export interface Favorite {
  id?: number;        // ID opcional (pode não existir em novos favoritos)
  spaceId: Space;     // Dados do espaço que foi favoritado
  userId: string;     // ID do usuário que favoritou
  createdAt: Date;    // Data de criação do favorito
  lastViewed: Date;   // Data da última visualização
}

export interface Space {
  _id: string;
  space_name: string;
  image_url: string[];
  location: string;
  price_per_hour: number;
  space_description: string;
  space_amenities: string[];
  space_type: string;
  max_people: number;
  week_days: string[];
  opening_time: string;
  closing_time: string;
  space_rules: string[];
  owner_name: string;
  owner_phone: string;
  owner_email: string;
}

export interface CreateFavoriteParams {
  spaceId: string;    // ID do espaço a ser favoritado
  userId: string;     // ID do usuário que está favoritando
}