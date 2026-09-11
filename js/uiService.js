// ============================================
// MÓDULO: Servicio de Interfaz (uiService)
// Responsable de pintar los lugares en pantalla
// y mostrar mensajes (toast)
// ============================================

const listEl = document.getElementById("placesList");
const toastEl = document.getElementById("toast");

export function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 2500);
}

function escapeHtml(str = "") {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

export function renderPlaces(places, filter, handlers) {
  listEl.innerHTML = "";

  const filtered =
    filter === "todos" ? places : places.filter((p) => p.status === filter);

  if (filtered.length === 0) {
    listEl.innerHTML = `<p class="empty-msg">No hay lugares aquí todavía.</p>`;
    return;
  }

  filtered.forEach((place) => {
    const card = document.createElement("div");
    card.className = "place-card";

    const statusLabel = place.status === "visitado" ? "Ya fuimos" : "Pendiente";
    const hasImage = Boolean(place.image);

    card.className = `place-card ${hasImage ? "with-image" : "no-image"}`;

    const imageBlock = hasImage
      ? `<div class="place-image"><img src="${escapeHtml(place.image)}" alt="${escapeHtml(place.name)}" /></div>`
      : "";

    const heartIcon = `<svg viewBox="0 0 24 24" class="btn-icon" fill="${place.status === "visitado" ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.8"><path d="M12 20.5s-7.5-4.6-10-9.3C.3 7.8 2 4 5.6 4c2 0 3.6 1.1 4.4 2.7C10.8 5.1 12.4 4 14.4 4 18 4 19.7 7.8 18 11.2c-2.5 4.7-6 9.3-6 9.3z"/></svg>`;
    const trashIcon = `<svg viewBox="0 0 24 24" class="btn-icon" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const linkIcon = `<svg viewBox="0 0 24 24" class="meta-icon" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 15l6-6M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const dateIcon = `<svg viewBox="0 0 24 24" class="meta-icon" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M8 3v4M16 3v4" stroke-linecap="round"/></svg>`;

    card.innerHTML = `
      ${imageBlock}
      <div class="place-body">
        <div class="place-header">
          <h3>${escapeHtml(place.name)}</h3>
          <span class="badge ${place.status}">${statusLabel}</span>
        </div>
        ${place.link ? `<div class="place-meta">${linkIcon}<a href="${escapeHtml(place.link)}" target="_blank" rel="noopener">${escapeHtml(place.link)}</a></div>` : ""}
        ${place.date ? `<div class="place-meta">${dateIcon}<span>${escapeHtml(place.date)}</span></div>` : ""}
        ${place.addedBy ? `<div class="place-meta">Agregado por ${escapeHtml(place.addedBy)}</div>` : ""}
        ${place.review ? `<div class="place-review">${escapeHtml(place.review)}</div>` : ""}
        <div class="place-actions">
          <button data-action="toggle">${heartIcon}${place.status === "visitado" ? "Marcar pendiente" : "Marcar como visitado"}</button>
          <button data-action="delete" class="danger">${trashIcon}Eliminar</button>
        </div>
      </div>
    `;

    card.querySelector('[data-action="toggle"]').addEventListener("click", () => {
      handlers.onToggle(place);
    });
    card.querySelector('[data-action="delete"]').addEventListener("click", () => {
      handlers.onDelete(place.id, place.name);
    });

    listEl.appendChild(card);
  });
}
