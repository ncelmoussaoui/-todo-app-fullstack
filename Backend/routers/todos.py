from fastapi import APIRouter, HTTPException
from psycopg.rows import dict_row
from database import get_connection
from schemas.todo import Todo, TodoCreate, TodoUpdate

router = APIRouter(prefix="/todos", tags=["Todos"])


@router.get("/", response_model=list[Todo])
def alle_todos():
    with get_connection() as conn:
        # dict_row: jede Zeile kommt als Dictionary, z. B. {"id": 1, "titel": ...}
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute("SELECT id, titel, erledigt, erstellt_am FROM todos ORDER BY id")
            zeilen = cur.fetchall()

    return [Todo(**z) for z in zeilen]


@router.post("/", response_model=Todo, status_code=201)
def todo_erstellen(todo: TodoCreate):
    with get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(
                """
                INSERT INTO todos (titel, erledigt)
                VALUES (%s, %s)
                RETURNING id, titel, erledigt, erstellt_am
                """,
                (todo.titel, False),
            )
            zeile = cur.fetchone()

    return Todo(**zeile)


@router.patch("/{todo_id}", response_model=Todo)
def todo_aendern(todo_id: int, daten: TodoUpdate):
    if daten.titel is None and daten.erledigt is None:
        raise HTTPException(
            status_code=400,
            detail="Mindestens 'titel' oder 'erledigt' angeben",
        )

    with get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            # COALESCE: wenn ein Wert NULL (nicht mitgeschickt) ist, alten Wert behalten
            cur.execute(
                """
                UPDATE todos
                SET titel    = COALESCE(%s, titel),
                    erledigt = COALESCE(%s, erledigt)
                WHERE id = %s
                RETURNING id, titel, erledigt, erstellt_am
                """,
                (daten.titel, daten.erledigt, todo_id),
            )
            zeile = cur.fetchone()

    if zeile is None:
        raise HTTPException(status_code=404, detail="Aufgabe nicht gefunden")

    return Todo(**zeile)


@router.delete("/{todo_id}")
def todo_loeschen(todo_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM todos WHERE id = %s RETURNING id",
                (todo_id,),
            )
            zeile = cur.fetchone()

    if zeile is None:
        raise HTTPException(status_code=404, detail="Aufgabe nicht gefunden")

    return {"nachricht": "Aufgabe gelöscht", "id": zeile[0]}
