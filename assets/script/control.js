
const MANAGER = 'http://localhost:5001';
const MANAGER_KEY = 'nordes_manager_secret_key_9988';

// ===== NAVEGAÇÃO ENTRE SEÇÕES =====
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active de todos
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
        
        // Adiciona active ao clicado
        item.classList.add('active');
        const sectionId = item.dataset.section;
        document.getElementById(`${sectionId}-section`).classList.add('active');
        
        // Atualiza título
        const titles = {
            'dashboard': 'Dashboard',
            'servers': 'Gerenciamento de Servidores',
            'analytics': 'Análiticas Avançadas',
            'database': 'Banco de Dados',
            'users': 'Gerenciamento de Usuários',
            'settings': 'Configurações'
        };
        
        const subtitles = {
            'dashboard': 'Bem-vindo à central de controle',
            'servers': 'Visualize e controle todos os servidores',
            'analytics': 'Gráficos e relatórios detalhados',
            'database': 'Gerenciamento de dados e backups',
            'users': 'Controle de permissões e acesso',
            'settings': 'Personalize as configurações'
        };
        
        document.getElementById('page-title').innerText = titles[sectionId];
        document.getElementById('page-subtitle').innerText = subtitles[sectionId];
    });
});

// ===== VERIFICAÇÃO DE STATUS =====
async function checkAll() {
    try {
        const res = await fetch(`${MANAGER}/status`);
        const data = await res.json();
        const isOnline = data.status === 'online';
        
        updateStatus('back', isOnline);
        updateStatus('db', isOnline);
        updateBackendStatus(isOnline);
        
        document.getElementById('btn-start').disabled = isOnline;
        document.getElementById('btn-stop').disabled = !isOnline;
        document.getElementById('power-desc').innerText = isOnline ? 'Backend operando normalmente' : 'O servidor está desligado';
    } catch (e) {
        updateStatus('back', false);
        updateStatus('db', false);
        updateBackendStatus(false);
        document.getElementById('btn-start').disabled = false;
        document.getElementById('btn-stop').disabled = true;
    }

    // Check Frontend
    try {
        const res = await fetch(window.location.href, { method: 'HEAD' });
        updateStatus('front', res.ok);
    } catch (e) {
        updateStatus('front', false);
    }
}

function updateStatus(id, online) {
    const dot = document.getElementById(`dot-${id}`);
    if (dot) {
        dot.className = `status-dot ${online ? 'online' : 'offline'}`;
    }
}

function updateBackendStatus(isOnline) {
    const badge = document.querySelector('#backend-status');
    if (badge) {
        badge.innerText = isOnline ? 'ONLINE' : 'OFFLINE';
        badge.style.background = isOnline ? 'rgba(0, 217, 126, 0.15)' : 'rgba(255, 56, 96, 0.15)';
        badge.style.borderColor = isOnline ? '#00d97e' : '#ff3860';
        badge.style.color = isOnline ? '#00d97e' : '#ff3860';
    }
}

async function power(action) {
    const desc = document.getElementById('power-desc');
    desc.innerText = action === 'start' ? 'Iniciando processo...' : 'Encerrando processo...';
    try {
        await fetch(`${MANAGER}/${action}`, { 
            method: 'POST',
            headers: {
                'X-Manager-Key': MANAGER_KEY
            }
        });
        setTimeout(checkAll, 2000);
    } catch (e) {
        alert('Erro ao comunicar com o Gerenciador.');
        checkAll();
    }
}

// ===== INICIALIZAÇÃO =====
checkAll();
setInterval(checkAll, 5000);
