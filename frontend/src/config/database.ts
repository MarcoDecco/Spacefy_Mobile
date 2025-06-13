import { DatabaseConfig } from '../types/database';

export const databaseConfig: DatabaseConfig = {
    name: 'spacefy.db',
    version: 1,
    tables: {
        users: {
            name: 'users',
            columns: {
                id: 'id TEXT PRIMARY KEY',
                email: 'email TEXT NOT NULL',
                token: 'token TEXT NOT NULL',
                lastLogin: 'lastLogin TEXT NOT NULL',
                isLoggedIn: 'isLoggedIn INTEGER NOT NULL DEFAULT 0'
            }
        }
    }
};

export const getCreateTableQueries = (): string[] => {
    const queries: string[] = [];

    Object.entries(databaseConfig.tables).forEach(([tableName, table]) => {
        const columns = Object.entries(table.columns)
            .map(([_, definition]) => definition)
            .join(', ');

        queries.push(`CREATE TABLE IF NOT EXISTS ${table.name} (${columns});`);
    });

    return queries;
}; 