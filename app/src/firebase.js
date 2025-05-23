import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from "firebase/auth";

// only for testing
const firebaseConfig = {
  apiKey: "AIzaSyBr2-fBqKLTkGJXxPwBDTrkg5c51TN6Ajg",
  authDomain: "crowdfund-3e448.firebaseapp.com",
  projectId: "crowdfund-3e448",
  storageBucket: "crowdfund-3e448.appspot.com", 
  messagingSenderId: "82976820931",
  appId: "1:82976820931:web:739b70a6d91ee1bfcd5c76",
  measurementId: "G-X01KHLHDRC",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/// adding auth users
const AUTHORIZED_USERS = [
  'sanjeevvarmacode@gmail.com',

];


export {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  AUTHORIZED_USERS
};
