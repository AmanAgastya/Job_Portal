import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/layout/Navbar';
import { FiUpload, FiFileText, FiCheckCircle, FiAlertCircle, FiInfo, FiArrowRight,
  FiAward, FiTrendingUp } from 'react-icons/fi';

const GRADE_CONFIG = {
  'A+': { color: '#059669', bg: '#d1fae5', label: 'Excellent', emoji: '🏆' },
  'A':  { color: '#2563eb', bg: '#dbeafe', label: 'Very Good', emoji: '⭐' },
  'B+': { color: '#7c3aed', bg: '#ede9fe', label: 'Good', emoji: '👍' },
  'B':  { color: '#d97706', bg: '#fef3c7', label: 'Average', emoji: '📈' },
  'C':  { color: '#ea580c', bg: '#ffedd5', label: 'Below Average', emoji: '⚠️' },
  'D':  { color: '#dc2626', bg: '#fee2e2', label: 'Needs Work', emoji: '🔧' },
};

const BREAKDOWN_LABELS = {
  contactInfo: 'Contact Info',
  sections: 'Resume Sections',
  technicalKeywords: 'Technical Keywords',
  softSkills: 'Soft Skills',
  actionVerbs: 'Action Verbs',
  quantifiedAchievements: 'Quantified Achievements',
  formatting: 'Formatting & Links',
  wordCount: 'Word Count',
};

const BREAKDOWN_MAX = {
  contactInfo: 10, sections: 20, technicalKeywords: 20, softSkills: 10,
  actionVerbs: 10, quantifiedAchievements: 10, formatting: 10, wordCount: 10,
};

