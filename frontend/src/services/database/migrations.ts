import dbPromise from './database';

export async function runMigrations() {
  const db = await dbPromise;

  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentVersion = result?.user_version ?? 0;

  // Versão 1: Criar tabela de favoritos
  if (currentVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spaceId TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        imageUrl TEXT,
        createdAt TEXT NOT NULL
      );
    `);
    currentVersion = 1;
    await db.execAsync(`PRAGMA user_version = ${currentVersion}`);
  }

  // Versão 2: Adicionar coluna de categoria (exemplo de uma futura alteração)
  if (currentVersion === 1) {
    await db.execAsync(`
      ALTER TABLE favorites ADD COLUMN category TEXT;
    `);
    currentVersion = 2;
    await db.execAsync(`PRAGMA user_version = ${currentVersion}`);
  }

  // Adicionar mais versões conforme necessário
  // if (currentVersion === 2) {
  //   await db.execAsync(`
  //     ALTER TABLE favorites ADD COLUMN nova_coluna TEXT;
  //   `);
  //   currentVersion = 3;
  //   await db.execAsync(`PRAGMA user_version = ${currentVersion}`);
  // }
} 