import Database from './database';

/**
 * Função responsável por executar as migrações do banco de dados
 * As migrações são executadas em ordem sequencial, baseadas na versão atual do banco
 * Cada migração atualiza a versão do banco após sua execução bem-sucedida
 * 
 * @throws {Error} Se houver erro durante a execução das migrações
 */
export async function runMigrations(): Promise<void> {
  // Obtém a instância única do banco de dados
  const db = Database.getInstance();
  // Inicializa a conexão com o banco
  await db.initialize();

  try {
    // Consulta a versão atual do banco de dados
    // O PRAGMA user_version é usado para controlar as migrações
    const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    let currentVersion = result?.user_version ?? 0;

    // Migração inicial (versão 0 -> 1)
    if (currentVersion === 0) {
      // Configura o modo WAL (Write-Ahead Logging)
      // Este modo melhora a performance e a concorrência do banco
      await db.executeSql('PRAGMA journal_mode = WAL');

      // Atualiza a versão do banco para 1
      // Isso indica que a migração inicial foi concluída
      await db.executeSql(`PRAGMA user_version = 1`);
      currentVersion = 1;
    }

    // Log de sucesso após todas as migrações
    console.log('Migrações executadas com sucesso');
  } catch (error) {
    // Log detalhado em caso de erro
    console.error('Erro ao executar migrações:', error);
    // Propaga o erro para ser tratado pelo chamador
    throw error;
  }
} 