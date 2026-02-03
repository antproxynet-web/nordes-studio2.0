/**
 * API de Livros
 * Centraliza todas as chamadas relacionadas a livros
 */

const BooksAPI = {
    /**
     * Busca todos os livros
     * @param {Object} filters - Filtros opcionais (category, search)
     * @returns {Promise<Array>} Lista de livros
     */
    async fetchAll(filters = {}) {
        try {
            const params = new URLSearchParams();
            
            if (filters.category) {
                params.append('category', filters.category);
            }
            if (filters.search) {
                params.append('search', filters.search);
            }
            
            const url = filters.category || filters.search 
                ? `${CONFIG.ENDPOINTS.BOOKS}?${params.toString()}`
                : CONFIG.ENDPOINTS.BOOKS;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const books = await response.json();
            return books;
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            throw error;
        }
    },
    
    /**
     * Busca um livro específico por ID
     * @param {number} bookId - ID do livro
     * @returns {Promise<Object>} Dados do livro
     */
    async fetchById(bookId) {
        try {
            const response = await fetch(`${CONFIG.ENDPOINTS.BOOKS}/${bookId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const book = await response.json();
            return book;
        } catch (error) {
            console.error(`Erro ao buscar livro ${bookId}:`, error);
            throw error;
        }
    },
    
    /**
     * Cria um novo livro (admin apenas)
     * @param {FormData} formData - Dados do livro
     * @param {string} token - Token JWT
     * @returns {Promise<Object>} Livro criado
     */
    async create(formData, token) {
        try {
            const response = await fetch(CONFIG.ENDPOINTS.BOOKS, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao criar livro');
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Erro ao criar livro:', error);
            throw error;
        }
    },
    
    /**
     * Atualiza um livro existente (admin apenas)
     * @param {number} bookId - ID do livro
     * @param {FormData} formData - Dados atualizados
     * @param {string} token - Token JWT
     * @returns {Promise<Object>} Livro atualizado
     */
    async update(bookId, formData, token) {
        try {
            const response = await fetch(`${CONFIG.ENDPOINTS.BOOKS}/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao atualizar livro');
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Erro ao atualizar livro:', error);
            throw error;
        }
    },
    
    /**
     * Remove um livro (admin apenas)
     * @param {number} bookId - ID do livro
     * @param {string} token - Token JWT
     * @returns {Promise<Object>} Resultado da operação
     */
    async delete(bookId, token) {
        try {
            const response = await fetch(`${CONFIG.ENDPOINTS.BOOKS}/${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao excluir livro');
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Erro ao excluir livro:', error);
            throw error;
        }
    },
    
    /**
     * Retorna a URL completa da imagem do livro
     * @param {string} imagePath - Caminho da imagem
     * @returns {string} URL completa
     */
    getImageUrl(imagePath) {
        if (!imagePath) {
            return '/assets/images/placeholder-book.jpg'; // Fallback
        }
        
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        return CONFIG.UPLOADS_URL + imagePath;
    }
};
