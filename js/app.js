// ============================================
// MÓDULO: app.js — v4 (tema gótico-girlie + SVGs)
// Orquesta los demás módulos: escucha eventos del DOM,
// llama a dataService para leer/escribir, y a uiService para pintar
// ============================================
console.log("app.js v4 cargado correctamente");
import { subscribeToPlaces, addPlace, updatePlace, deletePlace, loadLocalCache } from "./dataService.js";
import { renderPlaces, showToast } from "./uiService.js";
import { exportBackup, importBackup } from "./backupService.js";
import { confirmModal } from "./modalService.js";

let currentPlaces = [];
let currentFilter = "todos";

const form = document.getElementById("placeForm");
const userNameInput = document.getElementById("userName");
const filterBtns = document.querySelectorAll(".filter-btn");
const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importInput");
const backupStatus = document.getElementById("backupStatus");
const toggleBackupBtn = document.getElementById("toggleBackup");
const backupPanel = document.getElementById("backupPanel");

// Recordar quién eres entre sesiones
userNameInput.value = localStorage.getItem("dates_app_username") || "Gil";
userNameInput.addEventListener("change", () => {
  localStorage.setItem("dates_app_username", userNameInput.value);
});

// Panel de opciones avanzadas (respaldo) escondido por defecto
toggleBackupBtn.addEventListener("click", () => {
  backupPanel.classList.toggle("hidden");
});

function refresh() {
  renderPlaces(currentPlaces, currentFilter, {
    onToggle: async (place) => {
      const newStatus = place.status === "visitado" ? "pendiente" : "visitado";
      await updatePlace(place.id, { status: newStatus });
      showToast(newStatus === "visitado" ? "Marcado como visitado" : "Marcado como pendiente");
    },
    onDelete: async (id, name) => {
      const confirmed = await confirmModal({
        title: "¿Eliminar este lugar?",
        message: `"${name}" se va a eliminar para siempre. Esta acción no se puede deshacer.`,
        acceptLabel: "Eliminar"
      });
      if (!confirmed) return;
      await deletePlace(id);
      showToast("Lugar eliminado");
    }
  });
}

// --- Suscripción en tiempo real a Firestore ---
subscribeToPlaces((places, error) => {
  currentPlaces = places;
  if (error) {
    showToast("Sin conexión a Firebase, mostrando respaldo local");
  }
  refresh();
});

// --- Formulario para agregar lugar ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("placeName").value.trim();
  const image = document.getElementById("placeImage").value.trim();
  const link = document.getElementById("placeLink").value.trim();
  const status = document.getElementById("placeStatus").value;
  const date = document.getElementById("placeDate").value;
  const review = document.getElementById("placeReview").value.trim();
  const addedBy = userNameInput.value;

  if (!name) return;

  try {
    await addPlace({ name, image, link, status, date, review, addedBy });
    form.reset();
    showToast("Lugar agregado");
  } catch (err) {
    console.error(err);
    showToast("Error al guardar. Revisa tu conexión o config de Firebase.");
  }
});

// --- Filtros ---
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    refresh();
  });
});

// --- Respaldo: exportar ---
exportBtn.addEventListener("click", () => {
  const dataToExport = currentPlaces.length ? currentPlaces : loadLocalCache();
  exportBackup(dataToExport);
  backupStatus.textContent = "Respaldo descargado";
});

// --- Respaldo: importar ---
importInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    backupStatus.textContent = "Importando...";
    const count = await importBackup(file);
    backupStatus.textContent = `${count} lugares importados`;
    showToast(`Se importaron ${count} lugares`);
  } catch (err) {
    console.error(err);
    backupStatus.textContent = "Error al importar";
  }
  importInput.value = "";
});
