-- Tabelle für die Todo-App anlegen
CREATE TABLE IF NOT EXISTS todos (
    id          SERIAL PRIMARY KEY,
    titel       VARCHAR(200) NOT NULL,
    erledigt    BOOLEAN DEFAULT FALSE,
    erstellt_am TIMESTAMP DEFAULT NOW()
);
