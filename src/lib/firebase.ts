import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, push, onValue, off, set, serverTimestamp, query, orderByChild, limitToLast } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBaoS91K-uPR1CUqM7oiTid25uNpIRCM34",
  authDomain: "harsh-152ab.firebaseapp.com",
  databaseURL: "https://harsh-152ab-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "harsh-152ab",
  storageBucket: "harsh-152ab.firebasestorage.app",
  messagingSenderId: "275286735876",
  appId: "1:275286735876:web:d288614e2e0e67712a4951",
  measurementId: "G-69P02W8K98"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const database = getDatabase(app);

// Firebase Realtime Database helpers
export const chatRef = ref(database, 'chats');

export const sendMessage = async (
  chatId: string,
  senderId: string,
  senderName: string,
  message: string
) => {
  const messagesRef = ref(database, `chats/${chatId}/messages`);
  await push(messagesRef, {
    senderId,
    senderName,
    message,
    timestamp: serverTimestamp(),
    read: false
  });
  
  // Update chat metadata
  const chatMetaRef = ref(database, `chats/${chatId}/metadata`);
  await set(chatMetaRef, {
    lastMessage: message,
    lastMessageTime: serverTimestamp(),
    lastSenderId: senderId
  });
};

export const subscribeToMessages = (
  chatId: string,
  callback: (messages: any[]) => void
) => {
  const messagesRef = query(
    ref(database, `chats/${chatId}/messages`),
    orderByChild('timestamp'),
    limitToLast(100)
  );
  
  onValue(messagesRef, (snapshot) => {
    const messages: any[] = [];
    snapshot.forEach((child) => {
      messages.push({
        id: child.key,
        ...child.val()
      });
    });
    callback(messages);
  });
  
  return () => off(messagesRef);
};

export const subscribeToChats = (
  userId: string,
  isAdmin: boolean,
  callback: (chats: any[]) => void
) => {
  const chatsRef = ref(database, 'chats');
  
  onValue(chatsRef, (snapshot) => {
    const chats: any[] = [];
    snapshot.forEach((child) => {
      const chatData = child.val();
      const participants = chatData.participants || {};
      
      // Admin sees all chats, users see only their own
      if (isAdmin || participants[userId]) {
        chats.push({
          id: child.key,
          ...chatData
        });
      }
    });
    
    // Sort by last message time
    chats.sort((a, b) => {
      const timeA = a.metadata?.lastMessageTime || 0;
      const timeB = b.metadata?.lastMessageTime || 0;
      return timeB - timeA;
    });
    
    callback(chats);
  });
  
  return () => off(chatsRef);
};

export const createChat = async (
  userId: string,
  userEmail: string,
  userName: string
) => {
  const newChatRef = push(ref(database, 'chats'));
  await set(newChatRef, {
    participants: {
      [userId]: true,
      admin: true
    },
    createdBy: userId,
    createdByEmail: userEmail,
    createdByName: userName,
    createdAt: serverTimestamp(),
    metadata: {
      lastMessage: '',
      lastMessageTime: serverTimestamp()
    }
  });
  return newChatRef.key;
};

export const markMessagesAsRead = async (chatId: string, userId: string) => {
  const messagesRef = ref(database, `chats/${chatId}/messages`);
  onValue(messagesRef, (snapshot) => {
    snapshot.forEach((child) => {
      const msg = child.val();
      if (msg.senderId !== userId && !msg.read) {
        set(ref(database, `chats/${chatId}/messages/${child.key}/read`), true);
      }
    });
  }, { onlyOnce: true });
};