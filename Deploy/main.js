// Esconde a tela até carregar o tema
document.documentElement.style.visibility = 'hidden';
document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.style.visibility = '';

    feather.replace();

    // Tema
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark');
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        feather.replace();
    });

    // Chat ID persistente
    let chatId = localStorage.getItem('chatId');
    if (!chatId) {
        chatId = 'chat_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('chatId', chatId);
    }

    // Evento de envio do formulário
    document.getElementById('chat-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('message-input');
        const message = input.value.trim();

        if (message) {
            addMessage(message, 'user');
            input.value = '';
            showTypingIndicator();

            try {
                const response = await fetch('https://n8nexterno-n8n-webhook.77j4p8.easypanel.host/webhook/timesheets_ai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message, chatId })
                });
                const data = await response.json();
                removeTypingIndicator();
                addMessage(data.response || 'Ocorreu um erro ao processar sua solicitação.', 'ai');
            } catch (error) {
                removeTypingIndicator();
                addMessage('Erro de conexão com o servidor.', 'ai');
                console.error('Erro:', error);
            }
        }
    });
});

function addMessage(text, sender) {
    const container = document.getElementById('chat-container');

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender} p-3 px-4 w-fit rounded-2xl ${
  sender === 'user' ? 'ml-auto max-w-[60%]' : 'max-w-[85%]'
}`;
    
    const messageContent = `
        <div class="flex items-start space-x-2">
            <div class="flex-shrink-0 w-6 h-6 rounded-full ${sender === 'ai' ? 'bg-blue-100' : 'bg-blue-500'} flex items-center justify-center">
                <i data-feather="${sender === 'ai' ? 'bar-chart-2' : 'user'}" class="${sender === 'ai' ? 'text-blue-500' : 'text-white'} w-3 h-3"></i>
            </div>
            <div class="text-sm prose max-w-none">${text}</div>
        </div>
    `;

    messageDiv.innerHTML = messageContent;
    container.appendChild(messageDiv);
    feather.replace();
    container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
    const container = document.getElementById('chat-container');

    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai p-3 max-w-[85%] w-fit';
    typingDiv.id = 'typing-indicator';

    typingDiv.innerHTML = `
        <div class="flex items-start space-x-2">
            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <i data-feather="bar-chart-2" class="text-blue-500 w-3 h-3"></i>
            </div>
            <div class="typing-indicator flex space-x-1 items-center">
                <span class="animate-bounce" style="animation-delay: 0ms"></span>
                <span class="animate-bounce" style="animation-delay: 150ms"></span>
                <span class="animate-bounce" style="animation-delay: 300ms"></span>
            </div>
        </div>
    `;

    container.appendChild(typingDiv);
    feather.replace();
    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}