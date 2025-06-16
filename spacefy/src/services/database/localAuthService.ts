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
                isLoggedIn: 1 // Garante que isLoggedIn é sempre 1 ao salvar
            };

            // Validação adicional
            this.validateUserData(sanitizedData);
            console.log('✅ Dados validados com sucesso:', {
                id: sanitizedData.id,
                email: sanitizedData.email,
                hasToken: !!sanitizedData.token,
                isLoggedIn: sanitizedData.isLoggedIn,
                lastLogin: sanitizedData.lastLogin
            });

            // Verifica se o usuário já existe
            const existingUser = await this.getUserSession(sanitizedData.id);
            console.log('🔍 Usuário existente:', existingUser ? {
                id: existingUser.id,
                email: existingUser.email,
                isLoggedIn: existingUser.isLoggedIn,
                lastLogin: existingUser.lastLogin
            } : 'Não encontrado');

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
            console.log('✅ Dados salvos no banco');

            // Verifica se os dados foram salvos corretamente
            const savedUser = await this.getUserSession(sanitizedData.id);
            console.log('🔍 Verificação pós-salvamento:', savedUser ? {
                id: savedUser.id,
                email: savedUser.email,
                isLoggedIn: savedUser.isLoggedIn,
                lastLogin: savedUser.lastLogin,
                hasToken: !!savedUser.token
            } : 'Usuário não encontrado');

            if (!savedUser || savedUser.isLoggedIn !== 1) {
                console.error('❌ Erro: Usuário não foi salvo corretamente ou isLoggedIn não está 1');
                throw new Error('Falha ao salvar sessão do usuário');
            }
        } catch (error) {
            console.error('❌ Erro ao salvar sessão:', error);
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

    async getCurrentUser(email?: string): Promise<LocalUser | null> {
        try {
            console.log('🔍 Buscando usuário atual...', { email });

            // Busca todos os usuários ou filtra por email se fornecido
            const query = email
                ? 'SELECT * FROM users WHERE LOWER(email) = LOWER(?)'
                : 'SELECT * FROM users';
            const params = email ? [email] : [];

            console.log('📝 Query:', { query, params });
            const users = await databaseService.executeQuery<LocalUser>(query, params);
            console.log('👥 Usuários encontrados:', users.length);

            // Log detalhado de cada usuário
            users.forEach((user, index) => {
                console.log(`👤 Usuário ${index + 1}:`, {
                    id: user.id,
                    email: user.email,
                    isLoggedIn: user.isLoggedIn,
                    lastLogin: user.lastLogin,
                    hasToken: !!user.token
                });
            });

            if (users.length === 0) {
                console.log('❌ Nenhum usuário encontrado');
                return null;
            }

            // Se não foi fornecido email, retorna o primeiro usuário logado
            if (!email) {
                const loggedInUser = users.find(user => user.isLoggedIn === 1);
                console.log('🔑 Usuário logado:', loggedInUser ? {
                    id: loggedInUser.id,
                    email: loggedInUser.email,
                    isLoggedIn: loggedInUser.isLoggedIn,
                    lastLogin: loggedInUser.lastLogin,
                    hasToken: !!loggedInUser.token
                } : 'Nenhum');
                return loggedInUser || null;
            }

            // Se foi fornecido email, retorna o usuário correspondente
            const currentUser = users[0];
            console.log('👤 Usuário encontrado:', {
                id: currentUser.id,
                email: currentUser.email,
                isLoggedIn: currentUser.isLoggedIn,
                lastLogin: currentUser.lastLogin
            });

            // Verifica se o token é válido
            if (!currentUser.token) {
                console.log('❌ Token não encontrado');
                return null;
            }

            // Verifica se a sessão expirou (30 dias)
            const lastLogin = new Date(currentUser.lastLogin);
            const now = new Date();
            const diffDays = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
            console.log('⏰ Verificação de expiração:', {
                lastLogin: lastLogin.toISOString(),
                now: now.toISOString(),
                diffDays
            });

            if (diffDays > 30) {
                console.log('❌ Sessão expirada (mais de 30 dias)');
                await this.logout(currentUser.id);
                return null;
            }

            console.log('✅ Usuário atual encontrado e válido');
            return currentUser;
        } catch (error) {
            console.error('❌ Erro ao buscar usuário atual:', error);
            return null;
        }
    }

    async logout(userId: string): Promise<void> {
        try {
            console.log('🚪 Iniciando processo de logout...');

            // Busca o usuário atual antes de fazer logout
            const currentUser = await this.getUserSession(userId);
            if (!currentUser) {
                console.log('❌ Usuário não encontrado');
                return;
            }

            // Executa a atualização mantendo o token e apenas alterando o status de login
            const query = `
                UPDATE users 
                SET isLoggedIn = 0,
                    lastLogin = CURRENT_TIMESTAMP
                WHERE id = ?;
            `;

            await databaseService.executeQuery(query, [userId]);
            console.log('✅ Logout realizado com sucesso, mantendo dados para login offline');
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