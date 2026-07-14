# ATS Resume Screening System

A modern **Candidate-Centric Applicant Tracking System (ATS)** built using **FastAPI**, **MySQL**, and **Vanilla JavaScript**.

The system enables candidates to upload resumes, analyze them against any job description, calculate an ATS match score, and receive job role recommendations based on detected technical skills.

---

# 🌐 Live Demo

### Frontend
https://ats-analyzer-chi.vercel.app/

### Backend API
https://ats-analyzer-9jym.onrender.com

### API Documentation
https://ats-analyzer-9jym.onrender.com/docs

---

# 📸 Features

## Authentication
- JWT-based User Registration
- Secure Login
- Password Hashing using Passlib

## Resume Parsing
- Upload PDF Resume
- Extract Resume Text
- Detect Technical Skills
- Store Resume Information

## ATS Resume Analysis
- Paste any Job Description
- Compare Resume Skills with JD Skills
- Calculate ATS Match Score

```
ATS Score = (Matched Skills / Required Skills) × 100
```

## Job Recommendations

Based on detected skills, the system recommends suitable job roles.

Example

| Skills | Recommended Role |
|---------|------------------|
| Python, FastAPI, SQL | Backend Developer |
| React, HTML, CSS | Frontend Developer |
| Docker, Linux | DevOps Engineer |
| Pandas, NumPy | Data Analyst |

## Candidate Dashboard

- Uploaded Resume
- Extracted Skills
- ATS Analysis History
- Recommended Job Roles

---

# 🛠 Tech Stack

## Backend

- Python
- FastAPI
- SQLAlchemy
- Alembic
- MySQL
- PyPDF2
- Passlib
- JWT Authentication

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)

## Database

- MySQL
- Hosted on **Aiven Cloud Database**

## Deployment

- Frontend → Vercel
- Backend → Render
- Database → Aiven MySQL

---

# 📂 Project Structure

```
ATS-Analyzer
│
├── app
│   ├── api
│   ├── core
│   ├── database
│   ├── models
│   ├── repositories
│   ├── schemas
│   ├── services
│   ├── utils
│   ├── workers
│   └── main.py
│
├── alembic
├── frontend
├── requirements.txt
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/KJoshiSaiGovind/ATS-Analyzer.git

cd ATS-Analyzer
```

---

## Create Virtual Environment

### Windows

```bash
python -m venv venv

venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv

source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Configure Environment Variables

Create a `.env` file.

```env
DATABASE_URL=mysql+pymysql://USERNAME:PASSWORD@HOST:PORT/DATABASE

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Use your **Aiven MySQL** connection URL for `DATABASE_URL`.

---

## Run Database Migrations

```bash
alembic upgrade head
```

---

## Run Backend

```bash
uvicorn app.main:app --reload --port 8080
```

Backend

```
http://127.0.0.1:8080
```

Swagger Docs

```
http://127.0.0.1:8080/docs
```

---

# 🚀 Frontend

Since the frontend is built using **Vanilla HTML, CSS and JavaScript**, there are no build tools required.

Simply open

```
frontend/index.html
```

or deploy it using Vercel.

---

# 🔄 Application Workflow

```
User Registration
        │
        ▼
User Login
        │
        ▼
Upload Resume (PDF)
        │
        ▼
Resume Parsing
        │
        ▼
Skill Extraction
        │
        ▼
Store Resume
        │
        ▼
Paste Job Description
        │
        ▼
ATS Score Calculation
        │
        ▼
Job Role Recommendation
        │
        ▼
Dashboard History
```

---

# 🏗 Architecture

The backend follows a layered architecture.

```
Client
   │
   ▼
FastAPI Routes
   │
   ▼
Service Layer
   │
   ▼
Repository Layer
   │
   ▼
SQLAlchemy ORM
   │
   ▼
Aiven MySQL Database
```

---

# 📈 ATS Scoring Logic

```
Resume Skills

↓

Normalize Skills

↓

Extract Job Description Skills

↓

Compare Skills

↓

Calculate Match Score

↓

Generate Recommendations
```

Formula

```
ATS Score =

(Matched Skills / Required Skills) × 100
```

---

# 🔐 Security

- JWT Authentication
- Password Hashing (Passlib)
- Input Validation (Pydantic)
- SQLAlchemy ORM
- Environment Variables for Secrets

---

# 📚 API Documentation

Interactive Swagger UI

```
https://ats-analyzer-9jym.onrender.com/docs
```

---

# Future Improvements

- Resume Version Management
- Multiple Resume Support
- Export ATS Report as PDF
- Admin Dashboard
- Advanced Resume Parsing
- AI-based Resume Suggestions
- Interview Question Recommendations

---

# 👨‍💻 Author

**Sai Govind**

GitHub

https://github.com/KJoshiSaiGovind

LinkedIn

(Add your LinkedIn profile)

---

# License

This project is released under the MIT License.

Feel free to use it for learning, portfolio projects, and educational purposes.
