/**
 * Configurações do Frontend
 */

const CONFIG = {
    // URLs da API
    API_BASE_URL: 'http://localhost:5000/api',
    UPLOADS_URL: 'http://localhost:5000/uploads/',
    
    // Endpoints
    ENDPOINTS: {
        BOOKS: 'http://localhost:5000/api/books',
        AUTH: {
            LOGIN: 'http://localhost:5000/api/login',
            SIGNUP: 'http://localhost:5000/api/signup',
            LOGOUT: 'http://localhost:5000/api/logout',
            GOOGLE: 'http://localhost:5000/login/google'
        },
        USER: {
            PROFILE: 'http://localhost:5000/api/user/profile',
            PROFILE_PICTURE: 'http://localhost:5000/api/user/profile-picture'
        }
    },
    
    // LocalStorage keys
    STORAGE_KEYS: {
        TOKEN: 'nordes_token',
        USER: 'nordes_user',
        CART: 'nordes_cart',
        COOKIES_ACCEPTED: 'cookiesAccepted',
        COOKIES_DECLINED: 'cookiesDeclinedUntil'
    },
    
    // Configurações gerais
    ADMIN_EMAIL: 'ant.proxy.net@gmail.com',
    NOTIFICATION_DURATION: 3000,
    COOKIE_BANNER_DELAY: 1000,
    
    // Validação
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
};

// Exportar configuração (compatível com módulos e scripts inline)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
