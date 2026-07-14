from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.resumes import router as resumes_router
from app.api.ats import router as ats_router
from app.api.dashboard import router as dashboard_router

app = FastAPI(
    title="ATS Resume Screening System (Version 1)",
    version="1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(resumes_router, prefix="/api")
app.include_router(ats_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Candidate-Centric ATS System Running"
    }