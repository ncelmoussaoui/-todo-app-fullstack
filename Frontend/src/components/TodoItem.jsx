import { useRef, useState } from "react";

function formatiereDatum(iso) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function TodoItem({ todo, onUmschalten, onUmbenennen, onLoeschen }) {
  const [bearbeitet, setBearbeitet] = useState(false);
  const [entwurf, setEntwurf] = useState(todo.titel);
  const fertig = useRef(false);

  function starteBearbeiten() {
    setEntwurf(todo.titel);
    fertig.current = false;
    setBearbeitet(true);
  }

  async function speichern() {
    // Verhindert doppeltes Speichern (Enter + anschließendes blur) und Speichern nach Escape
    if (fertig.current) return;
    fertig.current = true;

    const sauber = entwurf.trim();
    setBearbeitet(false);
    if (sauber && sauber !== todo.titel) {
      await onUmbenennen(todo.id, sauber);
    }
  }

  function tasteGedrueckt(e) {
    if (e.key === "Enter") speichern();
    if (e.key === "Escape") {
      fertig.current = true;
      setBearbeitet(false);
    }
  }

  return (
    <li className={`todo-item ${todo.erledigt ? "erledigt" : ""}`}>
      <input
        type="checkbox"
        checked={todo.erledigt}
        onChange={() => onUmschalten(todo)}
        aria-label={`"${todo.titel}" als erledigt markieren`}
      />

      {bearbeitet ? (
        <input
          className="bearbeiten"
          value={entwurf}
          onChange={(e) => setEntwurf(e.target.value)}
          onBlur={speichern}
          onKeyDown={tasteGedrueckt}
          maxLength={200}
          aria-label="Titel bearbeiten"
          autoFocus
        />
      ) : (
        <span className="titel" onDoubleClick={starteBearbeiten} title="Doppelklick zum Bearbeiten">
          {todo.titel}
        </span>
      )}

      <span className="datum">{formatiereDatum(todo.erstellt_am)}</span>

      <button
        className="loeschen"
        onClick={() => onLoeschen(todo.id)}
        aria-label={`"${todo.titel}" löschen`}
        title="Löschen"
      >
        ×
      </button>
    </li>
  );
}
