import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7t8kW9kJVjI3hcA4BpWoS9hsH14Ns0N8",
  authDomain: "lexigaurd.firebaseapp.com",
  projectId: "lexigaurd",
  storageBucket: "lexigaurd.firebasestorage.app",
  messagingSenderId: "183739131278",
  appId: "1:183739131278:web:2cf7605ffbf861c13870df",
  measurementId: "G-JRMK6EK3YD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
