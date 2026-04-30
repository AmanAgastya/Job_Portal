# 🚀 Job Quest — MERN Stack Job Quest

A full-featured, production-ready job portal built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js).
Developed as B.Tech project at Future Institute of Engineering & Management, Kolkata.

**Team:** Aman Agastya · Bikash Lal Shaw · Debarjun Pal · Ashik Saha
**Guide:** Md Ashraf Ali, Subject Matter Expert (MERN), Ardent Computech Pvt Ltd

---

## ✨ Features

### 👤 Candidates
- Register/Login with JWT authentication
- Create detailed profile (bio, skills, education, experience)
- Upload & manage resume (PDF, DOCX, DOC)
- Browse and search jobs with advanced filters
- One-click apply with cover letter
- Track application status in real-time
- Save favourite jobs
- **🤖 ATS Resume Checker** — AI-powered scoring + suggestions

### 🏢 Employers / Recruiters
- Company profile management
- Post, edit, pause, and delete job listings
- View & manage all applications per job
- Update applicant status (Pending → Shortlisted → Interview → Offer/Rejected)
- Employer dashboard with live stats

### 🛡️ Admin (Backend)
- Full user management (activate/deactivate/delete)
- Moderate all job postings
- View platform-wide analytics
- Manage all applications

### 🤖 ATS Resume Checker
- Accepts **all formats**: PDF, DOCX, DOC, TXT, RTF
- Scores resume out of 100 with letter grade (A+ to D)
- Section detection, keyword analysis, formatting check
- Job description keyword matching
- Prioritized improvement suggestions (Critical / Important / Suggested)
- Quantified achievement detection
- Contact info, LinkedIn, GitHub validation

---

## 🛠️ Tech Stack

| Layer      | Technology                            |
|------------|---------------------------------------|
| Frontend   | React 18, React Router v6, Axios      |
| Backend    | Node.js, Express.js                   |
| Database   | MongoDB + Mongoose                    |
| Auth       | JWT (jsonwebtoken) + bcryptjs         |
| Resume     | pdf-parse, mammoth (DOCX extraction)  |
| Styling    | Custom CSS (design tokens, responsive)|

---

## 📁 Project Structure

```
job_portal/
├── backend/
│   ├── models/
│   │   ├── User.js          # Candidate + Recruiter + Admin
│   │   ├── Job.js           # Job listings
│   │   └── Application.js   # Job applications
│   ├── routes/
│   │   ├── auth.js          # Register, Login, Seed Admin
│   │   ├── jobs.js          # CRUD jobs, search
│   │   ├── applications.js  # Apply, track, update status
│   │   ├── users.js         # Profile, resume upload, saved jobs
│   │   ├── admin.js         # Admin-only management
│   │   └── resume.js        # ATS resume analysis
│   ├── middleware/
│   │   └── auth.js          # JWT middleware, role guards
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── pages/
        │   ├── HomePage.js          # Landing page with hero, categories
        │   ├── AuthPages.js         # Login + Register
        │   ├── JobsPages.js         # Job listing + Job detail + Apply modal
        │   ├── CandidateDashboard.js # Full candidate dashboard
        │   ├── EmployerDashboard.js  # Full employer dashboard
        │   ├── AdminDashboard.js     # Admin panel
        │   └── ATSCheckerPage.js    # ATS resume checker
        ├── components/
        │   └── layout/
        │       ├── Navbar.js
        │       └── ProtectedRoute.js
        ├── context/
        │   └── AuthContext.js       # Auth state management
        ├── utils/
        │   └── api.js               # Axios instance with interceptors
        ├── App.js                   # Routes
        ├── index.js
        └── index.css                # Global design system
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))

### 1. Clone & Setup Backend

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your values:
#   MONGO_URI=mongodb://localhost:27017/jobportal
#   JWT_SECRET=your_secret_key_here
#   PORT=5000

npm run dev
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm start
```

### 3. Seed Admin Account

