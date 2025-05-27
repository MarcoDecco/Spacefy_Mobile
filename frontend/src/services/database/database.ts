import * as SQLite from 'expo-sqlite';

/**
 * Classe Database - Implementa o padrão Singleton para gerenciar a conexão com o banco de dados SQLite
 * Esta classe é responsável por:
 * - Manter uma única instância da conexão com o banco
 * - Fornecer métodos para executar queries SQL
 * - Gerenciar o ciclo de vida da conexão
 */
class Database {
  // Instância única da classe (padrão Singleton)
  private static instance: Database;
  // Conexão com o banco de dados
  private db: SQLite.SQLiteDatabase | null = null;

  // Construtor privado para forçar o uso do getInstance
  private constructor() {}

  /**
   * Obtém a instância única da classe Database
   * @returns {Database} A instância única do banco de dados
   */
  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Inicializa a conexão com o banco de dados
   * @throws {Error} Se houver erro ao conectar com o banco
   */
  async initialize(): Promise<void> {
    try {
      if (!this.db) {
        // Abre a conexão com o banco de dados
        this.db = await SQLite.openDatabaseAsync('spacefy.db');
        console.log('Conexão com o Banco de Dados Local estabelecida');
      }
    } catch (error) {
      console.error('Erro ao conectar com o Banco de Dados Local:', error);
      throw error;
    }
  }

  /**
   * Executa uma query SQL que não retorna dados (INSERT, UPDATE, DELETE, etc)
   * @param {string} sql - Query SQL a ser executada
   * @param {any[]} params - Parâmetros da query (opcional)
   * @throws {Error} Se o banco não estiver inicializado
   */
  async executeSql(sql: string, params: any[] = []): Promise<void> {
    if (!this.db) {
      throw new Error('Banco de Dados Local não inicializado');
    }
    await this.db.execAsync(sql);
  }

  /**
   * Executa uma query SQL que retorna múltiplas linhas
   * @param {string} sql - Query SQL a ser executada
   * @param {any[]} params - Parâmetros da query (opcional)
   * @returns {Promise<T[]>} Array com os resultados da query
   * @throws {Error} Se o banco não estiver inicializado
   */
  async getAllAsync<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.db) {
      throw new Error('Banco de Dados Local não inicializado');
    }
    const result = await this.db.getAllAsync<T>(sql);
    return result;
  }

  /**
   * Executa uma query SQL que retorna uma única linha
   * @param {string} sql - Query SQL a ser executada
   * @param {any[]} params - Parâmetros da query (opcional)
   * @returns {Promise<T | null>} Primeiro resultado da query ou null se não houver resultados
   */
  async getFirstAsync<T>(sql: string, params: any[] = []): Promise<T | null> {
    const results = await this.getAllAsync<T>(sql);
    return results.length > 0 ? results[0] : null;
  }
}

export default Database; 