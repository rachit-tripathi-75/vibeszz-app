import firebase from 'firebase/compat/app';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
    apiKey: "AIzaSyDcgFPUYPQ5ESwSB9RgwxpVpQu3IiF5Re4",
    authDomain: "vibeszz.firebaseapp.com",
    projectId: "vibeszz",
    storageBucket: "vibeszz.firebasestorage.app",
    messagingSenderId: "1095582085214",
    appId: "1:1095582085214:web:f05a5c81e0599172cf04cf",
    measurementId: "G-VL5RZ7RQ15"
};


if (firebase.apps.length == 0) {
    firebase.initializeApp(firebaseConfig);
}

const db = getDatabase();
export { db };
