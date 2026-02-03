/**
 * API de Autenticação
 * Centraliza todas as chamadas relacionadas à autenticação
 */

const AuthAPI = {
    /**
     * Realiza login com email e senha
     * @param {string} email - Email do usuário
     * @param {string} password - Senha do usuário
     * @returns {Promise<Object>} Token e dados do usuário
     */
    async login(email, password) {
        try {
            const response = await fetch(CONFIG.ENDPOINTS.AUTH.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao fazer login');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    },
    
    /**
     * Realiza cadastro de novo usuário
     * @param {Object} userData - Dados do usuário
     * @returns {Promise<Object>} Token e dados do usuário
     */
    async signup(userData) {
        try {
            const response = await fetch(CONFIG.ENDPOINTS.AUTH.SIGNUP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao criar conta');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro no cadastro:', error);
            throw error;
        }
    },
    
    /**
     * Realiza logout
     * @returns {Promise<Object>} Resultado da operação
     */
    async logout() {
        try {
            const response = await fetch(CONFIG.ENDPOINTS.AUTH.LOGOUT);
            
            if (!response.ok) {
                throw new Error('Erro ao fazer logout');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro no logout:', error);
            throw error;
        }
    },
    
    /**
     * Redireciona para login com Google
     */
    loginWithGoogle() {
        window.location.href = CONFIG.ENDPOINTS.AUTH.GOOGLE;
    }
};
