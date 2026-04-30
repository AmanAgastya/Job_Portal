# Job Quest - MERN Job Portal

Job Quest is a full-stack job portal built with the MERN stack: MongoDB, Express.js, React.js, and Node.js. It supports separate candidate, employer/recruiter, and admin workflows, including job browsing, job posting, applications, dashboards, and an ATS resume checker.

Developed as a Internship project at Ardent Computech Pvt Ltd, Kolkata.

Team: Aman Agastya, Bikash Lal Shaw, Rampratap Chauhan
Guide: Md Ashraf Ali, Subject Matter Expert (MERN), Ardent Computech Pvt Ltd

---

## Features

### Candidates
- Candidate registration and login with JWT authentication
- Candidate dashboard with overview, applications, saved jobs, resume, profile, and ATS tools
- Browse jobs and view detailed job pages
- Apply to jobs with a cover letter
- Save favorite jobs
- Track application status
- ATS resume checker with score, grade, keyword analysis, and suggestions

### Employers / Recruiters
- Separate employer login page
- Employer dashboard with job and application management
- Post jobs
- View posted jobs
- Review candidate applications
- Update application status
- Employer-only redirects for employer dashboard and post-job flows

### Admin
- Admin dashboard
- User management
- Job moderation
- Platform statistics
- Application oversight

### Public Pages
- Home page
- About page with Meet Our Team section
- Contact page
- Privacy policy
- Terms page
- Jobs listing and job details

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Resume Parsing | pdf-parse, mammoth |
| UI | Custom CSS, react-icons, react-hot-toast |

---

## Project Structure

```text
Job_Quest/
|-- backend/
|   |-- middleware/
|   |   `-- auth.js
|   |-- models/
|   |   |-- Application.js
|   |   |-- Job.js
|   |   `-- User.js
|   |-- routes/
|   |   |-- admin.js
|   |   |-- applications.js
|   |   |-- auth.js
|   |   |-- jobs.js
|   |   |-- resume.js
|   |   `-- users.js
|   |-- .env
|   |-- package.json
|   `-- server.js
|
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |   |-- auth/
|   |   |   |   `-- AuthLayout.js
|   |   |   `-- layout/
|   |   |       |-- Footer.js
|   |   |       |-- Navbar.js
|   |   |       `-- ProtectedRoute.js
|   |   |-- context/
|   |   |   `-- AuthContext.js
|   |   |-- pages/
|   |   |   |-- AboutPage.js
|   |   |   |-- AdminDashboard.js
|   |   |   |-- ATSCheckerPage.js
|   |   |   |-- AuthPages.js
|   |   |   |-- CandidateDashboard.js
|   |   |   |-- CandidateLoginPage.js
|   |   |   |-- ContactPage.js
|   |   |   |-- EmployerDashboard.js
|   |   |   |-- EmployerLoginPage.js
|   |   |   |-- HomePage.js
|   |   |   |-- JobsPages.js
|   |   |   |-- PostJobPage.js
|   |   |   |-- RegisterPage.js
|   |   |   `-- css/
|   |   |-- utils/
|   |   |   `-- api.js
|   |   |-- App.js
|   |   `-- index.js
|   `-- package.json
|
|-- package.json
`-- README.md
```

---

## Quick Start

### Prerequisites
- Node.js 18 or later
- MongoDB local instance or MongoDB Atlas connection string

### Install all dependencies

From the project root:

```bash
npm run install-all
```

Or install backend and frontend separately:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Configure backend environment

Create or update `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/jobquest
JWT_SECRET=your_secret_key_here
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Run the full app

From the project root:

```bash
npm run dev
```

This starts:
- Backend API at `http://localhost:5000`
- React frontend at `http://localhost:3000`

You can also run them separately:

```bash
npm run start-backend
npm run start-frontend
```

### Seed admin account

After the backend is running:

```bash
npm run seed-admin
```

Admin credentials:

```text
Email: admin@jobportal.com
Password: Admin@1234
```

---

## Frontend Routes

