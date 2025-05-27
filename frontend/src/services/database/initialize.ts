import Database from './database';
import { runMigrations } from './migrations';

/**
 * Função responsável por inicializar o banco de dados local
 * Esta função coordena todo o processo de inicialização:
 * 1. Obtém a instância do banco de dados
 * 2. Inicializa a conexão
 * 3. Executa as migrações necessárias
 * 
 * Esta função deve ser chamada uma única vez, geralmente na inicialização do app
 * 
 * @throws {Error} Se houver erro durante a inicialização ou migrações
 * @example
 * // No seu App.tsx ou arquivo principal
 * useEffect(() => {
 *   initializeDatabase().catch(console.error);
 * }, []);
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Obtém a instância única do banco de dados
    const db = Database.getInstance();
    
    // Inicializa a conexão com o banco
    // Isso cria o arquivo do banco se não existir
    await db.initialize();
    
    // Executa as migrações necessárias
    // As migrações são executadas em ordem sequencial
    await runMigrations();
    
    // Log de sucesso após a inicialização completa
    console.log('Banco de Dados Local inicializado com sucesso');
  } catch (error) {
    // Log detalhado em caso de erro
    console.error('Erro ao inicializar Banco de Dados Local:', error);
    // Propaga o erro para ser tratado pelo chamador
    throw error;
  }
} 