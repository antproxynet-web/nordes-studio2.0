let cart = JSON.parse(localStorage.getItem('nordes_cart')) || [];
let selectedItems = [];

function renderCart() {
    selectedItems = cart.map((_, index) => index);
    const container = document.getElementById('cart-items');
    const main = document.getElementById('cart-main');

    if (cart.length === 0) {
        if (document.getElementById('cart-summary')) document.getElementById('cart-summary').style.display = 'none';
        if (main) {
            main.innerHTML = `
                <div class="empty-cart">
                    <p>Seu carrinho está vazio :(</p>
                    <a href="home.html" class="checkout-btn" style="display: inline-block; width: auto; padding: 1rem 3rem;">Ir para a Loja</a>
                </div>
            `;
        }
        return;
    }

    if (container) {
        container.innerHTML = '';
        cart.forEach((item, index) => {
            const itemTotal = item.price * (item.qty || 1);
            const imgPath = item.imgPath || `../assets/images/livro-1.jpg`;
            const isSelected = selectedItems.includes(index) ? 'checked' : '';

            const itemHtml = `
                <div class="cart-item" data-index="${index}">
                    <input type="checkbox" class="item-select-checkbox" data-index="${index}" ${isSelected}>
                    <div class="item-product-info">
                        <a href="produto.html?id=${item.id}">
                            <img src="${imgPath}" alt="${item.title}" class="item-img">
                        </a>
                        <div class="item-details">
                            <a href="produto.html?id=${item.id}" class="item-title">${item.title}</a>
                            <p class="item-author">Nordes Studio Edition</p>
                            <button class="remove-btn" onclick="removeItem(${index})">Remover</button>
                        </div>
                    </div>
                    <span class="item-price" style="text-align: center;">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                    <div class="quantity-controls" style="justify-self: center;">
                        <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                        <span class="qty-val">${item.qty || 1}</span>
                        <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                    </div>
                    <span class="item-subtotal" style="text-align: right;">R$ ${itemTotal.toFixed(2).replace('.', ',')}</span>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', itemHtml);
        });
        updateSummary();
        attachEventListeners();
    }
}

function updateSummary() {
    let subtotalVal = 0;
    selectedItems.forEach(index => {
        const item = cart[index];
        subtotalVal += item.price * (item.qty || 1);
    });

    if (document.getElementById('subtotal')) document.getElementById('subtotal').innerText = `R$ ${subtotalVal.toFixed(2).replace('.', ',')}`;
    if (document.getElementById('total')) document.getElementById('total').innerText = `R$ ${subtotalVal.toFixed(2).replace('.', ',')}`;

    const selectAll = document.getElementById('select-all-items');
    if (selectAll) {
        selectAll.checked = cart.length > 0 && selectedItems.length === cart.length;
    }
}

function attachEventListeners() {
    document.querySelectorAll('.item-select-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleItemSelection);
    });

    const selectAll = document.getElementById('select-all-items');
    if (selectAll) {
        selectAll.addEventListener('change', handleSelectAll);
    }
}

function handleItemSelection(event) {
    const index = parseInt(event.target.dataset.index);
    if (event.target.checked) {
        if (!selectedItems.includes(index)) selectedItems.push(index);
    } else {
        selectedItems = selectedItems.filter(i => i !== index);
    }
    updateSummary();
}

function handleSelectAll(event) {
    if (event.target.checked) {
        selectedItems = cart.map((_, index) => index);
    } else {
        selectedItems = [];
    }
    renderCart();
}

window.updateQty = function(index, delta) {
    if (!cart[index].qty) cart[index].qty = 1;
    cart[index].qty += delta;
    if (cart[index].qty < 1) cart[index].qty = 1;
    saveAndRender();
};

window.removeItem = function(index) {
    cart.splice(index, 1);
    selectedItems = selectedItems.filter(i => i !== index).map(i => (i > index ? i - 1 : i));
    saveAndRender();
};

function saveAndRender() {
    localStorage.setItem('nordes_cart', JSON.stringify(cart));
    renderCart();
}

window.checkout = function() {
    if (selectedItems.length === 0) {
        alert('Selecione pelo menos um item para finalizar a compra.');
        return;
    }
    
    const itemsToBuy = selectedItems.map(index => cart[index]);
    const total = itemsToBuy.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

    // Salvar itens selecionados para a página de pagamento
    localStorage.setItem('nordes_checkout_items', JSON.stringify(itemsToBuy));
    localStorage.setItem('nordes_checkout_total', total.toString());
    
    // Redirecionar para a página de pagamento real
    window.location.href = 'pagamento.html';
};

document.addEventListener('DOMContentLoaded', renderCart);
