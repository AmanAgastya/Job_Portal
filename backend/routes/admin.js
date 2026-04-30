const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { auth, isAdmin } = require('../middleware/auth');

// All admin routes require auth + isAdmin
router.use(auth, isAdmin);

// @GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, candidates, recruiters, totalJobs, activeJobs, totalApps] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      User.countDocuments({ role: 'candidate' }),
      User.countDocuments({ role: 'recruiter' }),
      Job.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      Application.countDocuments(),
    ]);
    res.json({ totalUsers, candidates, recruiters, totalJobs, activeJobs, totalApps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const query = { role: { $ne: 'admin' } };
    if (role) query.role = role;
    if (search) query.$or = [{ fullName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    res.json({ users, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/admin/users/:id/status
router.put('/users/:id/status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = req.body.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/admin/jobs
router.get('/jobs', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query).populate('company', 'fullName email company').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    res.json({ jobs, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/admin/jobs/:id/status
router.put('/jobs/:id/status', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @DELETE /api/admin/jobs/:id
router.delete('/jobs/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/admin/applications
router.get('/applications', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await Application.countDocuments();
    const apps = await Application.find()
      .populate('job', 'title companyName')
      .populate('applicant', 'fullName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({ applications: apps, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
