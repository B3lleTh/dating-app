// ============================================
// MÓDULO: Servicio de Respaldo (backupService)
// Permite exportar todos los lugares a un archivo .json
// y volver a importarlos si algo sale mal
// ============================================
import { loadLocalCache } from "./dataService.js";
import { addPlace } from "./dataService.js";

export function exportBackup(places) {
  const dataStr = JSON.stringify(places, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  const fecha = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `respaldo-lugares-${fecha}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportFromCacheIfNeeded() {
  // Respaldo de emergencia usando lo último guardado en localStorage
  const cached = loadLocalCache();
  exportBackup(cached);
}

export async function importBackup(file) {
  const text = await file.text();
  const places = JSON.parse(text);

  if (!Array.isArray(places)) {
    throw new Error("El archivo no tiene el formato esperado (debe ser una lista).");
  }

  // Sube cada lugar del respaldo como un documento nuevo en Firestore
  let count = 0;
  for (const p of places) {
    const { id, createdAt, ...rest } = p; // no reusamos el id ni el timestamp viejo
    await addPlace(rest);
    count++;
  }
  return count;
}
