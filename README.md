# Todo-App – Full Stack

Eine Todo-App mit **React-Frontend**, **FastAPI-Backend** und **PostgreSQL-Datenbank**.
Aufgaben anlegen, abhaken, umbenennen, filtern und löschen. Alle Daten werden dauerhaft in der Datenbank gespeichert.

## Funktionen

- Aufgaben hinzufügen (Validierung: 1–200 Zeichen)
- Aufgaben als erledigt markieren
- Titel per Doppelklick bearbeiten (Enter speichert, Escape bricht ab)
- Aufgaben löschen
- Filter: Alle / Offen / Erledigt, mit Zähler der offenen Aufgaben
- Fehlermeldungen, wenn das Backend nicht erreichbar ist oder Eingaben ungültig sind
- Dark Mode und mobile Ansicht

## Tech-Stack

| Bereich   | Technologie |
|-----------|-------------|
| Frontend  | React 19, Vite, CSS |
| Backend   | Python, FastAPI, Pydantic, Uvicorn |
| Datenbank | PostgreSQL (über psycopg 3) |

## Projektstruktur

```
todo-app/
├── Backend/
│   ├── main.py              # FastAPI-App + CORS
│   ├── database.py          # Datenbankverbindung (liest .env)
│   ├── routers/todos.py     # API-Endpoints
│   ├── schemas/todo.py      # Pydantic-Modelle + Validierung
│   ├── schema.sql           # Tabelle anlegen
│   ├── requirements.txt
│   └── .env.example         # Vorlage für die Zugangsdaten
└── Frontend/
    └── src/
        ├── api.js           # Alle Aufrufe ans Backend
        ├── App.jsx          # Zustand, Filter, Layout
        ├── index.css
        └── components/
            ├── TodoForm.jsx
            └── TodoItem.jsx
```

## Installation und Start

### Voraussetzungen

- Python 3.10 oder neuer
- Node.js 20 oder neuer
- PostgreSQL

### 1. Repository klonen

```bash
git clone https://github.com/ncelmoussaoui/-todo-app-fullstack.git
cd -- -todo-app-fullstack
```

### 2. Datenbank einrichten

```bash
createdb -U postgres todo_db
psql -U postgres -d todo_db -f Backend/schema.sql
```

### 3. Backend starten

```bash
cd Backend
cp .env.example .env          # Windows: copy .env.example .env
# .env öffnen und eigenes Datenbankpasswort eintragen

pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Das Backend läuft auf **http://localhost:8000**.
Unter **http://localhost:8000/docs** gibt es eine interaktive API-Dokumentation (Swagger UI).

### 4. Frontend starten (zweites Terminal)

```bash
cd Frontend
npm install
npm run dev
```

Die App ist dann unter **http://localhost:5173** erreichbar.

## API-Endpoints

| Methode  | Pfad           | Beschreibung                         | Body (JSON)                              |
|----------|----------------|--------------------------------------|------------------------------------------|
| `GET`    | `/todos/`      | Alle Aufgaben abrufen                | –                                        |
| `POST`   | `/todos/`      | Neue Aufgabe anlegen                 | `{ "titel": "Einkaufen" }`               |
| `PATCH`  | `/todos/{id}`  | Status und/oder Titel ändern         | `{ "erledigt": true }` oder `{ "titel": "Neu" }` |
| `DELETE` | `/todos/{id}`  | Aufgabe löschen                      | –                                        |

**Antwort-Beispiel:**

```json
{
  "id": 1,
  "titel": "Einkaufen",
  "erledigt": false,
  "erstellt_am": "2026-11-17T11:11:31.400291"
}
```

**Fehlercodes:** `404` Aufgabe nicht gefunden · `422` ungültige Eingabe (z. B. leerer Titel) · `400` PATCH ohne Felder

## Konfiguration

| Datei             | Variable                                            | Zweck |
|-------------------|-----------------------------------------------------|-------|
| `Backend/.env`    | `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT` | Datenbankzugang |
| `Frontend/.env`   | `VITE_API_URL` (optional)                           | Adresse des Backends, Standard: `http://localhost:8000` |

Die `.env`-Dateien sind in der `.gitignore` eingetragen und werden nicht hochgeladen.