export default function ATSCheckerPage() {
  const { user } = useAuth();
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    const allowed = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
    if (!allowed.includes(ext)) { toast.error('Unsupported format. Use PDF, DOCX, DOC, TXT, or RTF'); return; }
    if (f.size > 10 * 1024 * 1024) { toast.error('File too large. Max 10MB'); return; }
    setFile(f);
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) { toast.error('Please upload your resume'); return; }
    if (!user) { toast.error('Please login to use ATS Checker'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      if (jobDescription.trim()) fd.append('jobDescription', jobDescription);
      const { data } = await api.post('/api/resume/analyze', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(data);
      window.scrollTo({ top: document.getElementById('ats-results')?.offsetTop - 80, behavior: 'smooth' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const gradeConfig = result ? (GRADE_CONFIG[result.grade] || GRADE_CONFIG['D']) : null;
  const scoreColor = result ? (result.score >= 75 ? '#059669' : result.score >= 55 ? '#d97706' : '#dc2626') : '#2563eb';

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #4f46e5)', padding: '56px 0', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <div style={{ fontSize: 56, marginBottom: 16 }}>🤖</div>
          <h1 style={{ fontSize: 38, fontWeight: 900, marginBottom: 12 }}>ATS Resume Checker</h1>
          <p style={{ fontSize: 17, opacity: 0.9, maxWidth: 580, margin: '0 auto 20px' }}>
            Instantly analyze your resume for ATS compatibility. Get a score, identify missing keywords, and receive actionable suggestions to land more interviews.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', fontSize: 14, opacity: 0.85 }}>
            {['PDF, DOCX, DOC, TXT, RTF', 'Instant Analysis', 'Job Description Matching', 'Improvement Tips'].map(f => (
              <span key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiCheckCircle size={14} /> {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 32, maxWidth: result ? '100%' : 720, margin: '0 auto' }}>

          {/* Upload Panel */}
          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-body">
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Upload Your Resume</h2>
                <p style={{ color: 'var(--gray)', fontSize: 14, marginBottom: 20 }}>All formats accepted: PDF, DOCX, DOC, TXT, RTF</p>

                <div
                  className={`upload-zone ${dragOver ? 'dragover' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  style={{ marginBottom: 16 }}
                >
                  <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt,.rtf" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
                  {file ? (
                    <div>
                      <div style={{ fontSize: 44, marginBottom: 8 }}>📄</div>
                      <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 16 }}>{file.name}</p>
                      <p style={{ fontSize: 13, color: 'var(--gray)', marginTop: 4 }}>{(file.size / 1024).toFixed(0)} KB • Click to change</p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>📤</div>
                      <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Drag & Drop or Click to Upload</p>
                      <p style={{ color: 'var(--gray)', fontSize: 13 }}>Supported: PDF, DOCX, DOC, TXT, RTF • Max 10MB</p>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FiFileText size={15} /> Job Description (Optional but Recommended)
                  </label>
                  <textarea
                    className="form-control" rows={5} value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here to get keyword matching analysis and see which required skills are missing from your resume..."
                  />
                  <p style={{ fontSize: 12, color: 'var(--gray)', marginTop: 4 }}>Adding a job description enables ATS keyword match scoring</p>
                </div>

                {!user && (
                  <div style={{ padding: '12px 16px', background: '#fef3c7', borderRadius: 'var(--radius-sm)', border: '1px solid #fbbf24', marginBottom: 16, fontSize: 14 }}>
                    ⚠️ <Link to="/candidate-login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link> to use the ATS checker
                  </div>
                )}

                <button onClick={handleAnalyze} disabled={loading || !file || !user} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  {loading ? (
                    <><span className="spinner" />Analyzing Resume...</>
                  ) : (
                    <><FiAward />Analyze Resume</>
                  )}
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="card">
              <div className="card-body">
                <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 16 }}>💡 ATS Tips for Better Scores</h3>
                {[
                  'Use standard section headings like "Experience", "Education", "Skills"',
                  'Mirror keywords directly from the job description',
                  'Quantify achievements: "Led team of 5", "Improved speed by 40%"',
                  'Use bullet points starting with strong action verbs',
                  'Include both full names and acronyms: "Search Engine Optimization (SEO)"',
                  'Keep formatting simple — avoid tables, columns, graphics in ATS resume',
                  'Save as PDF (not image-based PDF) for best text extraction',
                ].map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 13 }}>
                    <span style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: 2 }}>✓</span>
                    <span style={{ color: 'var(--dark-3)' }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          {result && (
            <div id="ats-results">
              {/* Score Card */}
              <div className="card" style={{ marginBottom: 20, background: `linear-gradient(135deg, ${gradeConfig.bg}, white)`, border: `2px solid ${gradeConfig.color}20` }}>
                <div className="card-body" style={{ textAlign: 'center', padding: '32px 24px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.1em' }}>ATS Score</div>
                  <div style={{ width: 150, height: 150, borderRadius: '50%', background: `conic-gradient(${scoreColor} ${result.score * 3.6}deg, #e2e8f0 0deg)`, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ width: 118, height: 118, borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: 38, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{result.score}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray)' }}>out of 100</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{gradeConfig.emoji}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: gradeConfig.color }}>{gradeConfig.label}</div>
                  <div style={{ fontSize: 14, color: 'var(--gray)', marginTop: 6 }}>
                    Grade: <strong style={{ color: gradeConfig.color }}>{result.grade}</strong> • {result.wordCount} words
                  </div>
                  {result.filename && <div style={{ fontSize: 12, color: 'var(--gray-light)', marginTop: 8 }}>📄 {result.filename}</div>}
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-body">
                  <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>📊 Score Breakdown</h3>
                  {Object.entries(result.breakdown || {}).map(([key, val]) => {
                    const max = BREAKDOWN_MAX[key] || 10;
                    const pct = Math.round((val / max) * 100);
                    const barColor = pct >= 70 ? 'var(--secondary)' : pct >= 40 ? 'var(--accent)' : 'var(--danger)';
                    return (
                      <div key={key} style={{ marginBottom: 14 }}>
                        <div className="flex-between" style={{ marginBottom: 5 }}>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{BREAKDOWN_LABELS[key] || key}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: barColor }}>{val}/{max}</span>
                        </div>
                        <div className="ats-bar">
                          <div className="ats-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* JD Match */}
              {result.jobDescriptionMatch && (
                <div className="card" style={{ marginBottom: 20 }}>
                  <div className="card-body">
                    <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>🎯 Job Description Match</h3>
                    <div style={{ display: 'flex', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: 32, fontWeight: 900, color: result.jobDescriptionMatch.score >= 60 ? 'var(--secondary)' : 'var(--danger)' }}>
                          {result.jobDescriptionMatch.score}%
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--gray)' }}>Keyword Match</div>
                      </div>
                    </div>
                    {result.jobDescriptionMatch.matched?.length > 0 && (
                      <div style={{ marginBottom: 14 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--secondary)', marginBottom: 8 }}>✅ Matched Keywords ({result.jobDescriptionMatch.matched.length})</p>
                        <div>{result.jobDescriptionMatch.matched.map(k => <span key={k} className="tag" style={{ background: '#d1fae5', color: '#065f46', fontSize: 12 }}>{k}</span>)}</div>
                      </div>
                    )}
                    {result.jobDescriptionMatch.missing?.length > 0 && (
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)', marginBottom: 8 }}>❌ Missing Keywords ({result.jobDescriptionMatch.missing.length})</p>
                        <div>{result.jobDescriptionMatch.missing.map(k => <span key={k} className="tag" style={{ background: '#fee2e2', color: '#991b1b', fontSize: 12 }}>{k}</span>)}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Keywords Found */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-body">
                  <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>🔍 Keywords Detected</h3>
                  {result.foundKeywords?.technical?.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>💻 Technical Skills ({result.foundKeywords.technical.length})</p>
                      <div>{result.foundKeywords.technical.map(k => <span key={k} className="tag">{k}</span>)}</div>
                    </div>
                  )}
                  {result.foundKeywords?.soft?.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>🤝 Soft Skills ({result.foundKeywords.soft.length})</p>
                      <div>{result.foundKeywords.soft.map(k => <span key={k} className="tag" style={{ background: '#fef3c7', color: '#92400e' }}>{k}</span>)}</div>
                    </div>
                  )}
                  {result.foundKeywords?.actionVerbs?.length > 0 && (
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>⚡ Action Verbs ({result.foundKeywords.actionVerbs.length})</p>
                      <div>{result.foundKeywords.actionVerbs.map(k => <span key={k} className="tag" style={{ background: '#ede9fe', color: '#5b21b6' }}>{k}</span>)}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact & Sections */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-body">
                  <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>📋 Resume Checklist</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { label: 'Email Address', ok: result.contactInfo?.hasEmail },
                      { label: 'Phone Number', ok: result.contactInfo?.hasPhone },
                      { label: 'LinkedIn Profile', ok: result.contactInfo?.hasLinkedIn },
                      { label: 'GitHub Profile', ok: result.contactInfo?.hasGitHub },
                      { label: 'Professional Summary', ok: result.sections?.summary },
                      { label: 'Work Experience', ok: result.sections?.experience },
                      { label: 'Education', ok: result.sections?.education },
                      { label: 'Skills Section', ok: result.sections?.skills },
                      { label: 'Projects Section', ok: result.sections?.projects },
                      { label: 'Certifications', ok: result.sections?.certifications },
                      { label: 'Bullet Points Used', ok: result.formatting?.hasBullets },
                      { label: 'Date Ranges Present', ok: result.formatting?.hasDateRanges },
                    ].map(({ label, ok }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '6px 0' }}>
                        {ok
                          ? <FiCheckCircle size={16} color="var(--secondary)" />
                          : <FiAlertCircle size={16} color="var(--gray-light)" />
                        }
                        <span style={{ color: ok ? 'var(--dark)' : 'var(--gray)' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {result.suggestions?.length > 0 && (
                <div className="card" style={{ marginBottom: 20 }}>
                  <div className="card-body">
                    <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>
                      💡 Improvement Suggestions ({result.suggestions.length})
                    </h3>
                    {result.suggestions.map((s, i) => (
                      <div key={i} className={`suggestion-item suggestion-${s.type}`}>
                        <div style={{ flexShrink: 0, marginTop: 2 }}>
                          {s.type === 'critical' ? '🔴' : s.type === 'important' ? '🟡' : '🟢'}
                        </div>
                        <div>
                          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--gray)', display: 'block', marginBottom: 3 }}>
                            {s.type}
                          </span>
                          <p style={{ fontSize: 13, lineHeight: 1.6 }}>{s.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantified Achievements */}
              {result.quantifiedAchievements?.length > 0 && (
                <div className="card" style={{ marginBottom: 20 }}>
                  <div className="card-body">
                    <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 16 }}>📈 Quantified Achievements Found</h3>
                    <div>{result.quantifiedAchievements.map((a, i) => (
                      <span key={i} className="tag" style={{ background: '#d1fae5', color: '#065f46', margin: 3 }}>{a}</span>
                    ))}</div>
                  </div>
                </div>
              )}

              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <button onClick={() => { setResult(null); setFile(null); setJobDescription(''); }} className="btn btn-outline" style={{ marginRight: 12 }}>
                  Analyze Another Resume
                </button>
                <Link to="/jobs" className="btn btn-primary">
                  Browse Jobs <FiArrowRight />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
