
const API_URL = 'https://nordes.onrender.com/api';

// ===== PASSWORD STRENGTH INDICATOR =====
const newPasswordInput = document.getElementById('new-password');
const strengthBar = document.getElementById('strength-bar');
const passwordHint = document.getElementById('password-hint');

if (newPasswordInput) {
    newPasswordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        let strength = 0;
        
        if (password.length >= 6) strength += 25;
        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) strength += 25;
        
        strengthBar.style.width = strength + '%';
        
        let hint = '';
        if (strength < 25) hint = 'Muito fraca';
        else if (strength < 50) hint = 'Fraca';
        else if (strength < 75) hint = 'Média';
        else hint = 'Forte';
        
        passwordHint.textContent = hint;
    });
}

// ===== TOGGLE PASSWORD VISIBILITY =====
function togglePassword(button) {
    const input = button.parentElement.querySelector('input');
    const icon = button.querySelector('i');
    
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

// ===== PASSWORD FORM SUBMISSION =====
const passwordForm = document.getElementById('password-form');
if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const messageDiv = document.getElementById('form-message');

        if (newPassword !== confirmPassword) {
            messageDiv.textContent = 'As novas senhas não coincidem.';
            messageDiv.className = 'message error';
            return;
        }

        if (newPassword.length < 6) {
            messageDiv.textContent = 'A senha deve conter pelo menos 6 caracteres.';
            messageDiv.className = 'message error';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                messageDiv.textContent = 'Senha alterada com sucesso!';
                messageDiv.className = 'message success';
                passwordForm.reset();
                strengthBar.style.width = '0%';
                passwordHint.textContent = 'Mínimo 6 caracteres';
            } else {
                messageDiv.textContent = data.message || 'Erro ao alterar senha.';
                messageDiv.className = 'message error';
            }
        } catch (error) {
            messageDiv.textContent = 'Erro de conexão com o servidor.';
            messageDiv.className = 'message error';
        }
    });
}

// ===== EDIT PROFILE BUTTON =====
const editProfileBtn = document.querySelector('.btn-edit-profile');
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
        alert('Funcionalidade de edição de perfil em desenvolvimento!');
    });
}

// ===== DANGER ZONE BUTTONS =====
const dangerButtons = document.querySelectorAll('.btn-danger');
dangerButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.textContent.trim();
        if (confirm(`Tem certeza que deseja executar: ${action}?`)) {
            alert(`${action} executado com sucesso!`);
        }
    });
});

// ===== NOTIFICATION PREFERENCES =====
const notificationCheckboxes = document.querySelectorAll('.notification-item input');
notificationCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const label = checkbox.nextElementSibling;
        if (checkbox.checked) {
            console.log(`Notificação ativada: ${label.textContent}`);
        } else {
            console.log(`Notificação desativada: ${label.textContent}`);
        }
    });
});

// ===== QUICK ACTION LINKS =====
const quickActions = document.querySelectorAll('.quick-action');
quickActions.forEach(action => {
    action.addEventListener('mouseenter', () => {
        action.style.transform = 'translateY(-8px)';
    });
    action.addEventListener('mouseleave', () => {
        action.style.transform = 'translateY(0)';
    });
});

// ===== SETTINGS EDIT BUTTONS =====
const settingsButtons = document.querySelectorAll('.settings-item .btn-secondary');
settingsButtons.forEach(button => {
    button.addEventListener('click', () => {
        const settingName = button.previousElementSibling.querySelector('h3').textContent;
        alert(`Editar ${settingName} em desenvolvimento!`);
    });
});

// ===== SECURITY BUTTONS =====
const securityButtons = document.querySelectorAll('.security-item .btn-secondary');
securityButtons.forEach(button => {
    button.addEventListener('click', () => {
        const securityName = button.previousElementSibling.querySelector('h3').textContent;
        alert(`${securityName} em desenvolvimento!`);
    });
});

console.log('Central de Usuário carregada com sucesso!');
