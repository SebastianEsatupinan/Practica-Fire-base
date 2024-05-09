// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKhSshByqqtS2xs91uoSiaIuAr1hTjEGY",
  authDomain: "react-firebase-211e3.firebaseapp.com",
  projectId: "react-firebase-211e3",
  storageBucket: "react-firebase-211e3.appspot.com",
  messagingSenderId: "316307753292",
  appId: "1:316307753292:web:98da3d917b03deccdea7e9",
  measurementId: "G-ZJ7RVVP9HV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireStoreDB = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage();

export { app, fireStoreDB, auth, storage };
