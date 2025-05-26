import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDcgFPUYPQ5ESwSB9RgwxpVpQu3IiF5Re4",
    authDomain: "vibeszz.firebaseapp.com",
    projectId: "vibeszz",
    storageBucket: "vibeszz.firebasestorage.app",
    messagingSenderId: "1095582085214",
    appId: "1:1095582085214:web:f05a5c81e0599172cf04cf",
    measurementId: "G-VL5RZ7RQ15"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
