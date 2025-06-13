export interface LocalUser {
    id: string;
    email: string;
    token: string;
    lastLogin: string;
    isLoggedIn: boolean;
}

export interface DatabaseSchema {
    users: LocalUser;
}

export interface DatabaseConfig {
    name: string;
    version: number;
    tables: {
        users: {
            name: string;
            columns: {
                id: string;
                email: string;
                token: string;
                lastLogin: string;
                isLoggedIn: string;
            };
        };
    };
} 