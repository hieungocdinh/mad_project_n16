import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // nếu dùng Firestore
import { getAuth } from 'firebase/auth'; // nếu dùng Auth
import { getStorage } from 'firebase/storage'; // nếu dùng Storage

const firebaseConfig = {
    apiKey: "AIzaSyDtDQ_9Q5MN5PBV5CTpeUzhI8_hnY3zqsg",
    authDomain: "superb-avatar-451502-j8.firebaseapp.com",
    projectId: "superb-avatar-451502-j8",
    storageBucket: "superb-avatar-451502-j8.appspot.com",
    messagingSenderId: "1062344207995",
    appId: "1:1062344207995:android:c7974b0a8f4ee9f8307cde",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app); // Firestore
const auth = getAuth(app);     // Authentication
const storage = getStorage(app); // Storage

export { app, db, auth, storage };