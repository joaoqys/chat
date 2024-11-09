import { saveMessageToFirestore, listenToMessages } from './firebase.js';

const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const userTypeSelect = document.getElementById('userType');

// Conecta-se ao servidor WebSocket
const socket = new WebSocket('ws://localhost:3000');

// Função para exibir uma mensagem no chat
function displayMessage(message, className) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add(className);
  messageDiv.textContent = message;
  chatBox.appendChild(messageDiv);

  // Rola o chat para a última mensagem
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Função para enviar a mensagem
function sendMessage() {
  const messageText = messageInput.value.trim();
  const userType = userTypeSelect.value; // Obtém o tipo de usuário (Base 192 ou Ambulância)

  if (messageText) {
    // Inclui o tipo de usuário na mensagem
    const formattedMessage = `${userType.toUpperCase()}: ${messageText}`;
    socket.send(formattedMessage); // Envia a mensagem via WebSocket
    saveMessageToFirestore(formattedMessage);  // Salva a mensagem no Firestore
    displayMessage(formattedMessage, 'user-message');
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

// Escuta mensagens em tempo real do Firestore e exibe no chat
listenToMessages((messages) => {
  chatBox.innerHTML = ""; // Limpa o chat para evitar duplicação
  messages.forEach((msg) => displayMessage(msg.text, 'other-message'));
});
