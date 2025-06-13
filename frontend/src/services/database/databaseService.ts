import * as SQLite from 'expo-sqlite';
import { databaseConfig, getCreateTableQueries } from '../../config/database';
import { DatabaseSchema, LocalUser } from '../../types/database';

class DatabaseService {
    private db: SQLite.SQLiteDatabase | null = null;

    private async clearDatabase(): Promise<void> {
        try {
            console.log('🧹 Iniciando limpeza do banco de dados...');

            if (!this.db) {
                console.log('⚠️ Banco de dados não inicializado, abrindo conexão...');
                this.db = await SQLite.openDatabaseAsync(databaseConfig.name);
            }

            // Obtém todas as tabelas do banco
            const tables = Object.keys(databaseConfig.tables);
            console.log('📋 Tabelas encontradas:', tables);

            // Desativa as chaves estrangeiras temporariamente
            await this.db.runAsync('PRAGMA foreign_keys = OFF;');

            // Limpa cada tabela
            for (const table of tables) {
                console.log(`🗑️ Limpando tabela: ${table}`);
                await this.db.runAsync(`DELETE FROM ${table};`);
                // Reseta o contador de sequência (se existir)
                await this.db.runAsync(`DELETE FROM sqlite_sequence WHERE name = '${table}';`);
            }

            // Reativa as chaves estrangeiras
            await this.db.runAsync('PRAGMA foreign_keys = ON;');

            // Executa VACUUM para recuperar espaço
            console.log('🧹 Executando VACUUM para otimizar o banco...');
            await this.db.runAsync('VACUUM;');

            console.log('✅ Banco de dados limpo com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao limpar banco de dados:', error);
            throw error;
        }
    }

    async init(shouldClearDatabase: boolean = false): Promise<void> {
        try {
            console.log('🚀 Iniciando banco de dados...');

            if (shouldClearDatabase) {
                console.log('⚠️ Modo de limpeza ativado, limpando banco antes de inicializar...');
                await this.clearDatabase();
            }

            this.db = await SQLite.openDatabaseAsync(databaseConfig.name);
            console.log('✅ Conexão com banco de dados estabelecida');

            await this.createTables();
            console.log('✅ Tabelas criadas/verificadas com sucesso');
        } catch (error) {
            console.error('❌ Erro ao inicializar banco de dados:', error);
            throw error;
        }
    }

    private async createTables(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const queries = getCreateTableQueries();

        for (const query of queries) {
            await this.db.execAsync(query);
        }
    }

    async executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
        if (!this.db) throw new Error('Database not initialized');

        try {
            if (query.trim().toLowerCase().startsWith('select')) {
                // Para SELECT, use getAllAsync
                const result = await this.db.getAllAsync(query, params);
                return result as T[];
            } else {
                // Para outros comandos, use runAsync
                await this.db.runAsync(query, params);
                return [];
            }
        } catch (error) {
            console.error('Erro ao executar query:', error);
            throw error;
        }
    }

    async insert<T extends keyof DatabaseSchema>(
        table: T,
        data: Partial<DatabaseSchema[T]>
    ): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = columns.map(() => '?').join(', ');

        const query = `
      INSERT INTO ${databaseConfig.tables[table].name} (${columns.join(', ')})
      VALUES (${placeholders})
    `;

        await this.executeQuery(query, values);
    }

    async update<T extends keyof DatabaseSchema>(
        table: T,
        data: Partial<DatabaseSchema[T]>,
        where: { column: string; value: any }
    ): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const setClause = Object.keys(data)
            .map(key => `${key} = ?`)
            .join(', ');
        const values = [...Object.values(data), where.value];

        const query = `
      UPDATE ${databaseConfig.tables[table].name}
      SET ${setClause}
      WHERE ${where.column} = ?
    `;

        await this.executeQuery(query, values);
    }

    async delete<T extends keyof DatabaseSchema>(
        table: T,
        where: { column: string; value: any }
    ): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const query = `
      DELETE FROM ${databaseConfig.tables[table].name}
      WHERE ${where.column} = ?
    `;

        await this.executeQuery(query, [where.value]);
    }

    async findOne<T extends keyof DatabaseSchema>(
        table: T,
        where: { column: string; value: any }
    ): Promise<DatabaseSchema[T] | null> {
        if (!this.db) throw new Error('Database not initialized');

        const query = `
      SELECT * FROM ${databaseConfig.tables[table].name}
      WHERE ${where.column} = ?
      LIMIT 1
    `;

        const results = await this.executeQuery<DatabaseSchema[T]>(query, [where.value]);
        return results[0] || null;
    }

    async findAll<T extends keyof DatabaseSchema>(
        table: T,
        where?: { column: string; value: any }
    ): Promise<DatabaseSchema[T][]> {
        if (!this.db) throw new Error('Database not initialized');

        let query = `SELECT * FROM ${databaseConfig.tables[table].name}`;
        const params: any[] = [];

        if (where) {
            query += ` WHERE ${where.column} = ?`;
            params.push(where.value);
        }

        return this.executeQuery<DatabaseSchema[T]>(query, params);
    }

    async close(): Promise<void> {
        if (this.db) {
            await this.db.closeAsync();
            this.db = null;
        }
    }

    // Remova o método upsert e adicione este método updateSession:
    async updateSession<T extends keyof DatabaseSchema>(
        table: T,
        data: Partial<DatabaseSchema[T]>,
        uniqueColumn: string = 'id'
    ): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const whereValue = (data as any)[uniqueColumn];
        if (!whereValue) throw new Error(`Valor da coluna única (${uniqueColumn}) não informado para update.`);

        console.log(`🔄 Atualizando registro em ${table} onde ${uniqueColumn} = ${whereValue}`);
        await this.update(table, data, { column: uniqueColumn, value: whereValue });
    }
}

export const databaseService = new DatabaseService();