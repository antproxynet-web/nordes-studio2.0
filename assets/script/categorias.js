document.addEventListener('DOMContentLoaded', () => {
    let allProducts = [];
    let allCategories = [];
    let currentCategory = null;

    // ===== LOAD CATEGORIES AND PRODUCTS =====
    async function loadCategoryProducts() {
        const urlParams = new URLSearchParams(window.location.search);
        currentCategory = urlParams.get('cat');

        try {
            // O caminho correto é ../assets/script/books_data.json relativo à página em /pages/
            // Mas como o script é carregado via <script src="../assets/script/categorias.js">,
            // o fetch deve ser relativo à URL da página ou usar um caminho absoluto/relativo correto.
            const response = await fetch('../assets/script/books_data.json');
            if (!response.ok) throw new Error('Falha ao carregar o arquivo JSON');
            
            const data = await response.json();
            allProducts = data;

            // Extrair categorias únicas
            const categoriesSet = new Set();
            data.forEach(product => {
                if (product.categoria) {
                    categoriesSet.add(product.categoria);
                }
            });
            
            // Adicionar categorias especiais se necessário (ex: Lançamentos, Promoções)
            // Para este projeto, vamos focar nas categorias reais do JSON
            allCategories = Array.from(categoriesSet).sort();

            // Se não houver categoria na URL, usar a primeira disponível ou "Todas"
            if (!currentCategory && allCategories.length > 0) {
                // Opcional: definir uma categoria padrão ou mostrar todas
                // currentCategory = allCategories[0];
            }

            // Renderizar botões de categorias
            renderCategoryButtons();

            // Renderizar produtos
            renderProducts();
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            document.getElementById('products-container').innerHTML = '<div class="no-products">Erro ao carregar produtos. Verifique o console para mais detalhes.</div>';
        }
    }

    // ===== RENDER CATEGORY BUTTONS =====
    function renderCategoryButtons() {
        const container = document.getElementById('categories-filter-container');
        if (!container) return;
        container.innerHTML = '';

        // Botão "Todas"
        const allBtn = document.createElement('button');
        allBtn.className = 'category-filter-btn';
        allBtn.textContent = 'Todas';
        if (!currentCategory) allBtn.classList.add('active');
        allBtn.addEventListener('click', () => {
            currentCategory = null;
            window.history.pushState({}, '', 'categorias.html');
            updateActiveButton(allBtn);
            renderProducts();
        });
        container.appendChild(allBtn);

        allCategories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'category-filter-btn';
            btn.textContent = category;

            if (currentCategory && category.toLowerCase() === currentCategory.toLowerCase()) {
                btn.classList.add('active');
            }

            btn.addEventListener('click', () => {
                currentCategory = category;
                window.history.pushState({}, '', `categorias.html?cat=${encodeURIComponent(category)}`);
                updateActiveButton(btn);
                renderProducts();
                // Scroll suave para o topo do conteúdo
                document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
            });

            container.appendChild(btn);
        });
    }

    function updateActiveButton(activeBtn) {
        document.querySelectorAll('.category-filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    // ===== RENDER PRODUCTS =====
    function renderProducts() {
        const container = document.getElementById('products-container');
        const titleEl = document.getElementById('category-display');
        const countEl = document.getElementById('category-count');

        if (!container) return;

        // Atualizar título
        titleEl.innerText = currentCategory || 'Todas as Categorias';

        // Filtrar produtos
        let filteredProducts = allProducts;
        if (currentCategory) {
            const catLower = currentCategory.toLowerCase();
            
            // Lógica especial para categorias que podem não estar no JSON mas estão no menu
            if (catLower === 'lancamentos') {
                filteredProducts = allProducts.filter(p => p.data_lancamento === "2023");
            } else if (catLower === 'promocoes') {
                // Simulação: produtos com preço quebrado ou estoque alto
                filteredProducts = allProducts.filter(p => p.preco < 40);
            } else {
                filteredProducts = allProducts.filter(p => 
                    p.categoria && p.categoria.toLowerCase() === catLower
                );
            }
        }

        // Atualizar contagem
        countEl.innerText = `${filteredProducts.length} produto${filteredProducts.length !== 1 ? 's' : ''} encontrado${filteredProducts.length !== 1 ? 's' : ''}`;

        // Renderizar produtos
        if (filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                    <p>Nenhum produto encontrado nesta categoria.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredProducts.map(product => `
            <div class="book-card">
                <a href="produto.html?id=${product.id}" class="book-cover-wrapper">
                    <img src="${product.imagem.startsWith('http') ? product.imagem : 'http://localhost:5000/uploads/' + product.imagem.split('/').pop()}" alt="${product.titulo}" class="book-cover" onerror="this.src='https://via.placeholder.com/200x300?text=Sem+Imagem'">
                </a>
                <div class="book-info">
                    <h3>${product.titulo}</h3>
                    <p class="book-author">${product.autor}</p>
                    <div class="book-footer">
                        <div class="book-price">R$ ${product.preco.toFixed(2).replace('.', ',')}</div>
                        <button class="btn-add-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Inicializar
    loadCategoryProducts();

    // Handle back/forward buttons
    window.addEventListener('popstate', () => {
        const urlParams = new URLSearchParams(window.location.search);
        currentCategory = urlParams.get('cat');
        renderCategoryButtons();
        renderProducts();
    });
});

// Função global para adicionar ao carrinho (simulada)
function addToCart(id) {
    console.log('Adicionado ao carrinho:', id);
    // Aqui você pode integrar com seu carrinho.js
    if (typeof window.adicionarAoCarrinho === 'function') {
        window.adicionarAoCarrinho(id);
    } else {
        alert('Produto adicionado ao carrinho!');
    }
}
