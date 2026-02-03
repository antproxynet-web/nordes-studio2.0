// ===== TOGGLE AUTH MODE =====
function toggleAuthMode(e) {
    e.preventDefault();
    document.getElementById('login-section').classList.toggle('active');
    document.getElementById('signup-section').classList.toggle('active');
    clearErrors();
}

// ===== TOGGLE PASSWORD VISIBILITY =====
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const btn = input.nextElementSibling;
    const icon = btn.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ===== CLEAR ERRORS =====
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
        el.innerText = '';
        el.style.display = 'none';
    });
}

// ===== SHOW ERROR =====
function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.innerText = message;
        errorEl.classList.add('show');
        errorEl.style.display = 'block';
    }
}

// ===== VALIDATE EMAIL =====
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ===== VALIDATE USERNAME =====
function validateUsername(username) {
    const regex = /^[a-z0-9._]+$/;
    return regex.test(username);
}

// ===== TRATAMENTO DE ERROS MELHORADO =====
function handleApiError(error, response, defaultMessage) {
    /**
     * Trata erros de API de forma centralizada
     * @param {Error} error - Erro capturado no catch
     * @param {Response} response - Resposta HTTP (se disponível)
     * @param {string} defaultMessage - Mensagem padrão
     * @returns {string} Mensagem de erro apropriada
     */
    
    // Erro de rede (servidor offline, CORS, timeout)
    if (!response || error.message === 'Failed to fetch') {
        console.error('Erro de rede:', error);
        return 'Erro ao conectar com o servidor. Verifique se o backend está rodando.';
    }
    
    // Erro HTTP com resposta
    if (response) {
        switch (response.status) {
            case 400:
                return 'Dados inválidos. Verifique os campos e tente novamente.';
            case 401:
                return 'Credenciais inválidas. Verifique seu email e senha.';
            case 403:
                return 'Acesso negado. Você não tem permissão para esta ação.';
            case 404:
                return 'Recurso não encontrado.';
            case 500:
                return 'Erro no servidor. Tente novamente mais tarde.';
            default:
                return defaultMessage;
        }
    }
    
    return defaultMessage;
}

// ===== LOGIN FORM =====
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        let isValid = true;

        if (!validateEmail(email)) {
            showError('login-email-error', 'Email inválido');
            isValid = false;
        }

        if (password.length < 6) {
            showError('login-password-error', 'Senha deve ter pelo menos 6 caracteres');
            isValid = false;
        }

        if (!isValid) return;

        const btn = document.getElementById('login-btn');
        const originalText = btn.innerText;
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span>Entrando...';

        let response = null;
        try {
            response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                
                // Salvar token e dados do usuário
                if (typeof authGuard !== 'undefined') {
                    authGuard.setAuth(data.token, data.user);
                } else {
                    // Fallback se authGuard não estiver disponível
                    localStorage.setItem('nordes_token', data.token);
                    localStorage.setItem('nordes_user', JSON.stringify(data.user));
                }
                
                console.log('✓ Login realizado com sucesso');
                window.location.href = 'home.html';
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || handleApiError(null, response, 'Email ou senha incorretos');
                showError('login-email-error', errorMessage);
                btn.disabled = false;
                btn.innerText = originalText;
            }
        } catch (error) {
            console.error("Erro na requisição de login:", error);
            const errorMessage = handleApiError(error, response, 'Erro ao conectar com o servidor');
            showError('login-email-error', errorMessage);
            btn.disabled = false;
            btn.innerText = originalText;
        }
    });
}

// ===== SIGNUP FORM =====
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const firstname = document.getElementById('signup-firstname').value.trim();
        const lastname = document.getElementById('signup-lastname').value.trim();
        const username = document.getElementById('signup-username').value.trim().toLowerCase();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;

        let isValid = true;

        if (!firstname) { showError('signup-firstname-error', 'Nome é obrigatório'); isValid = false; }
        if (!lastname) { showError('signup-lastname-error', 'Sobrenome é obrigatório'); isValid = false; }
        
        if (!username) { 
            showError('signup-username-error', 'Username é obrigatório'); 
            isValid = false; 
        } else if (!validateUsername(username)) {
            showError('signup-username-error', 'Apenas letras minúsculas, números, . e _');
            isValid = false;
        }

        if (!validateEmail(email)) { showError('signup-email-error', 'Email inválido'); isValid = false; }
        if (password.length < 6) { showError('signup-password-error', 'Mínimo 6 caracteres'); isValid = false; }
        if (!document.getElementById('terms').checked) { alert('Você deve aceitar os termos'); isValid = false; }

        if (!isValid) return;

        const btn = document.getElementById('signup-btn');
        const originalText = btn.innerText;
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span>Criando conta...';

        let response = null;
        try {
            response = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    email, 
                    password, 
                    firstname, 
                    lastname, 
                    username 
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                // Salvar token e dados do usuário
                if (typeof authGuard !== 'undefined') {
                    authGuard.setAuth(data.token, data.user);
                } else {
                    // Fallback se authGuard não estiver disponível
                    localStorage.setItem('nordes_token', data.token);
                    localStorage.setItem('nordes_user', JSON.stringify(data.user));
                }
                
                alert('Conta criada com sucesso!');
                console.log('✓ Cadastro realizado com sucesso');
                window.location.href = 'home.html';
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || handleApiError(null, response, 'Erro ao criar conta');
                
                if (errorMessage.toLowerCase().includes('username')) {
                    showError('signup-username-error', errorMessage);
                } else {
                    showError('signup-email-error', errorMessage);
                }
                
                btn.disabled = false;
                btn.innerText = originalText;
            }
        } catch (error) {
            console.error('Erro ao processar cadastro:', error);
            const errorMessage = handleApiError(error, response, 'Erro ao processar cadastro');
            showError('signup-email-error', errorMessage);
            btn.disabled = false;
            btn.innerText = originalText;
        }
    });
}

// ===== SOCIAL LOGIN HANDLERS =====
const googleLoginBtn = document.getElementById('google-login');
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
        window.location.href = `http://localhost:5000/login/google`;
    });
}

const googleSignupBtn = document.getElementById('google-signup');
if (googleSignupBtn) {
    googleSignupBtn.addEventListener('click', () => {
        window.location.href = `http://localhost:5000/login/google`;
    });
}

// ===== CHECK IF USER IS LOGGED IN & HANDLE GOOGLE LOGIN =====
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // 1. Processar sucesso do Google OAuth
    if (urlParams.get('login_success') === 'true') {
        const token = urlParams.get('token');
        const userJson = urlParams.get('user');
        
        if (token && userJson) {
            try {
                const userData = JSON.parse(decodeURIComponent(userJson));
                console.log('✓ Login Google bem-sucedido:', userData.name);
                
                if (typeof authGuard !== 'undefined') {
                    authGuard.setAuth(token, userData);
                } else {
                    localStorage.setItem('nordes_token', token);
                    localStorage.setItem('nordes_user', userJson);
                }
                
                window.location.href = 'home.html';
                return;
            } catch (e) {
                console.error('Erro ao processar dados do Google:', e);
                showError('login-email-error', 'Erro ao processar dados do Google.');
            }
        }
    }

    // 2. Verificar se já está autenticado (se não for retorno do Google)
    if (typeof authGuard !== 'undefined' && authGuard.isAuthenticated() && window.location.pathname.includes('login.html')) {
        authGuard.redirectIfAuthenticated();
    }

    // 3. Verificar erros de OAuth na URL
    const error = urlParams.get('error');
    if (error === 'oauth_failed') {
        showError('login-email-error', 'Falha na autenticação com Google. Tente novamente.');
    }
});
