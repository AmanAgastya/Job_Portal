const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const { auth, isRecruiter } = require('../middleware/auth');

// @GET /api/jobs - Public: search & list jobs
router.get('/', async (req, res) => {
  try {
    const { keyword, location, industry, jobType, experienceLevel, page = 1, limit = 12, sort = 'latest' } = req.query;
    const query = { status: 'active' };

    if (keyword) query.$text = { $search: keyword };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (industry) query.industry = industry;
    if (jobType) query.jobType = jobType;
    if (experienceLevel) query.experienceLevel = experienceLevel;

    const sortOption = sort === 'latest' ? { createdAt: -1 } : sort === 'salary' ? { salaryMax: -1 } : { createdAt: 1 };

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'fullName company email')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ jobs, total, pages: Math.ceil(total / limit), currentPage: parseInt(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company', 'fullName company email profile');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    job.views++;
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/jobs - Recruiter: create job
router.post('/', auth, isRecruiter, async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      company: req.user._id,
      companyName: req.user.company?.name || req.user.fullName,
      companyLogo: req.user.company?.logo,
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/jobs/:id
router.put('/:id', auth, isRecruiter, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, company: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @DELETE /api/jobs/:id
router.delete('/:id', auth, isRecruiter, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, company: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/jobs/employer/myjobs
router.get('/employer/myjobs', auth, isRecruiter, async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
