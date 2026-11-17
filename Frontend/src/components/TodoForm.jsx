import { useState } from "react";

export default function TodoForm({ onHinzufuegen }) {
  const [titel, setTitel] = useState("");
  const [sendet, setSendet] = useState(false);

  async function absenden(e) {
    e.preventDefault();
    const sauber = titel.trim();
    if (!sauber) return;

    setSendet(true);
    const erfolgreich = await onHinzufuegen(sauber);
    setSendet(false);
    if (erfolgreich) setTitel("");
  }

  return (
    <form className="todo-form" onSubmit={absenden}>
      <input
        type="text"
        value={titel}
        onChange={(e) => setTitel(e.target.value)}
        placeholder="Was ist zu tun?"
        maxLength={200}
        aria-label="Neue Aufgabe"
        autoFocus
      />
      <button type="submit" disabled={sendet || !titel.trim()}>
        Hinzufügen
      </button>
    </form>
  );
}
