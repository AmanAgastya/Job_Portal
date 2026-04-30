const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/ats_temp');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `ats_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Unsupported file format'));
  },
});

// Extract text from uploaded file
async function extractText(filePath, ext) {
  try {
    if (ext === '.pdf') {
      const pdfParse = require('pdf-parse');
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (ext === '.docx') {
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else if (ext === '.doc' || ext === '.txt' || ext === '.rtf') {
      return fs.readFileSync(filePath, 'utf-8');
    }
    return '';
  } catch (e) {
    return '';
  }
}

// ATS Scoring Engine
function analyzeResume(text, jobDescription = '') {
  const lowerText = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // --- Section Detection ---
  const sections = {
    contact: /email|phone|linkedin|github|address|contact/i.test(text),
    summary: /summary|objective|profile|about me/i.test(text),
    experience: /experience|work history|employment|worked at|job history/i.test(text),
    education: /education|degree|university|college|bachelor|master|phd|b\.tech|m\.tech/i.test(text),
    skills: /skills|technologies|proficiencies|expertise|competencies/i.test(text),
    projects: /projects|portfolio|works/i.test(text),
    certifications: /certif|license|award/i.test(text),
  };

  // --- Keyword Analysis ---
  const techKeywords = [
    'javascript','python','java','react','node','express','mongodb','sql','html','css',
    'typescript','git','docker','aws','azure','linux','rest','api','agile','scrum',
    'redux','graphql','kubernetes','ci/cd','machine learning','data analysis',
    'c++','c#','.net','php','ruby','swift','kotlin','flutter','tensorflow',
    'pytorch','hadoop','spark','kafka','microservices','devops','cloud',
  ];
  const softSkills = [
    'leadership','communication','teamwork','problem solving','analytical',
    'creative','adaptable','time management','collaboration','detail-oriented',
    'project management','critical thinking','interpersonal',
  ];
  const actionVerbs = [
    'developed','designed','implemented','led','managed','created','built','optimized',
    'improved','delivered','achieved','increased','reduced','launched','collaborated',
    'architected','maintained','deployed','integrated','automated',
  ];

  const foundTech = techKeywords.filter(k => lowerText.includes(k));
  const foundSoft = softSkills.filter(k => lowerText.includes(k));
  const foundVerbs = actionVerbs.filter(k => lowerText.includes(k));

  // --- Quantified Achievements ---
  const quantifiedMatches = text.match(/\d+[\+%]?\s*(years?|months?|projects?|people|team|users?|clients?|%|million|thousand|k\b)/gi) || [];

  // --- Format Checks ---
  const hasEmail = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(\+?\d[\d\s\-]{8,14}\d)/.test(text);
  const hasLinkedIn = /linkedin/i.test(text);
  const hasGitHub = /github/i.test(text);
  const hasBullets = /[•\-\*▪▸]/.test(text);
  const hasDateRanges = /\d{4}\s*[-–]\s*(\d{4}|present|current)/i.test(text);

  // --- Job Description Matching ---
  let jdMatchScore = 0;
  let jdMatchedKeywords = [];
  let jdMissingKeywords = [];
  if (jobDescription) {
    const jdWords = jobDescription.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const jdKeywords = [...new Set(jdWords)].filter(w =>
      !['the','and','for','with','that','this','have','from','are','will','you'].includes(w)
    );
    const important = jdKeywords.slice(0, 30);
    jdMatchedKeywords = important.filter(k => lowerText.includes(k));
    jdMissingKeywords = important.filter(k => !lowerText.includes(k)).slice(0, 10);
    jdMatchScore = Math.round((jdMatchedKeywords.length / Math.max(important.length, 1)) * 100);
  }

  // --- Score Calculation ---
  let score = 0;
  const breakdown = {};

  // Contact info (10 pts)
  breakdown.contactInfo = hasEmail && hasPhone ? 10 : hasEmail || hasPhone ? 6 : 0;
  score += breakdown.contactInfo;

  // Sections present (20 pts)
  const sectionCount = Object.values(sections).filter(Boolean).length;
  breakdown.sections = Math.min(20, sectionCount * 3);
  score += breakdown.sections;

  // Technical keywords (20 pts)
  breakdown.technicalKeywords = Math.min(20, foundTech.length * 2);
  score += breakdown.technicalKeywords;

  // Soft skills (10 pts)
  breakdown.softSkills = Math.min(10, foundSoft.length * 2);
  score += breakdown.softSkills;

  // Action verbs (10 pts)
  breakdown.actionVerbs = Math.min(10, foundVerbs.length * 1.5);
  score += breakdown.actionVerbs;

  // Quantified achievements (10 pts)
  breakdown.quantifiedAchievements = Math.min(10, quantifiedMatches.length * 2);
  score += breakdown.quantifiedAchievements;

  // Formatting (10 pts)
  breakdown.formatting = (hasBullets ? 4 : 0) + (hasDateRanges ? 3 : 0) + (hasLinkedIn ? 2 : 0) + (hasGitHub ? 1 : 0);
  breakdown.formatting = Math.min(10, breakdown.formatting);
  score += breakdown.formatting;

  // Word count (10 pts)
  breakdown.wordCount = wordCount >= 300 && wordCount <= 800 ? 10 : wordCount > 150 ? 6 : 2;
  score += breakdown.wordCount;

  score = Math.min(100, Math.round(score));

  // --- Grade ---
  const grade = score >= 85 ? 'A+' : score >= 75 ? 'A' : score >= 65 ? 'B+' : score >= 55 ? 'B' : score >= 45 ? 'C' : 'D';

  // --- Suggestions ---
  const suggestions = [];

  if (!hasEmail) suggestions.push({ type: 'critical', text: 'Add your email address — ATS systems require it for contact parsing.' });
  if (!hasPhone) suggestions.push({ type: 'critical', text: 'Include your phone number for recruiter outreach.' });
  if (!sections.summary) suggestions.push({ type: 'important', text: 'Add a professional Summary/Objective section at the top to hook recruiters.' });
  if (!sections.skills) suggestions.push({ type: 'important', text: 'Create a dedicated Skills section with relevant keywords for ATS scanning.' });
  if (!sections.projects) suggestions.push({ type: 'suggested', text: 'Include a Projects section to showcase practical experience.' });
  if (!sections.certifications) suggestions.push({ type: 'suggested', text: 'Add certifications or online courses to strengthen your profile.' });
  if (foundTech.length < 5) suggestions.push({ type: 'important', text: `Expand your technical keywords. Found only ${foundTech.length}. Add more relevant tech stack terms.` });
  if (quantifiedMatches.length === 0) suggestions.push({ type: 'important', text: 'Add numbers to your achievements (e.g., "Improved performance by 30%", "Led a team of 5").' });
  if (!hasBullets) suggestions.push({ type: 'suggested', text: 'Use bullet points (•) for experience descriptions to improve ATS parsing and readability.' });
  if (!hasDateRanges) suggestions.push({ type: 'suggested', text: 'Include date ranges for your experience (e.g., Jan 2022 – Present) for ATS timeline parsing.' });
  if (!hasLinkedIn) suggestions.push({ type: 'suggested', text: 'Add your LinkedIn profile URL to boost credibility.' });
  if (!hasGitHub) suggestions.push({ type: 'suggested', text: 'Include your GitHub profile URL especially for tech roles.' });
  if (foundVerbs.length < 4) suggestions.push({ type: 'important', text: 'Start bullet points with strong action verbs like "Developed", "Led", "Optimized", "Deployed".' });
  if (wordCount < 300) suggestions.push({ type: 'important', text: `Resume is too short (${wordCount} words). Aim for 300–700 words for optimal ATS scoring.` });
  if (wordCount > 1000) suggestions.push({ type: 'suggested', text: `Resume is long (${wordCount} words). Consider trimming to 1 page for entry/mid level roles.` });
  if (jdMissingKeywords.length > 0) {
    suggestions.push({ type: 'important', text: `Missing keywords from job description: ${jdMissingKeywords.join(', ')}. Add these if applicable.` });
  }

  return {
    score,
    grade,
    wordCount,
    breakdown: Object.fromEntries(Object.entries(breakdown).map(([k, v]) => [k, Math.round(v)])),
    sections,
    foundKeywords: { technical: foundTech, soft: foundSoft, actionVerbs: foundVerbs },
    quantifiedAchievements: quantifiedMatches.slice(0, 10),
    contactInfo: { hasEmail, hasPhone, hasLinkedIn, hasGitHub },
    formatting: { hasBullets, hasDateRanges },
    suggestions: suggestions.sort((a, b) => {
      const order = { critical: 0, important: 1, suggested: 2 };
      return order[a.type] - order[b.type];
    }),
    jobDescriptionMatch: jobDescription ? { score: jdMatchScore, matched: jdMatchedKeywords, missing: jdMissingKeywords } : null,
  };
}

// @POST /api/resume/analyze
router.post('/analyze', auth, upload.single('resume'), async (req, res) => {
  let filePath = null;
  try {
    if (!req.file) return res.status(400).json({ message: 'No resume file uploaded' });

    filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const text = await extractText(filePath, ext);

    if (!text || text.trim().length < 50) {
      return res.status(400).json({ message: 'Could not extract text from resume. Please ensure the file is not image-based or corrupted.' });
    }

    const jobDescription = req.body.jobDescription || '';
    const result = analyzeResume(text, jobDescription);

    // Cleanup temp file
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ ...result, filename: req.file.originalname, analyzedAt: new Date() });
  } catch (err) {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
