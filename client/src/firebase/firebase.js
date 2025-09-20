import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7t8kW9kJVjI3hcA4BpWoS9hsH14Ns0N8",
  authDomain: "lexigaurd.firebaseapp.com",
  projectId: "lexigaurd",
  storageBucket: "lexigaurd.firebasestorage.app",
  messagingSenderId: "183739131278",
  appId: "1:183739131278:web:2cf7605ffbf861c13870df",
  measurementId: "G-JRMK6EK3YD",
};

// Initialize Firebase with explicit config to prevent auto-detection
const app = initializeApp(firebaseConfig, "lexigaurd-app");

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Don't initialize analytics for now to avoid init.json issues
let analytics = null;

export { app, analytics, auth, db };
