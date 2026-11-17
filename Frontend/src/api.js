// Alle Aufrufe an das FastAPI-Backend an einer Stelle
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function anfrage(pfad, optionen = {}) {
  const antwort = await fetch(`${API_URL}${pfad}`, {
    headers: { "Content-Type": "application/json" },
    ...optionen,
  });

  if (!antwort.ok) {
    // FastAPI schickt Fehler als { detail: "..." } (oder eine Liste bei 422)
    let meldung = `Fehler ${antwort.status}`;
    try {
      const daten = await antwort.json();
      if (typeof daten.detail === "string") meldung = daten.detail;
      else if (Array.isArray(daten.detail)) meldung = daten.detail[0]?.msg ?? meldung;
    } catch {
      // Antwort war kein JSON – Standardmeldung behalten
    }
    throw new Error(meldung);
  }

  return antwort.json();
}

export function holeTodos() {
  return anfrage("/todos/");
}

export function erstelleTodo(titel) {
  return anfrage("/todos/", {
    method: "POST",
    body: JSON.stringify({ titel }),
  });
}

export function aendereTodo(id, aenderungen) {
  // aenderungen z. B. { erledigt: true } oder { titel: "Neu" }
  return anfrage(`/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(aenderungen),
  });
}

export function loescheTodo(id) {
  return anfrage(`/todos/${id}`, { method: "DELETE" });
}
