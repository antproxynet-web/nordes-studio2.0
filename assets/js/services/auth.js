/**
 * Serviço de Autenticação
 * Gerencia o estado de autenticação do usuário
 */

const AuthService = {
    /**
     * Salva o token e dados do usuário
     * @param {string} token - Token JWT
     * @param {Object} user - Dados do usuário
     */
    saveAuth(token, user) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify({
            ...user,
            loginTime: new Date().toISOString()
        }));
    },
    
    /**
     * Obtém o token armazenado
     * @returns {string|null} Token JWT
     */
    getToken() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
    },
    
    /**
     * Obtém os dados do usuário armazenados
     * @returns {Object|null} Dados do usuário
     */
    getUser() {
        const user = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
        return user ? JSON.parse(user) : null;
    },
    
    /**
     * Verifica se o usuário está autenticado
     * @returns {boolean} True se autenticado
     */
    isAuthenticated() {
        return !!this.getToken() && !!this.getUser();
    },
    
    /**
     * Verifica se o usuário é admin
     * @returns {boolean} True se admin
     */
    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'admin' && user.email === CONFIG.ADMIN_EMAIL;
    },
    
    /**
     * Limpa os dados de autenticação
     */
    clearAuth() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
    },
    
    /**
     * Realiza logout completo
     */
    async logout() {
        try {
            await AuthAPI.logout();
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        } finally {
            this.clearAuth();
            window.location.href = '/pages/login.html';
        }
    },
    
    /**
     * Atualiza a UI com base no estado de autenticação
     */
    updateAuthUI() {
        const user = this.getUser();
        const accountButton = document.querySelector('a[onclick*="handleAccountClick"]');
        
        if (accountButton && user) {
            const span = accountButton.querySelector('span');
            if (span) {
                span.innerText = user.name || user.username || 'Minha Conta';
            }
        }
    },
    
    /**
     * Processa login do Google via URL params
     */
    handleGoogleLogin() {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.get('login_success') === 'true') {
            const token = urlParams.get('token');
            const userJson = urlParams.get('user');
            
            if (token && userJson) {
                try {
                    const userData = JSON.parse(decodeURIComponent(userJson));
                    this.saveAuth(token, userData);
                    
                    // Limpar URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                    
                    console.log('Usuário logado com sucesso via Google:', userData.name);
                    return userData;
                } catch (e) {
                    console.error('Erro ao processar dados do usuário:', e);
                }
            }
        }
        
        return null;
    }
};
