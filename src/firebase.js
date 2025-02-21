// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDXajIMhiUoqIcXTtmNXCx1QUe5iX175vg",
    authDomain: "musical-instruments-e9cae.firebaseapp.com",
    projectId: "musical-instruments-e9cae",
    storageBucket: "musical-instruments-e9cae.firebasestorage.app",
    messagingSenderId: "695666871555",
    appId: "1:695666871555:web:a826ae9e70aae33d13ad36",
    measurementId: "G-GBD52SEQS5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider, signInWithPopup };