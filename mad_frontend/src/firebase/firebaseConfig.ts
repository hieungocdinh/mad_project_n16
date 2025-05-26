import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // nếu dùng Firestore
import { getAuth } from 'firebase/auth'; // nếu dùng Auth
import { getStorage } from 'firebase/storage'; // nếu dùng Storage

const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // Khóa API dùng để xác thực các request từ ứng dụng tới Firebase
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com", // Tên miền xác thực cho Firebase Authentication
    projectId: "YOUR_PROJECT_ID", // ID của project Firebase
    storageBucket: "YOUR_PROJECT_ID.appspot.com", // Tên bucket dùng cho Firebase Storage
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // ID dùng cho dịch vụ Firebase Cloud Messaging
    appId: "YOUR_APP_ID", // ID ứng dụng, thường dùng để xác định ứng dụng trên nền tảng (Android/iOS/web)
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app); // Firestore
const auth = getAuth(app);     // Authentication
const storage = getStorage(app); // Storage

export { app, db, auth, storage };
