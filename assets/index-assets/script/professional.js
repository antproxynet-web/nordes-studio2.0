// ===================================
// NORDES STUDIO - JAVASCRIPT PROFISSIONAL
// Animações e Interatividade
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== HEADER SCROLL EFFECT =====
    const header = document.querySelector('.header-professional');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ===== HERO IMAGE SLIDER =====
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Trocar slide a cada 5 segundos
    if (slides.length > 1) {
        setInterval(nextSlide, 5000);
    }
    
    // ===== SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar cards e elementos
    const animatedElements = document.querySelectorAll(
        '.feature-card, .book-card-pro, .testimonial-card'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ===== MOBILE MENU TOGGLE =====
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // ===== QUICK VIEW BUTTONS =====
    const quickViewButtons = document.querySelectorAll('.btn-quick-view');
    
    quickViewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.book-card-pro');
            const title = card.querySelector('.book-title').textContent;
            
            // Aqui você pode adicionar um modal ou outra funcionalidade
            console.log('Visualização rápida:', title);
            
            // Exemplo de feedback visual
            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Visualizado';
            
            setTimeout(() => {
                btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Visualizar';
            }, 2000);
        });
    });
    
    // ===== ADD TO CART BUTTONS =====
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.book-card-pro');
            const title = card.querySelector('.book-title').textContent;
            
            // Feedback visual
            btn.style.transform = 'scale(1.2) rotate(360deg)';
            
            setTimeout(() => {
                btn.style.transform = '';
            }, 500);
            
            // Aqui você pode adicionar lógica de carrinho
            console.log('Adicionado ao carrinho:', title);
        });
    });
    
    // ===== NEWSLETTER FORM =====
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            // Aqui você pode adicionar lógica de envio
            console.log('Newsletter inscrito:', email);
            
            // Feedback visual
            const button = newsletterForm.querySelector('button');
            const originalHTML = button.innerHTML;
            
            button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            button.style.background = '#00ff88';
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = '';
                newsletterForm.reset();
            }, 2000);
        });
    }
    
    // ===== PARALLAX EFFECT =====
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-background');
        
        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // ===== CURSOR GLOW EFFECT (opcional) =====
    const cards = document.querySelectorAll('.feature-card, .book-card-pro, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
    
    // ===== LAZY LOADING IMAGES =====
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // ===== STATS COUNTER ANIMATION =====
    const stats = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = element.textContent;
        const isNumber = /^\d+/.test(target);
        
        if (!isNumber) return;
        
        const number = parseInt(target.match(/\d+/)[0]);
        const suffix = target.replace(/\d+/, '');
        const duration = 2000;
        const increment = number / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                element.textContent = number + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 16);
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => statsObserver.observe(stat));
    
    // ===== CAPTURAR LOGIN DO GOOGLE (URL PARAMS) =====
    (function handleGoogleLogin() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('login_success') === 'true') {
        const name = urlParams.get('name');
        const email = urlParams.get('email');
        const picture = urlParams.get('picture');
        const token = urlParams.get('token');
        const role = urlParams.get('role');
        
        if (name && email && token) {
            const userData = {
                name: decodeURIComponent(name),
                email: decodeURIComponent(email),
                picture: picture ? decodeURIComponent(picture) : null,
                token: token,
                role: role || 'user',
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('nordes_user', JSON.stringify(userData));
                // Limpar a URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    })();

    // ===== DETECTAR LOGIN E ATUALIZAR UI =====
    function updateAuthUI() {
        const user = JSON.parse(localStorage.getItem('nordes_user'));
        const navActions = document.querySelector('.nav-actions');
        
        // Restrição extra: apenas o e-mail específico pode ver o perfil como ADM
        const isAdmin = user && user.email === 'ant.proxy.net@gmail.com';

        if (user && navActions) {
            // Se o usuário estiver logado, trocar os botões de Login/Começar Agora pelo perfil
            navActions.innerHTML = `
                <a href="pages/perfil.html" class="user-profile-nav" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: #fff; font-weight: 600; background: rgba(255,255,255,0.1); padding: 5px 15px; border-radius: 50px; border: 1px solid rgba(0, 212, 255, 0.3);">
                    <div class="user-avatar-nav" style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden; border: 2px solid #00d4ff;">
                        ${user.picture ? `<img src="${user.picture}" alt="${user.name}" style="width: 100%; height: 100%; object-fit: cover;">` : `<div style="width: 100%; height: 100%; background: #00d4ff; display: flex; align-items: center; justify-content: center; font-size: 14px;">${user.name[0]}</div>`}
                    </div>
                    <span>${user.name.split(' ')[0]}</span>
                </a>
            `;
        }
    }

    updateAuthUI();

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
            if (now - lastClickTime > 2000) logoClicks = 0;
            
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
                        window.location.href = 'pages/admin/control.html';
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

    // ===== CONSOLE MESSAGE =====
    console.log('%c🚀 Nordes Studio - Website Profissional', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
    console.log('%cDesenvolvido com tecnologias modernas', 'color: #00ff88; font-size: 14px;');
});
