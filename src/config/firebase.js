import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
const firebaseConfig = {
  apiKey: "AIzaSyD2s7rNtUqV52VQfU5w-6_vZbtZErrmTXg",
  authDomain: "cropcare-cc083.firebaseapp.com",
  projectId: "cropcare-cc083",
  storageBucket: "cropcare-cc083.appspot.com",
  messagingSenderId: "275502196304",
  appId: "1:275502196304:web:15217eac532fe99e50d355",
  measurementId: "G-3HPPV6NW3Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const st = getStorage(app);
