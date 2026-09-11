// ============================================
// MÓDULO: Servicio de Datos (dataService)
// Responsable de leer/escribir lugares en Firestore
// y mantener una copia local (localStorage) como caché/respaldo
// ============================================
import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const COLLECTION_NAME = "places";
const LOCAL_CACHE_KEY = "dates_app_cache_v1";

const placesCol = collection(db, COLLECTION_NAME);

// --- Escucha en tiempo real (así ambos ven los cambios del otro al instante) ---
export function subscribeToPlaces(onUpdate) {
  const q = query(placesCol, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const places = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      saveLocalCache(places);
      onUpdate(places, null);
    },
    (error) => {
      console.error("Error leyendo Firestore, usando caché local:", error);
      onUpdate(loadLocalCache(), error);
    }
  );
}

export async function addPlace(place) {
  return addDoc(placesCol, {
    ...place,
    createdAt: serverTimestamp()
  });
}

export async function updatePlace(id, changes) {
  return updateDoc(doc(db, COLLECTION_NAME, id), changes);
}

export async function deletePlace(id) {
  return deleteDoc(doc(db, COLLECTION_NAME, id));
}

// --- Caché local (respaldo automático silencioso) ---
export function saveLocalCache(places) {
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(places));
  } catch (e) {
    console.warn("No se pudo guardar caché local:", e);
  }
}

export function loadLocalCache() {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
