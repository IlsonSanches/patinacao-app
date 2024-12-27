import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBPjGUdpurUnANSIdRiLpfJAnm5y2doTJc",
  authDomain: "patinacao-app.firebaseapp.com",
  projectId: "patinacao-app",
  storageBucket: "patinacao-app.appspot.com",
  messagingSenderId: "165247492426",
  appId: "1:165247492426:web:1bfda61d8764a74defa1b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage }; 