const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coverLetter: String,
    resumeUrl: String,
    resumeFilename: String,
    status: {
      type: String,
      enum: ['pending', 'viewed', 'shortlisted', 'interview', 'offer', 'rejected', 'withdrawn'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        note: String,
      },
    ],
    atsScore: Number,
    employerNotes: String,
    interviewDate: Date,
  },
  { timestamps: true }
);

ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
