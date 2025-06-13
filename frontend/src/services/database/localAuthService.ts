import { databaseService, DatabaseService } from './databaseService';
import { LocalUser } from '../../types/database';

class LocalAuthService {
    async saveUserSession(userData: {
        id: string;
        email: string;
        token: string;
    }): Promise<void> {
        try {
            console.log('📝 Iniciando salvamento da sessão do usuário:', { email: userData.email, tokenLength: userData.token.length, userId: userData.id });
            const now = new Date().toISOString();
            console.log('⏰ Timestamp de login:', now);

            // Sanitização e validação dos dados
            const sanitizedData: Partial<LocalUser> = {
                id: this.sanitizeString(userData.id, 'id'),
                email: this.sanitizeString(userData.email, 'email'),
                token: this.sanitizeString(userData.token, 'token'),
                lastLogin: now,
                isLoggedIn: true
            };
            console.log('🧹 Dados sanitizados:', sanitizedData);

            // Validação adicional
            this.validateUserData(sanitizedData);
            console.log('✅ Dados validados com sucesso');

            // Verificar se o usuário já existe
            console.log('🔍 Verificando se usuário já existe...');
            const existingUser = await databaseService.findOne('users', { column: 'id', value: sanitizedData.id });

            if (existingUser) {
                console.log('🔄 Usuário encontrado, atualizando dados...');
                await databaseService.update('users', sanitizedData, {
                    column: 'id',
                    value: sanitizedData.id
                });
                console.log('✅ Usuário atualizado com sucesso');
            } else {
                console.log('➕ Usuário não encontrado, criando novo registro...');
                await databaseService.insert('users', sanitizedData);
                console.log('✅ Novo usuário criado com sucesso');
            }

            // Verificação pós-salvamento
            const savedUser = await databaseService.executeQuery<LocalUser>(
                'SELECT * FROM users WHERE id = ?',
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
        await databaseService.update(
            'users',
            { isLoggedIn: false },
            { column: 'id', value: userId }
        );
    }

    async clearUserSession(userId: string): Promise<void> {
        await databaseService.delete('users', { column: 'id', value: userId });
    }

    async isUserLoggedIn(userId: string): Promise<boolean> {
        const user = await this.getUserSession(userId);
        return user?.isLoggedIn || false;
    }
}

export const localAuthService = new LocalAuthService(); 