After starting the backend, run once:
```bash
curl -X POST http://localhost:5000/api/auth/seed-admin
```

Or visit: `http://localhost:5000/api/auth/seed-admin` in your browser.

**Admin credentials:**
- Email: `admin@jobportal.com`
- Password: `Admin@1234`

### 4. Open in Browser

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Frontend (React) |
| http://localhost:5000/api/health | Backend health check |
| http://localhost:3000/login | Login page |
| http://localhost:3000/register | Register as candidate or recruiter |
| http://localhost:3000/jobs | Browse jobs |
| http://localhost:3000/resume-checker | ATS Checker |
| http://localhost:3000/dashboard | Auto-routes by role |

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/seed-admin` | Create admin (once) |

### Jobs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/jobs` | No | List/search jobs |
| GET | `/api/jobs/:id` | No | Job details |
| POST | `/api/jobs` | Recruiter | Create job |
| PUT | `/api/jobs/:id` | Recruiter | Update job |
| DELETE | `/api/jobs/:id` | Recruiter | Delete job |
| GET | `/api/jobs/employer/myjobs` | Recruiter | My jobs |

### Applications
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/applications` | Candidate | Apply to job |
| GET | `/api/applications/my` | Candidate | My applications |
| GET | `/api/applications/employer` | Recruiter | View applicants |
| PUT | `/api/applications/:id/status` | Recruiter | Update status |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/api/users/profile` | Any | Update profile |
| POST | `/api/users/upload-resume` | Any | Upload resume |
| GET | `/api/users/saved-jobs` | Any | Get saved jobs |
| POST | `/api/users/save-job/:jobId` | Any | Toggle save job |
| GET | `/api/users/dashboard-stats` | Any | Dashboard stats |

### Resume / ATS
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/resume/analyze` | Required | Analyze resume |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/stats` | Admin | Platform stats |
| GET | `/api/admin/users` | Admin | List users |
| PUT | `/api/admin/users/:id/status` | Admin | Toggle user |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |
| GET | `/api/admin/jobs` | Admin | List all jobs |
| PUT | `/api/admin/jobs/:id/status` | Admin | Toggle job |
| DELETE | `/api/admin/jobs/:id` | Admin | Delete job |

---

## 🎨 Dashboard Routes

| Role | URL | Access |
|------|-----|--------|
| Candidate | `/candidate#overview` | Overview, Applications, Saved Jobs, Resume, Profile, ATS |
| Employer | `/employer#overview` | Overview, My Jobs, Applications, Company Profile |
| Admin | `/admin#overview` | Overview, Users, Jobs, Applications |

---

## 🤖 ATS Scoring Algorithm

The resume analyzer scores across 8 dimensions (total 100 points):

| Dimension | Max | What's Checked |
|-----------|-----|----------------|
| Contact Info | 10 | Email, phone |
| Resume Sections | 20 | Summary, Experience, Education, Skills, Projects, Certifications |
| Technical Keywords | 20 | 30+ tech terms (React, Python, Docker, AWS, etc.) |
| Soft Skills | 10 | Leadership, communication, teamwork, etc. |
| Action Verbs | 10 | Developed, led, optimized, deployed, etc. |
| Quantified Achievements | 10 | Numbers like "30%", "5 engineers", "1M users" |
| Formatting | 10 | Bullet points, date ranges, LinkedIn, GitHub |
| Word Count | 10 | Optimal 300–800 words |

**Grades:** A+ (85–100) · A (75–84) · B+ (65–74) · B (55–64) · C (45–54) · D (<45)

---

## 📦 Dependencies

### Backend
```
express, mongoose, bcryptjs, jsonwebtoken, cors, multer,
dotenv, express-validator, pdf-parse, mammoth
```

### Frontend
```
react, react-dom, react-router-dom, axios, react-hot-toast, react-icons, date-fns
```

---

## 📝 License

MIT License — Free to use for educational and commercial projects.

---

*Built with ❤️ in Kolkata, India*
