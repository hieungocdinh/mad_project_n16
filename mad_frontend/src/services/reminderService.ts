import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export const saveReminder = async (data: any) => {
    return await addDoc(collection(db, 'reminders'), data);
};

export const fetchReminders = async () => {
    const snapshot = await getDocs(collection(db, 'reminders'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};