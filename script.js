// script.js
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Atualize o URL para o WebSocket do Render
const socket = new WebSocket('wss://api-chat-7lm4.onrender.com'); // Use 'wss://' para conexão segura

// Função para exibir uma mensagem no chat
function displayMessage(message, className) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add(className);
  messageDiv.textContent = message;
  chatBox.appendChild(messageDiv);

  // Rola o chat para a última mensagem
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Envia a mensagem para o servidor WebSocket
function sendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText) {
    socket.send(messageText);
    displayMessage(messageText, 'user-message');
    messageInput.value = '';
  }
}

// Recebe as mensagens do servidor WebSocket
socket.onmessage = function(event) {
  const message = event.data;
  displayMessage(message, 'other-message');
};

// Envia a mensagem ao pressionar Enter
messageInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

// Adiciona um evento de clique para o botão "Enviar"
sendButton.addEventListener('click', sendMessage);
