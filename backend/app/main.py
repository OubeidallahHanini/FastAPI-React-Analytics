from fastapi import FastAPI
from .database import engine, Base
from .routes import auth, users , import_csv,sales, Metrics
from fastapi.middleware.cors import CORSMiddleware


# Init my application
app = FastAPI(
    title="Mon API FastAPI",
    description="App for Sayano",
    version="1.0.0"
)

# Autoriser les requêtes provenant du front sur le port 3000
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # autorise uniquement le front
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# For Automatically create table into database
Base.metadata.create_all(bind=engine)

# Routes
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(import_csv.router, prefix="/api", tags=["Import CSV"])
app.include_router(sales.router, prefix="/api", tags=["Generic Sales"])
app.include_router(Metrics.router, prefix="/api", tags=["Metrics"])





@app.get("/")
def home():
    return {"message": "Backend for sayano project"}
