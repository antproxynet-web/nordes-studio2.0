/**
 * Página Home - Lógica específica
 * Versão refatorada com arquitetura modular
 */

// Processar login do Google imediatamente
const googleUser = AuthService.handleGoogleLogin();

document.addEventListener('DOMContentLoaded', () => {
    // Atualizar UI de autenticação
    AuthService.updateAuthUI();
    
    // Atualizar contador do carrinho
    CartService.updateCartUI();
    
    // Mostrar notificação de boas-vindas se acabou de logar
    if (googleUser) {
        setTimeout(() => {
            NotificationService.success(`Bem-vindo, ${googleUser.name}!`);
        }, 500);
    }
    
    // Inicializar componentes da página
    initializeBanners();
    initializeCategoriesDropdown();
    initializeCookieBanner();
    initializeSearch();
    initializeProducts();
    initializeSecretAccess();
});

/**
 * Inicializa os banners do Swiper
 */
function initializeBanners() {
    const bannerWrapper = document.getElementById('banner-wrapper');
    if (!bannerWrapper) return;
    
    const bannerConfigs = [
        { 
            title: "Nordes Studio — A ideia nasce aqui", 
            btn: "Saiba Mais", 
            img: "banner1.jpg", 
            link: "categorias.html" 
        },
        { 
            title: "Semana do Mangá: 40% OFF", 
            btn: "Ver Promoções", 
            img: "banner2.webp", 
            link: "categorias.html?cat=manga" 
        },
        { 
            title: "Novidades em Fantasia", 
            btn: "Confira", 
            img: "banner3.jpeg", 
            link: "categorias.html?cat=fantasia" 
        }
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
    
    // Inicializar Swiper
    new Swiper('.hero-swiper', {
        loop: true,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true }
    });
}

/**
 * Inicializa o dropdown de categorias
 */
function initializeCategoriesDropdown() {
    const btnCategories = document.getElementById('btn-categories');
    const dropdown = document.getElementById('categories-dropdown');
    
    if (!btnCategories || !dropdown) return;
    
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

/**
 * Inicializa o banner de cookies
 */
function initializeCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');
    
    if (!cookieBanner) return;
    
    const checkCookies = () => {
        const accepted = localStorage.getItem(CONFIG.STORAGE_KEYS.COOKIES_ACCEPTED);
        const declinedUntil = localStorage.getItem(CONFIG.STORAGE_KEYS.COOKIES_DECLINED);
        const now = new Date().getTime();
        
        if (accepted === 'true') return;
        if (declinedUntil && now < parseInt(declinedUntil)) return;
        
        setTimeout(() => cookieBanner.classList.add('active'), CONFIG.COOKIE_BANNER_DELAY);
    };
    
    acceptBtn.addEventListener('click', () => {
        cookieBanner.classList.remove('active');
        localStorage.setItem(CONFIG.STORAGE_KEYS.COOKIES_ACCEPTED, 'true');
    });
    
    declineBtn.addEventListener('click', () => {
        cookieBanner.classList.remove('active');
        const expiry = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem(CONFIG.STORAGE_KEYS.COOKIES_DECLINED, expiry.toString());
    });
    
    checkCookies();
}

