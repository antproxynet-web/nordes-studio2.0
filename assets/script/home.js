// Executar imediatamente para capturar o login antes de qualquer outra coisa
(function handleGoogleLogin() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login_success') === 'true') {
        const token = urlParams.get('token');
        const userJson = urlParams.get('user');
        
        if (token && userJson) {
            try {
                const userData = JSON.parse(decodeURIComponent(userJson));
                // ✅ CORREÇÃO: Usar auth guard para salvar autenticação
                if (window.authGuard) {
                    authGuard.setAuth(token, userData);
                } else {
                    localStorage.setItem('nordes_token', token);
                    localStorage.setItem('nordes_user', JSON.stringify(userData));
                }
                // Limpar a URL para não ficar com os dados expostos
                window.history.replaceState({}, document.title, window.location.pathname);
                console.log("Usuário logado com sucesso via Google:", userData.name);
            } catch (e) {
                console.error("Erro ao processar dados do usuário:", e);
            }
        }
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Chamar updateAuthUI logo no início do DOMContentLoaded
    if (typeof window.updateAuthUI === 'function') window.updateAuthUI();
    
    // Mostrar notificação se acabou de logar
    const user = authGuard.getCurrentUser();
    const justLoggedIn = new URLSearchParams(window.location.search).get('login_success') === 'true';
    if (user && justLoggedIn) {
        setTimeout(() => showNotification(`Bem-vindo, ${user.name}!`), 500);
    }

    // ===== ESTADO GLOBAL (CARRINHO) =====
    let cart = JSON.parse(localStorage.getItem('nordes_cart')) || [];

    function updateCartUI() {
        const counter = document.querySelector('#cart-counter span');
        const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        if (counter) counter.innerText = `Carrinho (${totalItems})`;
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

    // ===== BANNERS DINÂMICOS =====
    const bannerWrapper = document.getElementById('banner-wrapper');
    if (bannerWrapper) {
        const bannerConfigs = [
            { title: "Nordes Studio — A ideia nasce aqui", btn: "Saiba Mais", img: "banner1.jpg", link: "categorias.html" },
            { title: "Semana do Mangá: 40% OFF", btn: "Ver Promoções", img: "banner2.webp", link: "categorias.html?cat=manga" },
            { title: "Novidades em Fantasia", btn: "Confira", img: "banner3.jpeg", link: "categorias.html?cat=fantasia" }
        ];

        bannerConfigs.forEach((config) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <a href="${config.link}" class="banner-link">
                    <img src="../assets/images/banners/${config.img}" alt="${config.title}">
                </a>
                <div class="slide-content">
                    <h2>${config.title}</h2>
                    <a href="${config.link}" class="btn-slide">${config.btn}</a>
                </div>
            `;
            bannerWrapper.appendChild(slide);
        });

        const swiper = new Swiper('.hero-swiper', {
            loop: true,
            effect: 'fade',
            fadeEffect: { crossFade: true },
            autoplay: { delay: 5000, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true }
        });
    }

    // ===== CATEGORIAS DROPDOWN =====
    const btnCategories = document.getElementById('btn-categories');
    const dropdown = document.getElementById('categories-dropdown');

    if (btnCategories && dropdown) {
        btnCategories.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!btnCategories.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

    // ===== COOKIE BANNER =====
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

    if (cookieBanner) {
        const checkCookies = () => {
            const accepted = localStorage.getItem('cookiesAccepted');
            const declinedUntil = localStorage.getItem('cookiesDeclinedUntil');
            const now = new Date().getTime();
            if (accepted === 'true') return;
            if (declinedUntil && now < parseInt(declinedUntil)) return;
            setTimeout(() => cookieBanner.classList.add('active'), 1000);
        };

        acceptBtn.addEventListener('click', () => {
            cookieBanner.classList.remove('active');
            localStorage.setItem('cookiesAccepted', 'true');
        });

        declineBtn.addEventListener('click', () => {
            cookieBanner.classList.remove('active');
            const expiry = new Date().getTime() + (24 * 60 * 60 * 1000);
            localStorage.setItem('cookiesDeclinedUntil', expiry.toString());
        });

        checkCookies();
    }

    // ===== BUSCA EM TEMPO REAL =====
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.book-card');
            cards.forEach(card => {
                const title = card.querySelector('h3').innerText.toLowerCase();
                const author = card.querySelector('.book-author').innerText.toLowerCase();
                if (title.includes(term) || author.includes(term)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // ===== CARREGAMENTO DE PRODUTOS =====
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        // ✅ CORREÇÃO: Caminho correto do JSON relativo à página home.html
        const DATA_URL = '../assets/script/books_data.json';
        // ✅ CORREÇÃO: Usar caminho relativo para uploads se possível, ou manter dinâmico
        const UPLOADS_URL = '/uploads/';

        fetch(DATA_URL)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao carregar dados');
                return response.json();
            })
            .then(booksData => {
                if (!booksData || booksData.length === 0) {
                    mainContent.innerHTML = '<p style="text-align:center; padding: 2rem;">Nenhum produto cadastrado no momento.</p>';
                    return;
                }

                const sections = [
                    { title: "Mais Vendidos", type: "Fantasia" },
                    { title: "Mangás em Destaque", type: "Mangás" },
                    { title: "Lançamentos", type: "Aventura" }
                ];

                sections.forEach((sec, secIdx) => {
                    const sectionHtml = `
                        <section class="section-container">
                            <div class="section-header">
                                <h2 class="section-title">${sec.title}</h2>
                                <a href="categorias.html?cat=${sec.type}" style="color: var(--primary-accent); text-decoration: none; font-weight: 600; font-size: 0.9rem;">Ver Tudo →</a>
                            </div>
                            <div class="books-scroll" id="section-${secIdx}"></div>
                        </section>
                    `;
                    mainContent.insertAdjacentHTML('beforeend', sectionHtml);
                    const scrollContainer = document.getElementById(`section-${secIdx}`);
                    
                    const filteredBooks = booksData.filter(b => b.categoria === sec.type).slice(0, 8);
                    const displayBooks = filteredBooks.length > 0 ? filteredBooks : booksData.slice(0, 8);

                    displayBooks.forEach((book) => {
                        const id = book.id;
                        // ✅ CORREÇÃO: Lógica de imagem mais robusta
                        let imgPath = book.imagem;
                        if (!imgPath.startsWith('http')) {
                            const fileName = imgPath.split('/').pop();
                            imgPath = UPLOADS_URL + fileName;
                        }
                        
                        const price = book.preco.toFixed(2);
                        const title = book.titulo;
                        const author = book.autor;
                        
                        const cardHtml = `
                            <div class="book-card" onclick="window.location.href='produto.html?id=${id}'" style="cursor: pointer;">
                                <div class="book-cover-wrapper">
                                    <img src="${imgPath}" alt="${title}" class="book-cover" loading="lazy" onerror="this.src='https://via.placeholder.com/200x300?text=Sem+Imagem'">
                                </div>
                                <div class="book-info">
                                    <h3>${title}</h3>
                                    <p class="book-author">${author}</p>
                                </div>
                                <div class="book-footer">
                                    <p class="book-price">R$ ${price.replace('.', ',')}</p>
                                    <button class="btn-slide" style="width: 100%; padding: 0.6rem; font-size: 0.8rem;" onclick="event.stopPropagation(); addToCart('${id}', '${title}', ${price}, '${imgPath}')">Adicionar</button>
                                </div>
                            </div>
                        `;
                        scrollContainer.insertAdjacentHTML('beforeend', cardHtml);
                    });
                });
            })
            .catch(err => {
                console.error("Erro ao carregar dados dos livros:", err);
                mainContent.innerHTML = '<p style="text-align:center; padding: 2rem;">Erro ao carregar produtos. Tente novamente mais tarde.</p>';
            });
    }

    // Funções de Ação
    window.addToCart = function(id, title, price, imgPath) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.qty = (existingItem.qty || 1) + 1;
            showNotification(`Quantidade de "${title}" aumentada!`);
        } else {
            cart.push({ id, title, price, imgPath, qty: 1 });
            showNotification(`"${title}" adicionado ao carrinho!`);
        }
        updateCartUI();
    };

    // ===== LÓGICA DO BOTÃO MINHA CONTA =====
    window.handleAccountClick = function(e) {
        e.preventDefault();
        if (authGuard.isAuthenticated()) {
            window.location.href = 'perfil.html';
        } else {
            window.location.href = 'login.html';
        }
    };

    // ===== ACESSO SECRETO ADM (5 CLIQUES NA LOGO) =====
    let logoClicks = 0;
    let lastClickTime = 0;
    const secretLogo = document.getElementById('secret-logo');
    
    if (secretLogo) {
        secretLogo.addEventListener('click', (e) => {
            const user = JSON.parse(localStorage.getItem('nordes_user'));
            // Só permite se for o e-mail do ADM mestre
            if (!user || user.email !== 'ant.proxy.net@gmail.com') return;

            const now = new Date().getTime();
            if (now - lastClickTime > 2000) logoClicks = 0; // Reset se demorar mais de 2s
            
            logoClicks++;
            lastClickTime = now;
            
            if (logoClicks === 5) {
                e.preventDefault();
                logoClicks = 0;
                const modal = document.getElementById('secret-modal');
                if (modal) modal.classList.add('active');
            }
        });
    }

    // Lógica do Modal Secreto
    const pinInputs = document.querySelectorAll('.pin-input');
    const secretError = document.getElementById('secret-error');
    const closeSecret = document.getElementById('close-secret');

    if (closeSecret) {
        closeSecret.addEventListener('click', () => {
            document.getElementById('secret-modal').classList.remove('active');
            pinInputs.forEach(input => input.value = '');
            if (secretError) secretError.classList.remove('active');
        });
    }

    pinInputs.forEach((input, index) => {
        input.addEventListener('input', async (e) => {
            if (e.target.value && index < pinInputs.length - 1) {
                pinInputs[index + 1].focus();
            }
            
            const pin = Array.from(pinInputs).map(i => i.value).join('');
            if (pin.length === 6) {
                try {
                    const res = await fetch('/api/auth/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ password: pin })
                    });
                    
                    if (res.ok) {
                        window.location.href = 'admin/control.html';
                    } else {
                        if (secretError) secretError.classList.add('active');
                        pinInputs.forEach(i => i.value = '');
                        pinInputs[0].focus();
                    }
                } catch (err) {
                    console.error("Erro ao verificar PIN:", err);
                }
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                pinInputs[index - 1].focus();
            }
        });
    });

    updateCartUI();
    updateAuthUI();
});

// Tornar global para ser acessível pelo script de captura imediata
window.updateAuthUI = function() {
    // ✅ CORREÇÃO: Usar authGuard para obter usuário
    const user = window.authGuard ? authGuard.getCurrentUser() : JSON.parse(localStorage.getItem('nordes_user'));
    const accountLink = document.querySelector('a[onclick="handleAccountClick(event)"]');
    
    if (user && accountLink) {
        const firstName = user.name ? user.name.split(' ')[0] : 'Conta';
        
        if (user.picture) {
            // ✅ CORREÇÃO: Usar normalização de URL
            const pictureUrl = window.authGuard ? authGuard.normalizePictureUrl(user.picture) : user.picture;
            
            accountLink.innerHTML = `
                <div class="user-avatar-nav" style="width: 30px; height: 30px; border-radius: 50%; overflow: hidden; border: 2px solid var(--primary-accent); display: inline-block; vertical-align: middle; margin-right: 8px;">
                    <img src="${pictureUrl}" alt="${user.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <span>${firstName}</span>
            `;
        } else {
            const textSpan = accountLink.querySelector('span');
            if (textSpan) textSpan.innerText = firstName;
        }
    }
};