| URL | Description |
| --- | --- |
| `/` | Home page |
| `/candidate-login` | Candidate login page |
| `/employer-login` | Employer login page |
| `/login` | Redirects to candidate login |
| `/register` | Create candidate or employer account |
| `/jobs` | Browse jobs |
| `/jobs/:id` | Job details and apply flow |
| `/resume-checker` | ATS resume checker, login required |
| `/dashboard` | Role-based dashboard redirect |
| `/candidate` | Candidate dashboard |
| `/employer` | Employer dashboard |
| `/admin` | Admin dashboard |
| `/post-job` | Employer post-job entry route |
| `/about` | About page |
| `/contact` | Contact page |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

Unauthenticated candidate pages redirect to `/candidate-login`. Employer-only pages redirect to `/employer-login`.

---

## API Endpoints

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a candidate or recruiter |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current authenticated user |
| POST | `/api/auth/seed-admin` | Create default admin account |

### Jobs

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/jobs` | Public | List and search jobs |
| GET | `/api/jobs/:id` | Public | Get job details |
| POST | `/api/jobs` | Recruiter | Create a job |
| PUT | `/api/jobs/:id` | Recruiter | Update a job |
| DELETE | `/api/jobs/:id` | Recruiter | Delete a job |
| GET | `/api/jobs/employer/myjobs` | Recruiter | Get recruiter's jobs |

### Applications

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/applications` | Candidate | Apply to a job |
| GET | `/api/applications/my` | Candidate | Get candidate applications |
| GET | `/api/applications/employer` | Recruiter | Get employer applications |
| PUT | `/api/applications/:id/status` | Recruiter | Update application status |

### Users

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| PUT | `/api/users/profile` | User | Update profile |
| POST | `/api/users/upload-resume` | User | Upload resume |
| GET | `/api/users/saved-jobs` | User | Get saved jobs |
| POST | `/api/users/save-job/:jobId` | User | Toggle saved job |
| GET | `/api/users/dashboard-stats` | User | Get dashboard statistics |

### Resume / ATS

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/resume/analyze` | User | Analyze resume |

### Admin

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/admin/stats` | Admin | Platform stats |
| GET | `/api/admin/users` | Admin | List users |
| PUT | `/api/admin/users/:id/status` | Admin | Toggle user status |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |
| GET | `/api/admin/jobs` | Admin | List all jobs |
| PUT | `/api/admin/jobs/:id/status` | Admin | Toggle job status |
| DELETE | `/api/admin/jobs/:id` | Admin | Delete job |

---

## Dashboards

| Role | Route | Main Sections |
| --- | --- | --- |
| Candidate | `/candidate` | Overview, applications, saved jobs, resume, profile, ATS |
| Employer | `/employer` | Overview, my jobs, applications, company profile |
| Admin | `/admin` | Overview, users, jobs, applications |

`/dashboard` automatically redirects each authenticated user to the correct dashboard based on role.

---

## ATS Resume Checker

The ATS checker analyzes uploaded resumes and returns:

- Score out of 100
- Letter grade
- Contact information checks
- Resume section detection
- Technical keyword analysis
- Soft skill and action verb detection
- Formatting checks
- Job description keyword matching
- Prioritized improvement suggestions

Supported parsing libraries include `pdf-parse` and `mammoth`.

---

## Useful Scripts

From the root:

| Command | Description |
| --- | --- |
| `npm run install-all` | Install backend and frontend dependencies |
| `npm run dev` | Start backend and frontend together |
| `npm run start-backend` | Start backend only |
| `npm run start-frontend` | Start frontend only |
| `npm run seed-admin` | Create default admin account |

From `frontend/`:

| Command | Description |
| --- | --- |
| `npm start` | Start React dev server |
| `npm run build` | Build production frontend |

From `backend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start backend with nodemon |
| `npm start` | Start backend with node |

---

## Notes

- The frontend Axios instance is configured in `frontend/src/utils/api.js`.
- The backend serves uploaded files from `/uploads`.
- React uses the backend proxy defined in `frontend/package.json`.
- Protected routes are handled by `frontend/src/components/layout/ProtectedRoute.js`.
- Shared auth form layout lives in `frontend/src/components/auth/AuthLayout.js`.

---

## License

MIT License. Free to use for educational and learning purposes.

---

Built with React, Node.js, Express, and MongoDB in Kolkata, India.
