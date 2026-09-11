// ============================================
// MÓDULO: Configuración de Firebase
// Pega aquí la config que te dio la consola de Firebase
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCf1q77Rk6gXSO5Tw3dpEg-TZhmYtaSC1c",
  authDomain: "dates-app-332f6.firebaseapp.com",
  projectId: "dates-app-332f6",
  storageBucket: "dates-app-332f6.firebasestorage.app",
  messagingSenderId: "1097991002394",
  appId: "1:1097991002394:web:66bafff0f92f81042cf4a3"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
