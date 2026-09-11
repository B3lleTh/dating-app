// ============================================
// MÓDULO: Servicio de Modal (modalService)
// Modal de confirmación genérico para reemplazar confirm() nativo
// ============================================

const overlay = document.getElementById("confirmModal");
const titleEl = document.getElementById("confirmTitle");
const messageEl = document.getElementById("confirmMessage");
const cancelBtn = document.getElementById("confirmCancel");
const acceptBtn = document.getElementById("confirmAccept");

let pendingResolve = null;

function close(result) {
  overlay.classList.remove("show");
  setTimeout(() => overlay.classList.add("hidden"), 150);
  if (pendingResolve) {
    pendingResolve(result);
    pendingResolve = null;
  }
}

cancelBtn.addEventListener("click", () => close(false));
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) close(false);
});

export function confirmModal({ title = "¿Estás seguro?", message = "", acceptLabel = "Confirmar" } = {}) {
  titleEl.textContent = title;
  messageEl.textContent = message;
  acceptBtn.textContent = acceptLabel;

  overlay.classList.remove("hidden");
  requestAnimationFrame(() => overlay.classList.add("show"));

  return new Promise((resolve) => {
    pendingResolve = resolve;
    acceptBtn.onclick = () => close(true);
  });
}