/**
 * Inicializa a busca em tempo real
 */
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.book-card');
        
        cards.forEach(card => {
            const title = card.querySelector('h3')?.innerText.toLowerCase() || '';
            const author = card.querySelector('.book-author')?.innerText.toLowerCase() || '';
            
            if (title.includes(term) || author.includes(term)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

/**
 * Inicializa e carrega os produtos
 */
async function initializeProducts() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    try {
        // Buscar todos os livros
        const booksData = await BooksAPI.fetchAll();
        
        if (!booksData || booksData.length === 0) {
            mainContent.innerHTML = '<p style="text-align:center; padding: 2rem;">Nenhum produto cadastrado no momento.</p>';
            return;
        }
        
        console.log(`✅ ${booksData.length} livros carregados com sucesso`);
        
        // Definir seções
        const sections = [
            { title: "Mais Vendidos", type: "livro" },
            { title: "Mangás em Destaque", type: "manga" },
            { title: "Lançamentos", type: "livro" }
        ];
        
        // Criar cada seção
        sections.forEach((sec, secIdx) => {
            const sectionHtml = `
                <section class="section-container">
                    <div class="section-header">
                        <h2 class="section-title">${sec.title}</h2>
                        <a href="categorias.html?cat=${sec.type}" 
                           style="color: var(--primary-accent); text-decoration: none; font-weight: 600; font-size: 0.9rem;">
                            Ver Tudo →
                        </a>
                    </div>
                    <div class="books-scroll" id="section-${secIdx}"></div>
                </section>
            `;
            mainContent.insertAdjacentHTML('beforeend', sectionHtml);
            
            const scrollContainer = document.getElementById(`section-${secIdx}`);
            
            // Filtrar livros para a seção
            const filteredBooks = booksData.filter(b => b.category === sec.type || sec.type === 'livro').slice(0, 8);
            const displayBooks = filteredBooks.length > 0 ? filteredBooks : booksData.slice(0, 8);
            
            // Criar cards usando o componente
            displayBooks.forEach((book) => {
                const cardHtml = BookCard.create(book);
                scrollContainer.insertAdjacentHTML('beforeend', cardHtml);
            });
        });
        
    } catch (err) {
        console.error("Erro ao carregar dados dos livros:", err);
        mainContent.innerHTML = '<p style="text-align:center; padding: 2rem;">Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    }
}

/**
 * Inicializa o acesso secreto ao admin
 */
function initializeSecretAccess() {
    let logoClicks = 0;
    let lastClickTime = 0;
    const secretLogo = document.getElementById('secret-logo');
    
    if (!secretLogo) return;
    
    secretLogo.addEventListener('click', (e) => {
        // Só permite se for admin
        if (!AuthService.isAdmin()) return;
        
        const now = new Date().getTime();
        
        // Reset se passou mais de 2 segundos
        if (now - lastClickTime > 2000) {
            logoClicks = 0;
        }
        
        logoClicks++;
        lastClickTime = now;
        
        // 5 cliques = abrir modal
        if (logoClicks === 5) {
            document.getElementById('secret-modal')?.classList.add('active');
            logoClicks = 0;
        }
    });
    
    // Lógica do PIN (mantida do código original)
    const pinInputs = document.querySelectorAll('.pin-input');
    const secretModal = document.getElementById('secret-modal');
    const closeSecret = document.getElementById('close-secret');
    const secretError = document.getElementById('secret-error');
    
    if (closeSecret) {
        closeSecret.addEventListener('click', () => {
            secretModal?.classList.remove('active');
            pinInputs.forEach(input => input.value = '');
            secretError?.classList.remove('active');
        });
    }
    
    pinInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < pinInputs.length - 1) {
                pinInputs[index + 1].focus();
            }
            
            if (index === pinInputs.length - 1 && e.target.value.length === 1) {
                const pin = Array.from(pinInputs).map(i => i.value).join('');
                if (pin === '232341') {
                    window.location.href = 'admin/central.html';
                } else {
                    secretError?.classList.add('active');
                    setTimeout(() => {
                        pinInputs.forEach(input => input.value = '');
                        pinInputs[0].focus();
                        secretError?.classList.remove('active');
                    }, 1500);
                }
            }
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                pinInputs[index - 1].focus();
            }
        });
    });
}

/**
 * Manipula clique no botão "Minha Conta"
 */
window.handleAccountClick = function(e) {
    e.preventDefault();
    
    if (AuthService.isAuthenticated()) {
        window.location.href = 'perfil.html';
    } else {
        window.location.href = 'login.html';
    }
};
