/**
 * Componente de Card de Livro
 * Cria cards de livros de forma consistente
 */

const BookCard = {
    /**
     * Cria um card de livro
     * @param {Object} book - Dados do livro
     * @returns {string} HTML do card
     */
    create(book) {
        const imgPath = BooksAPI.getImageUrl(book.image);
        const price = parseFloat(book.price).toFixed(2);
        const priceFormatted = price.replace('.', ',');
        
        // Escapar dados para evitar XSS
        const title = this.escapeHtml(book.title);
        const author = this.escapeHtml(book.author);
        const description = this.escapeHtml(book.description || '');
        
        return `
            <div class="book-card" 
                 onclick="BookCard.handleClick('${book.id}', '${title}', '${price}', '${author}', '${imgPath}', '${description}', '${book.release_date}', '${book.stock}')" 
                 style="cursor: pointer;">
                <div class="book-cover-wrapper">
                    <img src="${imgPath}" 
                         alt="${title}" 
                         class="book-cover" 
                         loading="lazy"
                         onerror="this.src='/assets/images/placeholder-book.jpg'">
                </div>
                <div class="book-info">
                    <h3>${title}</h3>
                    <p class="book-author">${author}</p>
                </div>
                <div class="book-footer">
                    <p class="book-price">R$ ${priceFormatted}</p>
                    <button class="btn-slide" 
                            style="width: 100%; padding: 0.6rem; font-size: 0.8rem;" 
                            onclick="event.stopPropagation(); BookCard.addToCart('${book.id}', '${title}', ${price}, '${imgPath}')">
                        Adicionar
                    </button>
                </div>
            </div>
        `;
    },
    
    /**
     * Manipula o clique no card (vai para página do produto)
     */
    handleClick(id, title, price, author, image, desc, date, stock) {
        const params = new URLSearchParams({
            id,
            title,
            price,
            author,
            image,
            desc,
            date,
            stock
        });
        
        window.location.href = `produto.html?${params.toString()}`;
    },
    
    /**
     * Adiciona o livro ao carrinho
     */
    addToCart(id, title, price, imgPath) {
        CartService.addItem({ id, title, price, imgPath });
        CartService.updateCartUI();
        NotificationService.success(`"${title}" adicionado ao carrinho!`);
    },
    
    /**
     * Escapa HTML para prevenir XSS
     * @param {string} text - Texto a ser escapado
     * @returns {string} Texto escapado
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};
