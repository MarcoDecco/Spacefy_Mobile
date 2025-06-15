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
        },
        spaces: {
            name: 'spaces',
            columns: {
                id: 'id TEXT PRIMARY KEY',
                space_name: 'space_name TEXT NOT NULL',
                image_url: 'image_url TEXT NOT NULL',
                location: 'location TEXT NOT NULL',
                price_per_hour: 'price_per_hour REAL NOT NULL',
                space_description: 'space_description TEXT',
                space_amenities: 'space_amenities TEXT NOT NULL',
                space_type: 'space_type TEXT',
                max_people: 'max_people INTEGER',
                week_days: 'week_days TEXT NOT NULL',
                opening_time: 'opening_time TEXT',
                closing_time: 'closing_time TEXT',
                space_rules: 'space_rules TEXT NOT NULL',
                owner_name: 'owner_name TEXT',
                owner_phone: 'owner_phone TEXT',
                owner_email: 'owner_email TEXT',
                last_updated: 'last_updated TEXT NOT NULL'
            }
        },
        favorite_spaces: {
            name: 'favorite_spaces',
            columns: {
                id: 'id INTEGER PRIMARY KEY AUTOINCREMENT',
                space_id: 'space_id TEXT NOT NULL',
                user_id: 'user_id TEXT NOT NULL',
                created_at: 'created_at TEXT NOT NULL',
                last_viewed: 'last_viewed TEXT NOT NULL',
                fk_space: 'FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE',
                fk_user: 'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE',
                unique_favorite: 'UNIQUE(space_id, user_id)'
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