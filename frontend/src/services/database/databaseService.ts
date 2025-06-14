import * as SQLite from 'expo-sqlite';
import { databaseConfig, getCreateTableQueries } from '../../config/database';
import { DatabaseSchema, LocalUser } from '../../types/database';

interface TransactionStatus {
    transaction_status: number;
}

class DatabaseService {
    private db: SQLite.SQLiteDatabase | null = null;
    private transactionInProgress: boolean = false;
    private isInitializing: boolean = false;
    private initializationPromise: Promise<void> | null = null;
    private transactionLock: boolean = false;
    private transactionPromise: Promise<void> | null = null;

    private async acquireTransactionLock(): Promise<void> {
        while (this.transactionLock) {
            console.log('[SQLITE] ⏳ Aguardando liberação do lock de transação...');
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.transactionLock = true;
        console.log('[SQLITE] 🔒 Lock de transação adquirido');
    }

    private releaseTransactionLock(): void {
        this.transactionLock = false;
        console.log('[SQLITE] 🔓 Lock de transação liberado');
    }

    private async checkTransactionState(): Promise<boolean> {
        if (!this.db) throw new Error('Database not initialized');

        try {
            const result = await this.db.getAllAsync<TransactionStatus>('PRAGMA transaction_status;');
            const status = result[0]?.transaction_status;
            const isActive = status === 1;

            console.log('[SQLITE] ℹ️ Estado da transação:', {
                status,
                isActive,
                hasLock: this.transactionLock
            });

            this.transactionInProgress = isActive;
            return isActive;
        } catch (error) {
            console.error('[SQLITE] ❌ Erro ao verificar estado da transação:', error);
            this.transactionInProgress = false;
            return false;
        }
    }

    private async ensureNoTransaction(): Promise<void> {
        const isActive = await this.checkTransactionState();
        if (isActive) {
            console.log('[SQLITE] ⚠️ Transação pendente detectada, tentando finalizar...');
            try {
                await this.db?.runAsync('ROLLBACK;');
                this.transactionInProgress = false;
                console.log('[SQLITE] ✅ Transação pendente finalizada com sucesso');
            } catch (error) {
                console.error('[SQLITE] ❌ Erro ao finalizar transação pendente:', error);
            }
        }
    }

    private async clearDatabase(): Promise<void> {
        try {
            console.log('[SQLITE] 🧹 Iniciando limpeza do banco de dados...');

            if (!this.db) {
                console.log('[SQLITE] ⚠️ Banco de dados não inicializado, abrindo conexão...');
                this.db = await SQLite.openDatabaseAsync(databaseConfig.name);
            }

            // Obtém todas as tabelas do banco
            const tables = Object.keys(databaseConfig.tables);
            console.log('[SQLITE] 📋 Tabelas encontradas:', tables);

            // Desativa as chaves estrangeiras temporariamente
            await this.db.runAsync('PRAGMA foreign_keys = OFF;');

            // Limpa cada tabela
            for (const table of tables) {
                console.log(`[SQLITE] 🗑️ Limpando tabela: ${table}`);
                await this.db.runAsync(`DELETE FROM ${table};`);
                // Reseta o contador de sequência (se existir)
                await this.db.runAsync(`DELETE FROM sqlite_sequence WHERE name = '${table}';`);
            }

            // Reativa as chaves estrangeiras
            await this.db.runAsync('PRAGMA foreign_keys = ON;');

            // Executa VACUUM para recuperar espaço
            console.log('[SQLITE] 🧹 Executando VACUUM para otimizar o banco...');
            await this.db.runAsync('VACUUM;');

            console.log('[SQLITE] ✅ Banco de dados limpo com sucesso!');
        } catch (error) {
            console.error('[SQLITE] ❌ Erro ao limpar banco de dados:', error);
            throw error;
        }
    }

    async init(shouldClearDatabase: boolean = false): Promise<void> {
        // Se já está inicializando, retorna a promise existente
        if (this.isInitializing && this.initializationPromise) {
            console.log('[SQLITE] ⏳ Banco já está sendo inicializado, aguardando...');
            return this.initializationPromise;
        }

        // Se já está inicializado, apenas retorna
        if (this.db) {
            console.log('[SQLITE] ℹ️ Banco já inicializado');
            return;
        }

        this.isInitializing = true;
        this.initializationPromise = this._init(shouldClearDatabase);

        try {
            await this.initializationPromise;
        } finally {
            this.isInitializing = false;
            this.initializationPromise = null;
        }
    }

    private async _init(shouldClearDatabase: boolean = false): Promise<void> {
        try {
            console.log('[SQLITE] 🚀 Iniciando banco de dados...');

            // Garante que não há transações pendentes
            if (this.db) {
                await this.ensureNoTransaction();
            }

            if (shouldClearDatabase) {
                console.log('[SQLITE] ⚠️ Modo de limpeza ativado, limpando banco antes de inicializar...');
                await this.clearDatabase();
            }

            // Tenta abrir o banco de dados
            try {
                this.db = await SQLite.openDatabaseAsync(databaseConfig.name);
                console.log('[SQLITE] ✅ Conexão com banco de dados estabelecida');
            } catch (error) {
                console.error('[SQLITE] ❌ Erro ao abrir banco de dados:', error);
                throw new Error('Falha ao abrir banco de dados: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
            }

            // Verifica se o banco foi realmente aberto
            if (!this.db) {
                throw new Error('Banco de dados não foi aberto corretamente');
            }

            // Cria as tabelas
            await this.createTables();
            console.log('[SQLITE] ✅ Tabelas criadas/verificadas com sucesso');

            // Verifica se o banco está funcionando com uma query simples
            try {
                await this.db.getAllAsync('SELECT 1');
                console.log('[SQLITE] ✅ Banco de dados está respondendo corretamente');
            } catch (error) {
                console.error('[SQLITE] ❌ Erro ao verificar banco de dados:', error);
                throw new Error('Banco de dados não está respondendo corretamente');
            }
        } catch (error) {
            console.error('[SQLITE] ❌ Erro ao inicializar banco de dados:', error);
            // Limpa o estado em caso de erro
            this.db = null;
            this.transactionInProgress = false;
            throw error;
        }
    }

    private async createTables(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        try {
            console.log('[SQLITE] 📝 Criando/verificando tabelas...');

            // Cria a tabela de usuários
            await this.db.runAsync(`
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    email TEXT NOT NULL,
                    token TEXT,
                    lastLogin TEXT,
                    isLoggedIn INTEGER DEFAULT 0,
                    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Cria a tabela de espaços favoritos
            await this.db.runAsync(`
                CREATE TABLE IF NOT EXISTS spaces (
                    _id TEXT PRIMARY KEY,
                    space_name TEXT NOT NULL,
                    image_url TEXT,
                    location TEXT,
                    price_per_hour REAL,
                    space_description TEXT,
                    space_amenities TEXT,
                    space_type TEXT,
                    max_people INTEGER,
                    week_days TEXT,
                    space_rules TEXT,
                    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
                )
            `);

            console.log('[SQLITE] ✅ Tabelas verificadas com sucesso');
        } catch (error) {
            console.error('[SQLITE] ❌ Erro ao criar tabelas:', error);
            throw error;
        }
    }

    async executeQuery<T>(query: string, params: any[] = [], inTransaction = false): Promise<T[]> {
        if (!this.db) {
            console.log('[SQLITE] ⚠️ Banco não inicializado, tentando inicializar...');
            await this.init();
            if (!this.db) throw new Error('Database not initialized after init attempt');
        }

        // Se a query contém BEGIN, precisa do lock
        const needsLock = query.trim().toLowerCase().includes('begin');

        try {
            // Verifica se já existe uma transação em andamento
            const isActive = await this.checkTransactionState();

            // Se já estamos em uma transação e a query tenta iniciar outra
            if (isActive && needsLock) {
                console.log('[SQLITE] ⚠️ Tentativa de iniciar transação dentro de outra transação, removendo BEGIN/COMMIT');

                // Remove os comandos de transação da query
                const modifiedQuery = query
                    .replace(/BEGIN\s+IMMEDIATE;?/i, '')
                    .replace(/COMMIT;?/i, '')
                    .trim();

                console.log('[SQLITE] 📝 Executando query dentro de transação existente:', {
                    originalQuery: query,
                    modifiedQuery,
                    params
                });

                const result = await this.db!.runAsync(modifiedQuery, params);
                console.log('[SQLITE] ✅ Query executada com sucesso dentro da transação:', {
                    type: modifiedQuery.trim().split(' ')[0].toUpperCase(),
                    affectedRows: result.changes
                });

                return [];
            }

            // Se precisamos de lock e não estamos em uma transação
            if (needsLock && !isActive) {
                await this.acquireTransactionLock();
                try {
                    console.log('[SQLITE] 📝 Iniciando nova transação');
                    const result = await this.db!.runAsync(query, params);
                    console.log('[SQLITE] ✅ Transação executada com sucesso:', {
                        affectedRows: result.changes
                    });
                    return [];
                } finally {
                    this.releaseTransactionLock();
                }
            }

            // Para queries normais (sem transação)
            console.log('[SQLITE] 📝 Executando query:', {
                type: query.trim().split(' ')[0].toUpperCase(),
                params
            });

            const result = await this.db!.getAllAsync<T>(query, params);
            console.log('[SQLITE] ✅ Query executada com sucesso:', {
                rowsAffected: result.length
            });

            return result;
        } catch (error) {
            console.error('[SQLITE] ❌ Erro ao executar query:', {
                error,
                query: query.substring(0, 100) + '...',
                params,
                errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
                errorStack: error instanceof Error ? error.stack : undefined
            });

            // Se estamos em uma transação e ocorreu um erro, faz rollback
            if (await this.checkTransactionState()) {
                console.log('[SQLITE] ⚠️ Erro em transação, fazendo rollback...');
                try {
                    await this.db!.runAsync('ROLLBACK;');
                    this.transactionInProgress = false;
                } catch (rollbackError) {
                    console.error('[SQLITE] ❌ Erro ao fazer rollback:', rollbackError);
                }
            }

            throw error;
        }
    }

    private async executeInTransaction<T>(callback: () => Promise<T>): Promise<T> {
        if (!this.db) throw new Error('Database not initialized');

        await this.acquireTransactionLock();
        let transactionStarted = false;

        try {
            // Verifica e limpa qualquer transação pendente
            await this.checkTransactionState();

            console.log('[SQLITE] 🔄 Iniciando nova transação...');
            await this.db.runAsync('BEGIN IMMEDIATE;');
            this.transactionInProgress = true;
            transactionStarted = true;

            const result = await callback();

            if (transactionStarted) {
                console.log('[SQLITE] ✅ Commit da transação...');
                await this.db.runAsync('COMMIT;');
                this.transactionInProgress = false;
            }
            return result;
        } catch (error) {
            console.error('[SQLITE] ❌ Erro na transação, fazendo rollback...', {
                error,
                errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
                errorStack: error instanceof Error ? error.stack : undefined,
                transactionStarted
            });

            if (transactionStarted) {
                try {
                    await this.db?.runAsync('ROLLBACK;');
                    this.transactionInProgress = false;
                    console.log('[SQLITE] ✅ Rollback realizado com sucesso');
                } catch (rollbackError) {
                    console.error('[SQLITE] ❌ Erro ao fazer rollback:', rollbackError);
                }
            }

            throw error;
        } finally {
            this.releaseTransactionLock();
        }
    }

    async insert<T extends keyof DatabaseSchema>(
        table: T,
        data: Partial<DatabaseSchema[T]>
    ): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        try {
            console.log(`[SQLITE] 📝 Iniciando inserção em ${table}:`, data);

            const columns = Object.keys(data);
            const values = Object.values(data);
            const placeholders = columns.map(() => '?').join(', ');

            const query = `
                INSERT INTO ${databaseConfig.tables[table].name} (${columns.join(', ')})
                VALUES (${placeholders})
            `;

            await this.executeInTransaction(async () => {
                await this.executeQuery(query, values, true); // <-- Passe true aqui!
            });

            console.log(`[SQLITE] ✅ Inserção em ${table} realizada com sucesso`);
        } catch (error) {
            console.error(`[SQLITE] ❌ Erro ao inserir em ${table}:`, {
                error,
                data,
                errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
                errorStack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }

    async update<T extends keyof DatabaseSchema>(
        table: T,
        data: Partial<DatabaseSchema[T]>,
        where: { column: string; value: any }
    ): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const setClause = Object.entries(data)
            .map(([key]) => `${key} = ?`)
            .join(', ');

        const query = `
            UPDATE ${databaseConfig.tables[table].name}
            SET ${setClause}
            WHERE ${where.column} = ?
        `;

        const params = [...Object.values(data), where.value];

        try {
            await this.executeQuery(query, params);
            console.log(`[SQLITE] ✅ Atualização em ${table} realizada com sucesso`);
        } catch (error) {
            console.error(`[SQLITE] ❌ Erro ao atualizar em ${table}:`, {
                error,
                data,
                where,
                errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
                errorStack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
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
        try {
            if (this.isInitializing) {
                console.log('[SQLITE] ⏳ Aguardando finalização da inicialização...');
                await this.initializationPromise;
            }

            // Garante que não há transações pendentes antes de fechar
            await this.ensureNoTransaction();

            if (this.db) {
                await this.db.closeAsync();
                this.db = null;
                this.transactionInProgress = false;
                console.log('[SQLITE] ✅ Conexão com banco de dados fechada com sucesso');
            }
        } catch (error) {
            console.error('[SQLITE] ❌ Erro ao fechar banco de dados:', error);
            throw error;
        }
    }

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