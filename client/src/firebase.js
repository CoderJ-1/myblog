// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernstack-9175d.firebaseapp.com",
  projectId: "mernstack-9175d",
  storageBucket: "mernstack-9175d.appspot.com",
  messagingSenderId: "82372406138",
  appId: "1:82372406138:web:2e3bd5352dfc4a825984c3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
