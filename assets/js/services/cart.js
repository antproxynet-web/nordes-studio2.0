/**
 * Serviço de Carrinho
 * Gerencia o carrinho de compras no localStorage
 */

const CartService = {
    /**
     * Obtém o carrinho atual
     * @returns {Array} Itens do carrinho
     */
    getCart() {
        const cart = localStorage.getItem(CONFIG.STORAGE_KEYS.CART);
        return cart ? JSON.parse(cart) : [];
    },
    
    /**
     * Salva o carrinho no localStorage
     * @param {Array} cart - Itens do carrinho
     */
    saveCart(cart) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.CART, JSON.stringify(cart));
    },
    
    /**
     * Adiciona um item ao carrinho
     * @param {Object} item - Item a ser adicionado
     * @returns {Array} Carrinho atualizado
     */
    addItem(item) {
        const cart = this.getCart();
        const existingItem = cart.find(i => i.id === item.id);
        
        if (existingItem) {
            existingItem.qty = (existingItem.qty || 1) + 1;
        } else {
            cart.push({
                id: item.id,
                title: item.title,
                price: item.price,
                imgPath: item.imgPath || item.image,
                qty: 1
            });
        }
        
        this.saveCart(cart);
        return cart;
    },
    
    /**
     * Remove um item do carrinho
     * @param {string} itemId - ID do item
     * @returns {Array} Carrinho atualizado
     */
    removeItem(itemId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== itemId);
        this.saveCart(cart);
        return cart;
    },
    
    /**
     * Atualiza a quantidade de um item
     * @param {string} itemId - ID do item
     * @param {number} qty - Nova quantidade
     * @returns {Array} Carrinho atualizado
     */
    updateQuantity(itemId, qty) {
        const cart = this.getCart();
        const item = cart.find(i => i.id === itemId);
        
        if (item) {
            if (qty <= 0) {
                return this.removeItem(itemId);
            }
            item.qty = qty;
            this.saveCart(cart);
        }
        
        return cart;
    },
    
    /**
     * Limpa o carrinho
     */
    clearCart() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.CART);
    },
    
    /**
     * Retorna o total de itens no carrinho
     * @returns {number} Total de itens
     */
    getTotalItems() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    },
    
    /**
     * Retorna o valor total do carrinho
     * @returns {number} Valor total
     */
    getTotalPrice() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
    },
    
    /**
     * Atualiza o contador do carrinho na UI
     */
    updateCartUI() {
        const counter = document.querySelector('#cart-counter span');
        if (counter) {
            const totalItems = this.getTotalItems();
            counter.innerText = `Carrinho (${totalItems})`;
        }
    }
};
