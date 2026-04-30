const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Job = require('../models/Job');
const { auth } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/resumes');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `resume_${req.user._id}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Only PDF, DOC, DOCX files allowed'));
  },
});

// @PUT /api/users/profile - Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);

    if (updates.profile) Object.assign(user.profile, updates.profile);
    if (updates.company) Object.assign(user.company, updates.company);
    if (updates.fullName) user.fullName = updates.fullName;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/users/upload-resume
router.post('/upload-resume', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findById(req.user._id);
    if (!user.profile) user.profile = {};
    user.profile.resume = {
      url: `/uploads/resumes/${req.file.filename}`,
      filename: req.file.originalname,
      uploadedAt: new Date(),
    };
    await user.save();
    res.json({ resume: user.profile.resume });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/users/saved-jobs
router.get('/saved-jobs', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');
    res.json(user.savedJobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/users/save-job/:jobId
router.post('/save-job/:jobId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.jobId;
    const idx = user.savedJobs.indexOf(jobId);
    if (idx > -1) {
      user.savedJobs.splice(idx, 1);
      await user.save();
      return res.json({ saved: false, message: 'Job unsaved' });
    }
    user.savedJobs.push(jobId);
    await user.save();
    res.json({ saved: true, message: 'Job saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/users/dashboard-stats
router.get('/dashboard-stats', auth, async (req, res) => {
  try {
    const Application = require('../models/Application');
    if (req.user.role === 'candidate') {
      const apps = await Application.find({ applicant: req.user._id });
      const stats = {
        totalApplied: apps.length,
        pending: apps.filter((a) => a.status === 'pending').length,
        shortlisted: apps.filter((a) => a.status === 'shortlisted').length,
        interviews: apps.filter((a) => a.status === 'interview').length,
        offers: apps.filter((a) => a.status === 'offer').length,
        rejected: apps.filter((a) => a.status === 'rejected').length,
        savedJobs: req.user.savedJobs?.length || 0,
      };
      return res.json(stats);
    }
    if (req.user.role === 'recruiter') {
      const Job = require('../models/Job');
      const jobs = await Job.find({ company: req.user._id });
      const jobIds = jobs.map((j) => j._id);
      const apps = await Application.find({ employer: req.user._id });
      const stats = {
        totalJobs: jobs.length,
        activeJobs: jobs.filter((j) => j.status === 'active').length,
        totalApplications: apps.length,
        pendingReview: apps.filter((a) => a.status === 'pending').length,
        shortlisted: apps.filter((a) => a.status === 'shortlisted').length,
        interviews: apps.filter((a) => a.status === 'interview').length,
      };
      return res.json(stats);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
