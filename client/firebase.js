// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_OAUTH_API_KEY,
  authDomain: "aviestate-49d4a.firebaseapp.com",
  projectId: "aviestate-49d4a",
  storageBucket: "aviestate-49d4a.appspot.com",
  messagingSenderId: "410857076561",
  appId: "1:410857076561:web:651604dd3fec7086d0c570"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);