import { useEffect, useState } from "react";
import { holeTodos, erstelleTodo, aendereTodo, loescheTodo } from "./api";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";

const FILTER = {
  alle: () => true,
  offen: (t) => !t.erledigt,
  erledigt: (t) => t.erledigt,
};

export default function App() {
  const [todos, setTodos] = useState([]);
  const [laedt, setLaedt] = useState(true);
  const [fehler, setFehler] = useState("");
  const [filter, setFilter] = useState("alle");

  // Beim Start alle Todos vom Backend laden
  useEffect(() => {
    holeTodos()
      .then(setTodos)
      .catch((e) => setFehler(`Backend nicht erreichbar: ${e.message}`))
      .finally(() => setLaedt(false));
  }, []);

  async function hinzufuegen(titel) {
    try {
      const neu = await erstelleTodo(titel);
      setTodos((alt) => [...alt, neu]);
      setFehler("");
      return true;
    } catch (e) {
      setFehler(e.message);
      return false;
    }
  }

  async function aktualisieren(id, aenderungen) {
    try {
      const geaendert = await aendereTodo(id, aenderungen);
      setTodos((alt) => alt.map((t) => (t.id === id ? geaendert : t)));
      setFehler("");
    } catch (e) {
      setFehler(e.message);
    }
  }

  async function loeschen(id) {
    try {
      await loescheTodo(id);
      setTodos((alt) => alt.filter((t) => t.id !== id));
      setFehler("");
    } catch (e) {
      setFehler(e.message);
    }
  }

  const sichtbar = todos.filter(FILTER[filter]);
  const offen = todos.filter((t) => !t.erledigt).length;

  return (
    <main className="app">
      <h1>Meine Todos</h1>

      <TodoForm onHinzufuegen={hinzufuegen} />

      {fehler && (
        <p className="fehler" role="alert">
          {fehler}
          <button onClick={() => setFehler("")} aria-label="Meldung schließen">×</button>
        </p>
      )}

      <div className="filter">
        {Object.keys(FILTER).map((name) => (
          <button
            key={name}
            className={filter === name ? "aktiv" : ""}
            onClick={() => setFilter(name)}
          >
            {name[0].toUpperCase() + name.slice(1)}
          </button>
        ))}
      </div>

      {laedt ? (
        <p className="hinweis">Lade Todos…</p>
      ) : sichtbar.length === 0 ? (
        <p className="hinweis">
          {todos.length === 0 ? "Noch keine Aufgaben – leg oben los!" : "Keine Aufgaben in diesem Filter."}
        </p>
      ) : (
        <ul className="todo-liste">
          {sichtbar.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUmschalten={(t) => aktualisieren(t.id, { erledigt: !t.erledigt })}
              onUmbenennen={(id, titel) => aktualisieren(id, { titel })}
              onLoeschen={loeschen}
            />
          ))}
        </ul>
      )}

      {todos.length > 0 && (
        <p className="zaehler">
          {offen} von {todos.length} offen
        </p>
      )}
    </main>
  );
}
