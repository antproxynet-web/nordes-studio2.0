// ===== ESTADO GLOBAL =====
let cart = JSON.parse(localStorage.getItem('nordes_cart')) || [];
let currentProduct = null;

// ===== CAPTURAR DADOS DA URL =====
window.loadProduct = function() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const title = params.get('title') || "Produto";
    const price = parseFloat(params.get('price')) || 0;
    const author = params.get('author') || "Autor Desconhecido";
    const image = params.get('image') || "livro1.jpg";
    const desc = params.get('desc') || "Sem descrição disponível.";
    const date = params.get('date') || "N/A";
    const stock = params.get('stock') || "Consulte";

    if (!id) {
        // Se não houver ID, não redirecionar imediatamente para evitar loops em navegação interna
        console.warn("Nenhum ID de produto encontrado na URL.");
        return;
    }

    currentProduct = { id, title, price, imgPath: image, author };

    // Atualizar UI
    if(document.getElementById('prod-title')) document.getElementById('prod-title').innerText = title;
    if(document.getElementById('prod-author')) document.getElementById('prod-author').innerText = author;
    if(document.getElementById('prod-price')) document.getElementById('prod-price').innerText = `R$ ${price.toFixed(2).replace('.', ',')}`;
    if(document.getElementById('prod-img')) document.getElementById('prod-img').src = image;
    if(document.getElementById('prod-desc')) document.getElementById('prod-desc').innerText = desc;
    if(document.getElementById('prod-stock')) document.getElementById('prod-stock').innerText = stock;
    
    document.title = `${title} - Nordes Studio`;
    
    updateCartUI();
}

function updateCartUI() {
    const counter = document.getElementById('cart-counter');
    if (counter) {
        const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        counter.innerText = `Carrinho (${totalItems})`;
    }
    localStorage.setItem('nordes_cart', JSON.stringify(cart));
}

function showNotification(text) {
    const notif = document.getElementById('notification');
    if (notif) {
        notif.innerText = text;
        notif.classList.add('active');
        setTimeout(() => notif.classList.remove('active'), 3000);
    }
}

window.addToCart = function() {
    if (!currentProduct) return;

    const existingItem = cart.find(item => item.id === currentProduct.id);
    if (existingItem) {
        existingItem.qty = (existingItem.qty || 1) + 1;
        showNotification(`Quantidade de "${currentProduct.title}" aumentada!`);
    } else {
        cart.push({ ...currentProduct, qty: 1 });
        showNotification(`"${currentProduct.title}" adicionado ao carrinho!`);
    }
    updateCartUI();
};

window.buyNow = function() {
    window.addToCart();
    window.location.href = 'carrinho.html';
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    window.loadProduct();
});
