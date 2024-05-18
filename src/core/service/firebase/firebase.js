// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

/// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD68DiPIEMcO0ERRzy395a5lZgySzLtmtk",
  authDomain: "practica-firebase-fd0d8.firebaseapp.com",
  projectId: "practica-firebase-fd0d8",
  storageBucket: "practica-firebase-fd0d8.appspot.com",
  messagingSenderId: "50130926412",
  appId: "1:50130926412:web:a12ed19e505b73659b2de9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireStoreDB = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage();

export { app, fireStoreDB, auth, storage };
