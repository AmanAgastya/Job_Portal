const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { auth, isRecruiter } = require('../middleware/auth');

// Multer setup for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/resumes');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Only PDF, DOC, DOCX files allowed'));
  },
});

// @POST /api/applications - Apply for a job
router.post('/', auth, upload.single('resume'), async (req, res) => {
  try {
    if (req.user.role !== 'candidate') return res.status(403).json({ message: 'Only candidates can apply' });

    const { jobId, coverLetter } = req.body;
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'active') return res.status(404).json({ message: 'Job not available' });

    const existing = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already applied to this job' });

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      employer: job.company,
      coverLetter,
      resumeUrl: req.file ? `/uploads/resumes/${req.file.filename}` : req.user.profile?.resume?.url,
      resumeFilename: req.file ? req.file.originalname : req.user.profile?.resume?.filename,
      statusHistory: [{ status: 'pending' }],
    });

    job.applicantsCount++;
    await job.save();

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/applications/my - Candidate: view own applications
router.get('/my', auth, async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate('job', 'title companyName location jobType salaryMin salaryMax')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/applications/employer - Recruiter: view all applications for their jobs
router.get('/employer', auth, isRecruiter, async (req, res) => {
  try {
    const { jobId, status } = req.query;
    const query = { employer: req.user._id };
    if (jobId) query.job = jobId;
    if (status) query.status = status;

    const apps = await Application.find(query)
      .populate('job', 'title companyName')
      .populate('applicant', 'fullName email profile')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/applications/:id/status - Recruiter: update application status
router.put('/:id/status', auth, isRecruiter, async (req, res) => {
  try {
    const { status, note, interviewDate } = req.body;
    const app = await Application.findOne({ _id: req.params.id, employer: req.user._id });
    if (!app) return res.status(404).json({ message: 'Application not found' });

    app.status = status;
    app.statusHistory.push({ status, note });
    if (interviewDate) app.interviewDate = interviewDate;
    await app.save();

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @DELETE /api/applications/:id - Candidate: withdraw application
router.delete('/:id', auth, async (req, res) => {
  try {
    const app = await Application.findOne({ _id: req.params.id, applicant: req.user._id });
    if (!app) return res.status(404).json({ message: 'Application not found' });
    app.status = 'withdrawn';
    await app.save();
    res.json({ message: 'Application withdrawn' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
