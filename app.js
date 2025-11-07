/*
app.js (module) - handles Firebase Auth, Storage, Firestore, upload, views, likes, comments, follow
Replace firebaseConfig with your project's config
*/


import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL, listAll } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, query, where, getDocs, orderBy, serverTimestamp, updateDoc, increment, writeBatch } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';


// ====== CONFIG: Paste your Firebase config here ======
const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_PROJECT.firebaseapp.com",
projectId: "YOUR_PROJECT",
storageBucket: "YOUR_PROJECT.appspot.com",
messagingSenderId: "YOUR_SENDER_ID",
appId: "YOUR_APP_ID"
};
// =====================================================


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const db = getFirestore(app);


// UI refs
