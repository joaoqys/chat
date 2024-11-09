
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuj_EX2dxZ7DLz_SpmzunXQIRTH4yApQQ",
  authDomain: "samu-2dec0.firebaseapp.com",
  projectId: "samu-2dec0",
  storageBucket: "samu-2dec0.appspot.com",
  messagingSenderId: "738980294700",
  appId: "1:738980294700:web:57f12be66b46d13ae3e189"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesRef = collection(db, 'messages');

// Função para salvar a mensagem no Firestore
export async function saveMessageToFirestore(messageText) {
  try {
    await addDoc(messagesRef, {
      text: messageText,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Erro ao salvar mensagem no Firestore:", error);
  }
}

// Função para escutar as mensagens em tempo real
export function listenToMessages(callback) {
  const q = query(messagesRef, orderBy("timestamp"));
  onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      messages.push(doc.data());
    });
    callback(messages);
  });
}
