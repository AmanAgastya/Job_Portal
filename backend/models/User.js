const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['candidate', 'recruiter', 'admin'], default: 'candidate' },
    // Candidate profile
    profile: {
      headline: String,
      bio: String,
      location: String,
      phone: String,
      website: String,
      linkedin: String,
      github: String,
      skills: [String],
      experience: [
        {
          title: String,
          company: String,
          location: String,
          startDate: Date,
          endDate: Date,
          current: Boolean,
          description: String,
        },
      ],
      education: [
        {
          degree: String,
          institution: String,
          field: String,
          startYear: Number,
          endYear: Number,
          grade: String,
        },
      ],
      resume: { url: String, filename: String, uploadedAt: Date },
      profilePicture: String,
    },
    // Recruiter/Company profile
    company: {
      name: String,
      website: String,
      industry: String,
      size: String,
      location: String,
      description: String,
      logo: String,
      founded: Number,
    },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    lastLogin: Date,
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
