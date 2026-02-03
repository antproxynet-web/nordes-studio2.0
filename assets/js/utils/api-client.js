/**
 * Cliente de API Centralizado
 * Gerencia todas as requisições HTTP com tratamento de erros consistente
 */

const ApiClient = {
    /**
     * Configuração base
     */
    baseURL: 'http://localhost:5000',
    
    /**
     * Obtém o token de autenticação
     */
    getToken() {
        return localStorage.getItem('nordes_token');
    },
    
    /**
     * Cria headers padrão para requisições
     */
    getHeaders(includeAuth = false) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        
        return headers;
    },
    
    /**
     * Trata erros de API de forma consistente
     */
    handleError(error, response) {
        console.error('API Error:', error);
        
        // Erro de rede
        if (!response || error.message === 'Failed to fetch') {
            return {
                success: false,
                message: 'Erro ao conectar com o servidor. Verifique se o backend está rodando.',
                code: 'NETWORK_ERROR'
            };
        }
        
        // Erro HTTP
        const errorMap = {
            400: 'Dados inválidos. Verifique os campos e tente novamente.',
            401: 'Não autorizado. Faça login novamente.',
            403: 'Acesso negado. Você não tem permissão para esta ação.',
            404: 'Recurso não encontrado.',
            500: 'Erro no servidor. Tente novamente mais tarde.'
        };
        
        return {
            success: false,
            message: errorMap[response?.status] || 'Erro desconhecido',
            code: `HTTP_${response?.status || 'UNKNOWN'}`
        };
    },
    
    /**
     * Realiza requisição GET
     */
    async get(endpoint, requireAuth = false) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: this.getHeaders(requireAuth)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    message: errorData.message || this.handleError(null, response).message,
                    status: response.status
                };
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return this.handleError(error, null);
        }
    },
    
    /**
     * Realiza requisição POST
     */
    async post(endpoint, body, requireAuth = false) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(requireAuth),
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    message: errorData.message || this.handleError(null, response).message,
                    status: response.status
                };
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return this.handleError(error, null);
        }
    },
    
    /**
     * Realiza requisição PUT
     */
    async put(endpoint, body, requireAuth = false) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(requireAuth),
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    message: errorData.message || this.handleError(null, response).message,
                    status: response.status
                };
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return this.handleError(error, null);
        }
    },
    
    /**
     * Realiza requisição DELETE
     */
    async delete(endpoint, requireAuth = false) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders(requireAuth)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    message: errorData.message || this.handleError(null, response).message,
                    status: response.status
                };
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return this.handleError(error, null);
        }
    },
    
    /**
     * Upload de arquivo (FormData)
     */
    async upload(endpoint, formData, requireAuth = false) {
        try {
            const headers = {};
            if (requireAuth) {
                const token = this.getToken();
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }
            
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: headers,
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    message: errorData.message || this.handleError(null, response).message,
                    status: response.status
                };
            }
            
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return this.handleError(error, null);
        }
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.ApiClient = ApiClient;
}
