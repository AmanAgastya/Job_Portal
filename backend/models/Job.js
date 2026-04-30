const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    companyLogo: String,
    description: { type: String, required: true },
    requirements: [String],
    responsibilities: [String],
    skills: [String],
    location: { type: String, required: true },
    jobType: { type: String, enum: ['full-time', 'part-time', 'remote', 'contract', 'internship'], default: 'full-time' },
    industry: String,
    experienceLevel: { type: String, enum: ['entry', 'mid', 'senior', 'lead', 'executive'], default: 'entry' },
    salaryMin: Number,
    salaryMax: Number,
    salaryCurrency: { type: String, default: 'INR' },
    salaryPeriod: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    benefits: [String],
    applicationDeadline: Date,
    status: { type: String, enum: ['active', 'paused', 'closed', 'draft'], default: 'active' },
    applicantsCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

JobSchema.index({ title: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model('Job', JobSchema);
