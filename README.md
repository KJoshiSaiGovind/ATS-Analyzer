# ATS Resume Screening System

A modern, **Candidate-Centric Applicant Tracking System (ATS)** built with a high-performance FastAPI backend and a sleek, glassmorphism frontend.

This system allows candidates to upload their resumes, paste job descriptions, and instantly receive an ATS match score based on keyword analysis. It also provides AI-free, algorithm-driven job role recommendations based on industry-standard skill mapping.

---

## ✨ Features

- **Candidate Dashboard:** A single pane of glass showing uploaded resumes, detected skills, and past ATS analysis history.
- **Resume Parsing Engine:** Extracts text from PDF files, normalizes keywords, and maps them strictly against a master database of technical skills.
- **Dynamic ATS Scoring:** Candidates can paste any Job Description. The system instantly calculates a match score `(Matched Skills / Required Skills) * 100`.
- **Job Role Recommendations:** Analyzes your detected skills (e.g., Python, Docker) and suggests ideal job roles (e.g., Backend Developer, DevOps Engineer).
- **Premium UI:** A fully responsive frontend built with Vanilla HTML/JS/CSS utilizing frosted glass aesthetics and dynamic score circles.
- **Secure Authentication:** JWT-based user registration and login.

---

## 🛠️ Tech Stack

**Backend**
- **Python 3**
- **FastAPI** (High-performance web framework)
- **SQLAlchemy & Alembic** (ORM & Database Migrations)
- **MySQL** (Relational Database)
- **PyPDF2** (Resume parsing)
- **Passlib & JWT** (Authentication)

**Frontend**
- **Vanilla HTML5 & CSS3** (No build steps required!)
- **Vanilla JavaScript (ES6)**
- **Google Fonts (Inter)**

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.8+
- MySQL Server running locally
- Git

### 2. Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KJoshiSaiGovind/ATS-Analyzer.git
   cd ATS-Analyzer
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Database Configuration:**
   - Ensure your MySQL server is running.
   - The database credentials should be configured in `app/database/base.py` (Default: `mysql+pymysql://root:root@localhost:3306/ats_db`).

5. **Run the Backend Server:**
   ```bash
   uvicorn app.main:app --reload --port 8080
   ```
   *The API will be available at `http://127.0.0.1:8080`*

### 3. Frontend Setup

Because the frontend is built entirely with Vanilla web technologies, there is no `npm install` or build step required!

1. Open the `frontend/` folder in your File Explorer.
2. Double click **`index.html`** to open it in your browser.
3. Register a new account and enjoy!

---

## 🏗️ Architecture

The backend strictly follows a layered architecture to ensure scalability and separation of concerns:
- **Routes (`app/api/`)**: Defines the FastAPI endpoints.
- **Services (`app/services/`)**: Contains all business logic (Parsing, Normalization, ATS Math).
- **Repositories (`app/repositories/`)**: Handles all direct SQLAlchemy database queries.
- **Models (`app/models/`)**: Defines the MySQL table schemas.
- **Schemas (`app/schemas/`)**: Defines Pydantic validation models for Request/Response validation.

---

## 🤝 License
This project is open-source and available for educational and portfolio purposes.
