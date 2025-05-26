import * as SQLite from 'expo-sqlite';
import FavoriteController from '../../controllers/FavoriteController';
import { runMigrations } from './migrations';

const dbPromise = SQLite.openDatabaseAsync('spacefy.db');

// Inicializa o banco de dados e executa as migrations
const initializeDatabase = async () => {
  try {
    await runMigrations();
    // Cria a tabela de favoritos
    await FavoriteController.createTable();
    console.log('Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
};

// Inicializa o banco de dados
initializeDatabase();

export default dbPromise; 