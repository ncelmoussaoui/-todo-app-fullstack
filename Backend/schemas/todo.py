from pydantic import BaseModel, Field
from datetime import datetime

class Todo(BaseModel):
    id: int
    titel: str
    erledigt: bool
    erstellt_am: datetime

class TodoCreate(BaseModel):
    # Leere Titel verbieten, max. 200 Zeichen (wie VARCHAR(200) in der DB)
    titel: str = Field(min_length=1, max_length=200)

class TodoUpdate(BaseModel):
    # Beide Felder optional: man kann nur den Status, nur den Titel oder beides ändern
    titel: str | None = Field(default=None, min_length=1, max_length=200)
    erledigt: bool | None = None
