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

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                authGuard.setAuth(data.token, data.user);
                window.location.href = 'home.html';
            } else {
                const errorData = await response.json();
                showError('login-email-error', errorData.message || 'Email ou senha incorretos');
                btn.disabled = false;
                btn.innerText = originalText;
            }
        } catch (error) {
            console.error("Erro na requisição de login:", error);
            showError('login-email-error', 'Erro ao conectar com o servidor.');
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

        try {
            const response = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
                authGuard.setAuth(data.token, data.user);
                alert('Conta criada com sucesso!');
                window.location.href = 'home.html';
            } else {
                const error = await response.json();
                if (error.message && error.message.toLowerCase().includes('username')) {
                    showError('signup-username-error', error.message);
                } else {
                    showError('signup-email-error', error.message || 'Erro ao criar conta');
                }
                btn.disabled = false;
                btn.innerText = originalText;
            }
        } catch (error) {
            console.error('Erro ao processar cadastro:', error);
            showError('signup-email-error', 'Erro ao processar cadastro');
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

// ===== CHECK IF USER IS LOGGED IN =====
window.addEventListener('load', () => {
    if (authGuard.isAuthenticated() && window.location.pathname.includes('login.html')) {
        authGuard.redirectIfAuthenticated();
    }

    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error === 'oauth_failed') {
        showError('login-email-error', 'Falha na autenticação com Google.');
    }
});
