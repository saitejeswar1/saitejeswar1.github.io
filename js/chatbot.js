document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChatbot = document.getElementById('closeChatbot');
    const userInput = document.getElementById('userInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatbotMessages = document.getElementById('chatbotMessages');
    
    // Toggle chatbot window
    chatbotToggle.addEventListener('click', function() {
        chatbotWindow.classList.toggle('active');
    });
    
    // Close chatbot
    closeChatbot.addEventListener('click', function() {
        chatbotWindow.classList.remove('active');
    });
    
    // Send message on button click
    sendMessage.addEventListener('click', sendUserMessage);
    
    // Send message on Enter key
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });
    
    function sendUserMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, 'user');
        userInput.value = '';
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chatbot-message bot-message';
        typingIndicator.id = 'typingIndicator';
        typingIndicator.textContent = '...';
        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // Call Flask backend API
        fetch('http://127.0.0.1:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            // Remove typing indicator
            document.getElementById('typingIndicator').remove();
            
            // Add bot response
            addMessage(data.response, 'bot');
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('typingIndicator').remove();
            addMessage("Sorry, I'm having trouble connecting to the server. Please try again later.", 'bot');
        });
    }
    
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `chatbot-message ${sender}-message`;
        messageElement.textContent = text;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
});