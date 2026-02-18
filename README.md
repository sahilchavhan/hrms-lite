# HRMS Lite

A lightweight, professional Human Resource Management System (HRMS) built for small teams. This application allows an admin to manage employee records and track daily attendance with a modern, dark-themed interface.

## 🚀 Key Features
- **Employee Management**: Add, view, and delete employee records (ID, Name, Email, Department).
- **Attendance Tracking**: Mark daily attendance (Present/Absent) and view history for each employee.
- **Dynamic Dashboard**: Real-time stats and quick actions for efficient workflow.
- **Professional UI**: Fully responsive dark-mode design with smooth animations and meaningful UI states.

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, Axios, React Router, React Icons, React Hot Toast.
- **Backend**: Python 3.12, Django 6.0, Django REST Framework.
- **Database**: SQLite (Development) / PostgreSQL (Production ready).
- **Styling**: Modern Vanilla CSS with a customized design system.

---

## 💻 Local Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### 1. Backend Setup (Django)
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run migrations (creates SQLite database)
python manage.py migrate

# Start the server
python manage.py runserver
```
The API will be available at `http://127.0.0.1:8000/api/`.

### 2. Frontend Setup (React)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The application will be available at `http://localhost:5173/`.

---

## 📝 Assumptions & Limitations
- **Single Admin**: The system assumes a single admin user; authentication/login is not required for this lite version.
- **Attendance Focus**: Management is limited to basic "Present" or "Absent" status.
- **Scope**: Advanced features like Leave Management, Payroll, and Performance Reviews are out of scope for this lightweight version.

## 🌐 Deployment
This project is configured for easy deployment:
- **Backend**: Ready for Railway/Render (includes `Procfile` and `runtime.txt`).
- **Frontend**: Optimized for Vercel/Netlify.
- See `deployment_guide.md` in the brain artifacts for detailed production instructions.
