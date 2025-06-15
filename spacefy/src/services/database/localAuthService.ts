import { databaseService } from './databaseService';
import { LocalUser } from '../../types/database';

class LocalAuthService {
    async saveUserSession(userData: {
        id: string;
        email: string;
        token: string;
    }): Promise<void> {
        try {
            console.log('📝 Iniciando salvamento da sessão do usuário:', {
                email: userData.email,
                tokenLength: userData.token.length,
                userId: userData.id
            });

            const now = new Date().toISOString();
            console.log('⏰ Timestamp de login:', now);

            // Sanitização e validação dos dados
            const sanitizedData = {
                id: this.sanitizeString(userData.id, 'id'),
                email: this.sanitizeString(userData.email, 'email'),
                token: this.sanitizeString(userData.token, 'token'),
                lastLogin: now,
                isLoggedIn: 1
            };

            // Validação adicional
            this.validateUserData(sanitizedData);
            console.log('✅ Dados validados com sucesso');

            // Executa a inserção/atualização sem transação explícita
            const query = `
                INSERT INTO users (id, email, token, lastLogin, isLoggedIn)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    email = excluded.email,
                    token = excluded.token,
                    lastLogin = excluded.lastLogin,
                    isLoggedIn = excluded.isLoggedIn;
            `;

            const params = [
                sanitizedData.id,
                sanitizedData.email,
                sanitizedData.token,
                sanitizedData.lastLogin,
                sanitizedData.isLoggedIn
            ];

            await databaseService.executeQuery(query, params);

            // Verificação pós-salvamento usando executeQuery
            const savedUser = await databaseService.executeQuery<{
                id: string;
                email: string;
                lastLogin: string;
                isLoggedIn: number;
            }>(
                'SELECT id, email, lastLogin, isLoggedIn FROM users WHERE id = ?',
                [sanitizedData.id]
            );

            console.log('🔍 Verificação pós-salvamento:', {
                encontrado: savedUser.length > 0,
                dados: savedUser[0] ? {
                    id: savedUser[0].id,
                    email: savedUser[0].email,
                    lastLogin: savedUser[0].lastLogin,
                    isLoggedIn: savedUser[0].isLoggedIn
                } : null
            });

        } catch (error: unknown) {
            const errorMessage = (error instanceof Error) ? error.message : 'Erro desconhecido';
            const errorStack = (error instanceof Error) ? error.stack : undefined;
            console.error('❌ Erro ao salvar sessão do usuário:', {
                error,
                userData: {
                    id: userData.id,
                    email: userData.email,
                    tokenLength: userData.token.length
                },
                message: errorMessage,
                stack: errorStack
            });
            throw error;
        }
    }

    private sanitizeString(value: any, fieldName: string): string {
        if (value === null || value === undefined) {
            throw new Error(`Campo ${fieldName} não pode ser nulo ou indefinido`);
        }

        const stringValue = String(value).trim();
        if (!stringValue) {
            throw new Error(`Campo ${fieldName} não pode estar vazio`);
        }

        return stringValue;
    }

    private validateUserData(data: Record<string, any>): void {
        const requiredFields = ['id', 'email', 'token', 'lastLogin'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            throw new Error(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
        }
    }

    async updateUserSession(userId: string, updates: Partial<LocalUser>): Promise<void> {
        try {
            const sanitizedUpdates: Record<string, string | number> = {};

            // Sanitização dos campos de atualização
            Object.entries(updates).forEach(([key, value]) => {
                if (value === undefined) return;

                if (key === 'isLoggedIn') {
                    sanitizedUpdates[key] = value ? 1 : 0;
                } else if (typeof value === 'object' && value !== null) {
                    sanitizedUpdates[key] = JSON.stringify(value);
                } else {
                    sanitizedUpdates[key] = String(value).trim();
                }
            });

            await databaseService.update('users', sanitizedUpdates, {
                column: 'id',
                value: this.sanitizeString(userId, 'userId')
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            const errorStack = error instanceof Error ? error.stack : undefined;

            console.error('Erro ao atualizar sessão do usuário:', {
                error,
                userId,
                updates,
                message: errorMessage,
                stack: errorStack
            });
            throw error;
        }
    }

    async getUserSession(userId: string): Promise<LocalUser | null> {
        return databaseService.findOne('users', { column: 'id', value: userId });
    }

    async getCurrentUser(): Promise<LocalUser | null> {
        const users = await databaseService.findAll('users', { column: 'isLoggedIn', value: 1 });
        return users[0] || null;
    }

    async logout(userId: string): Promise<void> {
        try {
            console.log('🚪 Iniciando processo de logout...');

            // Executa a atualização sem transação explícita
            const query = `
                UPDATE users 
                SET isLoggedIn = 0,
                    token = '',
                    lastLogin = CURRENT_TIMESTAMP
                WHERE id = ?;
            `;

            await databaseService.executeQuery(query, [userId]);
            console.log('✅ Logout realizado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao fazer logout:', error);
            throw error;
        }
    }

    async clearUserSession(userId: string): Promise<void> {
        await databaseService.delete('users', { column: 'id', value: userId });
    }

    async isUserLoggedIn(userId: string): Promise<boolean> {
        const user = await this.getUserSession(userId);
        return user?.isLoggedIn === 1;
    }
}

export const localAuthService = new LocalAuthService(); 