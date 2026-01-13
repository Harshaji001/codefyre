import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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
