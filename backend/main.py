import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers.safety import router as safety_router
from backend.routers.cracks import router as cracks_router
from backend.routers.valuation import router as valuation_router
from backend.routers.scheduling import router as scheduling_router
from backend.routers.chat import router as chat_router
from backend.routers.weather import router as weather_router
from backend.routers.knowledge import router as knowledge_router

app = FastAPI(
    title="BuildVision AI - Multimodal Construction Intelligence Platform",
    description="Full-stack AI platform for Construction Safety, Structural Crack Analysis, Real Estate Valuation, Gantt Scheduling, Daily Site Assistant, Weather Hazards, and Knowledge Base.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware for React frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under /api prefix
app.include_router(safety_router, prefix="/api")
app.include_router(cracks_router, prefix="/api")
app.include_router(valuation_router, prefix="/api")
app.include_router(scheduling_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(weather_router, prefix="/api")
app.include_router(knowledge_router, prefix="/api")

@app.get("/")
def root():
    return {
        "platform": "BuildVision AI - Multimodal Construction Intelligence Platform",
        "status": "online",
        "version": "1.0.0",
        "documentation": "/docs",
        "modules": [
            "Site Safety Monitoring (/api/safety)",
            "Crack Detection & Analysis (/api/cracks)",
            "Real Estate Valuation & Cost Estimator (/api/valuation)",
            "Construction Project Planning & Scheduling (/api/scheduling)",
            "Daily Site Assistant & Chatbot (/api/chat)",
            "Weather-Aware Construction Advisory (/api/weather)",
            "Construction Knowledge Base (/api/knowledge)"
        ]
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "BuildVision API",
        "backend": "FastAPI (Python 3.12)",
        "pydantic_contracts": "active"
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
