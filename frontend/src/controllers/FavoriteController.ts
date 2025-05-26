import dbPromise from '../services/database/database';
import { Favorite } from '../types/favorite';

class FavoriteController {
  // Cria a tabela de favoritos se ela não existir
  async createTable(): Promise<void> {
    const db = await dbPromise;
    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spaceId TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        imageUrl TEXT,
        createdAt TEXT NOT NULL
      );`
    );
    console.log('Tabela de favoritos criada com sucesso');
  }

  // Adiciona um espaço aos favoritos
  async add(favorite: Omit<Favorite, 'id'>): Promise<void> {
    const db = await dbPromise;
    await db.runAsync(
      'INSERT INTO favorites (spaceId, name, description, imageUrl, createdAt, category) VALUES (?, ?, ?, ?, ?, ?)',
      favorite.spaceId,
      favorite.name,
      favorite.description ?? null,
      favorite.imageUrl ?? null,
      favorite.createdAt,
      favorite.category ?? null
    );
    console.log('Favorito adicionado com sucesso');
  }

  // Remove um espaço dos favoritos
  async remove(spaceId: string): Promise<void> {
    const db = await dbPromise;
    await db.runAsync(
      'DELETE FROM favorites WHERE spaceId = ?',
      spaceId
    );
    console.log('Favorito removido com sucesso');
  }

  // Verifica se um espaço está nos favoritos
  async isFavorite(spaceId: string): Promise<boolean> {
    const db = await dbPromise;
    const result = await db.getAllAsync<Favorite>(
      'SELECT * FROM favorites WHERE spaceId = ?',
      spaceId
    );
    return result.length > 0;
  }

  // Obtém todos os favoritos
  async getAll(): Promise<Favorite[]> {
    const db = await dbPromise;
    return await db.getAllAsync<Favorite>(
      'SELECT * FROM favorites ORDER BY createdAt DESC'
    );
  }

  // Obtém favoritos por categoria
  async getByCategory(category: string): Promise<Favorite[]> {
    const db = await dbPromise;
    return await db.getAllAsync<Favorite>(
      'SELECT * FROM favorites WHERE category = ? ORDER BY createdAt DESC',
      category
    );
  }

  // Atualiza a categoria de um favorito
  async updateCategory(spaceId: string, category: string): Promise<void> {
    const db = await dbPromise;
    await db.runAsync(
      'UPDATE favorites SET category = ? WHERE spaceId = ?',
      category,
      spaceId
    );
    console.log('Categoria atualizada com sucesso');
  }
}

export default new FavoriteController(); 