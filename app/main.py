from fastapi import FastAPI

app = FastAPI(
    title="ATS Resume Screening System",
    version="1.0"
)

@app.get("/")
def root():
    return {
        "message": "ATS System Running"
    }