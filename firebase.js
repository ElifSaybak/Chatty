import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
  } from 'firebase/auth';
  import {getFirestore} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBYRFH61vv7mEPj878ts5eyN2q8Ae2BRrY",
  authDomain: "chatty-47188.firebaseapp.com",
  projectId: "chatty-47188",
  storageBucket: "chatty-47188.appspot.com",
  messagingSenderId: "525559141357",
  appId: "1:525559141357:web:e92c2614dd7c0dfcfd0de4"
};

initializeApp(firebaseConfig);

const auth = getAuth();
const firesore = getFirestore();

const createUserEmailPass = (email,password) => {
  return (
    createUserWithEmailAndPassword(auth,email,password)
    
  );
}

const signinUserEmailPass = (email,password) => {
  return (
    signInWithEmailAndPassword(auth,email,password)
    
  );
}

export {auth, firesore, createUserEmailPass,signinUserEmailPass} ;