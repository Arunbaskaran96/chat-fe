import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpVKc0DnEVuFqwx1yAL9G-hh2QzWxdf0s",
  authDomain: "estate-db-b53cb.firebaseapp.com",
  projectId: "estate-db-b53cb",
  storageBucket: "estate-db-b53cb.appspot.com",
  messagingSenderId: "258153019087",
  appId: "1:258153019087:web:903b7b8e5e88f382bee9ba",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
