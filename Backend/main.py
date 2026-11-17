from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import todos

app = FastAPI(title="Todo-App")

# CORS erlauben: Frontend (Port 5173 Vite, 3000 React) darf zugreifen
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Todos-Router einbinden
app.include_router(todos.router)