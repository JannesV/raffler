import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase, ref } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBUlLipulelboJPCFnoP74a14jj95qt9Wo',
  authDomain: 'raffler-8fec1.firebaseapp.com',
  databaseURL:
    'https://raffler-8fec1-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'raffler-8fec1',
  storageBucket: 'raffler-8fec1.appspot.com',
  messagingSenderId: '963796426247',
  appId: '1:963796426247:web:815c166c597e60cf11d4a2'
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const db = getDatabase(firebaseApp);

export const auth = getAuth();

export const gamesRef = ref(db, '/games');

export const googleAuth = new GoogleAuthProvider();
