/**
 * Auth Guard - Sistema Centralizado de Autenticação
 * 
 * Responsável por:
 * - Validar tokens JWT
 * - Gerenciar estado de autenticação
 * - Interceptar erros 401/403
 * - Redirecionar usuários não autenticados
 * - Fornecer API unificada para todas as páginas
 */

class AuthGuard {
    constructor() {
        this.TOKEN_KEY = 'nordes_token';
        this.USER_KEY = 'nordes_user';
        this.currentUser = null;
        this.token = null;
        
        this.init();
    }
    
    /**
     * Inicializa o auth guard
     */
    init() {
        this.token = localStorage.getItem(this.TOKEN_KEY);
        
        try {
            const userStr = localStorage.getItem(this.USER_KEY);
            if (userStr) {
                this.currentUser = JSON.parse(userStr);
            }
        } catch (error) {
            console.warn('Dados de usuário corrompidos. Limpando...', error);
            this.clearAuth();
        }
    }
    
    /**
     * Verifica se o usuário está autenticado
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!this.token && !!this.currentUser;
    }
    
    /**
     * Obtém o token atual
     * @returns {string|null}
     */
    getToken() {
        return this.token;
    }
    
    /**
     * Obtém o usuário atual
     * @returns {object|null}
     */
    getCurrentUser() {
        return this.currentUser;
    }
    
    /**
     * Salva autenticação após login
     * @param {string} token - Token JWT
     * @param {object} user - Dados do usuário
     */
    setAuth(token, user) {
        this.token = token;
        this.currentUser = user;
        
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    
    /**
     * Atualiza dados do usuário
     * @param {object} user - Dados atualizados do usuário
     */
    updateUser(user) {
        this.currentUser = user;
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    
    /**
     * Limpa autenticação (logout)
     */
    clearAuth() {
        this.token = null;
        this.currentUser = null;
        
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }
    
    /**
     * Faz logout e redireciona para login
     * @param {string} reason - Motivo do logout (opcional)
     */
    logout(reason = null) {
        this.clearAuth();
        
        if (reason) {
            console.warn('Logout:', reason);
        }
        
        // Redirecionar para login
        const loginUrl = '/pages/login.html';
        if (!window.location.pathname.includes('login.html')) {
            window.location.replace(loginUrl);
        }
    }
    
    /**
     * Protege uma página - redireciona se não autenticado
     * @param {boolean} requireAuth - Se true, requer autenticação
     */
    requireAuthentication(requireAuth = true) {
        if (requireAuth && !this.isAuthenticated()) {
            console.warn('Acesso negado: usuário não autenticado');
            this.logout('Sessão expirada ou inválida');
            return false;
        }
        
        return true;
    }
    
    /**
     * Busca o perfil do usuário autenticado da API
     * @returns {Promise<object|null>}
     */
    async fetchCurrentUser() {
        if (!this.token) {
            return null;
        }
        
        try {
            const response = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    this.logout('Token inválido ou expirado');
                }
                return null;
            }
            
            const user = await response.json();
            this.updateUser(user);
            return user;
            
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
            return null;
        }
    }
    
    /**
     * Faz uma requisição autenticada
     * @param {string} url - URL da API
     * @param {object} options - Opções do fetch
     * @returns {Promise<Response>}
     */
    async authenticatedFetch(url, options = {}) {
        if (!this.token) {
            throw new Error('Usuário não autenticado');
        }
        
        // Adicionar token ao header
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${this.token}`
        };
        
        // Se for JSON, adicionar Content-Type
        if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(options.body);
        }
        
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        // Interceptar 401/403
        if (response.status === 401 || response.status === 403) {
            this.logout('Sessão expirada');
            throw new Error('Não autenticado');
        }
        
        return response;
    }
    
    /**
     * Normaliza URL de foto de perfil
     * @param {string} picture - URL ou nome do arquivo
     * @returns {string}
     */
    normalizePictureUrl(picture) {
        if (!picture) {
            return '/assets/images/icons/default-avatar.png';
        }
        
        // Se já é URL completa (http/https)
        if (picture.startsWith('http://') || picture.startsWith('https://')) {
            return picture;
        }
        
        // Se já começa com /uploads/
        if (picture.startsWith('/uploads/')) {
            return picture;
        }
        
        // Caso contrário, adicionar /uploads/
        return `/uploads/${picture}`;
    }
    
    /**
     * Redireciona usuário autenticado para home (usado na página de login)
     */
    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            console.log('Usuário já autenticado, redirecionando...');
            window.location.replace('/pages/home.html');
            return true;
        }
        return false;
    }
}

// Instância global
const authGuard = new AuthGuard();

// Expor globalmente
window.authGuard = authGuard;

// Interceptor global de erros de autenticação
window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message === 'Não autenticado') {
        console.warn('Erro de autenticação detectado globalmente');
    }
});
