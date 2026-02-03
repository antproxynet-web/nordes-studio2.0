/**
 * Serviço de Notificações
 * Gerencia notificações toast na UI
 */

const NotificationService = {
    /**
     * Mostra uma notificação
     * @param {string} text - Texto da notificação
     * @param {string} type - Tipo (success, error, info, warning)
     * @param {number} duration - Duração em ms
     */
    show(text, type = 'info', duration = CONFIG.NOTIFICATION_DURATION) {
        const notif = document.getElementById('notification');
        
        if (!notif) {
            console.warn('Elemento de notificação não encontrado');
            return;
        }
        
        // Limpar classes anteriores
        notif.className = 'notification';
        
        // Adicionar classe de tipo
        if (type) {
            notif.classList.add(`notification-${type}`);
        }
        
        // Definir texto
        notif.innerText = text;
        
        // Mostrar
        notif.classList.add('active');
        
        // Ocultar após duração
        setTimeout(() => {
            notif.classList.remove('active');
        }, duration);
    },
    
    /**
     * Mostra notificação de sucesso
     * @param {string} text - Texto da notificação
     */
    success(text) {
        this.show(text, 'success');
    },
    
    /**
     * Mostra notificação de erro
     * @param {string} text - Texto da notificação
     */
    error(text) {
        this.show(text, 'error');
    },
    
    /**
     * Mostra notificação de informação
     * @param {string} text - Texto da notificação
     */
    info(text) {
        this.show(text, 'info');
    },
    
    /**
     * Mostra notificação de aviso
     * @param {string} text - Texto da notificação
     */
    warning(text) {
        this.show(text, 'warning');
    }
};
