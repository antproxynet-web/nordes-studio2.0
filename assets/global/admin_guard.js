
(function adminGuard() {
    const user = JSON.parse(localStorage.getItem('nordes_user'));
    
    if (!user || user.role !== 'admin') {
        console.error("Acesso negado: Usuário não é administrador.");
        // Redirecionar para login ou erro
        window.location.href = '../login.html?error=unauthorized';
    }
})();
