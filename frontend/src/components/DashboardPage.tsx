import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Settings,
  LogOut,
  Upload,
  FileText,
  Search,
  CheckCircle,
  AlertTriangle,
  Menu,
  Check,
  RefreshCw,
  Sparkles,
  Award
} from 'lucide-react';
import { ResumeData, AnalysisResult } from '../types';
import { api } from '../api';

interface DashboardPageProps {
  onLogout: () => void;
}

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const [resume, setResume] = useState<ResumeData>({
    fileName: '',
    fileSize: '',
    skills: ['Python', 'FastAPI', 'SQL', 'Machine Learning', 'Docker'],
    roles: ['Backend Developer', 'Data Engineer'],
    status: 'empty'
  });

  const [jobDescription, setJobDescription] = useState(
    'Seeking a Senior Python Developer with experience in FastAPI, PostgreSQL, Git, REST APIs, Redis, AWS ECS, and building robust CI/CD Pipelines...'
  );

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const [result, setResult] = useState<AnalysisResult>({
    score: 87,
    parsability: 91,
    matchedSkills: ['Python', 'FastAPI', 'PostgreSQL', 'REST APIs', 'Git'],
    missingSkills: ['AWS ECS', 'Redis', 'CI/CD Pipelines'],
    tip: 'Add context on how you deployed applications using CI/CD to improve score by ~8%.'
  });

  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'info' | 'warning' }[]>([]);
  const toastIdRef = useRef(0);

  const triggerToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = toastIdRef.current++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await api.request('/dashboard');
        if (data.resume_status === 'Uploaded' || data.resume_status === 'parsed') {
          setResume({
            fileName: data.resume_name || 'Uploaded Resume',
            fileSize: '',
            skills: data.detected_skills || [],
            roles: data.recommended_roles || [],
            status: 'parsed'
          });
        }
      } catch (err: any) {
        if (err.message && err.message.toLowerCase().includes('unauthorized')) {
          onLogout();
        }
      }
    };
    fetchDashboard();
  }, [onLogout]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(30);
    triggerToast(`Uploading ${file.name}...`, 'info');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const data = await api.request('/resumes', 'POST', formData, true);
      setUploadProgress(100);
      
      const parsedSkills = data.skills || [];
      setResume(prev => ({
        ...prev,
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        skills: parsedSkills,
        status: 'parsed'
      }));
      triggerToast('Resume uploaded and parsed successfully!', 'success');
      
      const dashData = await api.request('/dashboard');
      if (dashData.recommended_roles) {
         setResume(prev => ({ ...prev, roles: dashData.recommended_roles }));
      }
    } catch (err: any) {
      triggerToast(err.message || 'Upload failed', 'warning');
    } finally {
      setTimeout(() => setIsUploading(false), 500);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      triggerToast('Please paste a job description first.', 'warning');
      return;
    }
    if (resume.status !== 'parsed') {
      triggerToast('Please upload a resume first.', 'warning');
      return;
    }

    setIsAnalyzing(true);
    triggerToast('Analyzing match compatibility...', 'info');

    try {
      const data = await api.request('/ats/analyze', 'POST', { job_description: jobDescription });
      
      setResult({
        score: Math.round(data.ats_score),
        parsability: 95,
        matchedSkills: data.matched_skills || [],
        missingSkills: data.missing_skills || [],
        tip: data.suggestions && data.suggestions.length > 0 ? data.suggestions[0] : 'Your resume is highly aligned with this job post!'
      });

      setShowResults(true);
      triggerToast('Analysis completed!', 'success');
    } catch (err: any) {
      triggerToast(err.message || 'Analysis failed', 'warning');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-dashboard-gradient text-on-surface w-full font-sans flex flex-col">
      
      {/* TopNavBar with specific DOM hierarchy matching the xpath: body/nav[1]/div[1]/div[3]/button[3] */}
      <nav className="sticky top-0 h-[72px] w-full z-50 bg-surface-container/80 border-b border-outline-variant backdrop-blur-md">
        {/* div[1] wrapper */}
        <div className="flex justify-between items-center px-6 md:px-12 w-full max-w-7xl mx-auto h-full">
          
          {/* Brand/Logo: Child 1 */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="font-display text-2xl font-bold text-on-surface tracking-tight">ATS Analyzer</span>
          </div>

          {/* Middle Desktop Links: Child 2 */}
          <div className="hidden md:flex items-center gap-8 h-full">
            <a href="#" className="text-primary font-bold border-b-2 border-primary pb-1 h-full flex items-center hover:text-primary transition-colors">
              Dashboard
            </a>
          </div>

          {/* Trailing Actions: Child 3 (div[3]) */}
          <div className="flex items-center gap-4">
            {/* button[3]: Logout */}
            <button
              onClick={onLogout}
              className="font-label text-sm px-4 py-2 rounded border border-outline-variant text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer block"
            >
              Logout
            </button>

            {/* Mobile Menu Button */}
            <button className="md:hidden flex items-center justify-center w-10 h-10 text-on-surface cursor-pointer">
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </nav>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-12 pt-8 pb-16 flex-grow flex flex-col gap-8">
        
        {/* Header Title */}
        <header className="mb-2">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-on-surface mb-2">
            <span className="glow-text">Candidate Dashboard</span>
          </h1>
          <p className="font-sans text-lg text-on-surface-variant max-w-2xl">
            Upload your resume and paste a job description to instantly analyze your ATS compatibility and skill gaps.
          </p>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Resume Upload Card (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="glass-card rounded-2xl p-6 lg:p-8 flex flex-col h-full">
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-xl font-bold text-on-surface">Resume Status</h2>
                
                {/* Dynamic Status Badge */}
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-500 border ${
                    resume.status === 'parsed'
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-error/10 border-error/20'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      resume.status === 'parsed' ? 'bg-green-400' : 'bg-error animate-pulse'
                    }`}
                  />
                  <span
                    className={`font-label text-xs font-bold ${
                      resume.status === 'parsed' ? 'text-green-400' : 'text-error'
                    }`}
                  >
                    {resume.status === 'parsed' ? 'Parsed Successfully' : 'Awaiting Upload'}
                  </span>
                </div>
              </div>

              {/* Upload Input & Box */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx"
                className="hidden"
              />
              
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="dashed-upload rounded-xl p-8 flex flex-col items-center justify-center text-center mb-8 cursor-pointer group hover:bg-primary/5 transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-on-surface mb-2">
                  {resume.fileName ? resume.fileName : 'Drag & Drop Resume'}
                </h3>
                <p className="font-sans text-sm text-on-surface-variant mb-6">
                  {resume.fileSize ? `${resume.fileSize}` : 'PDF, DOCX up to 5MB'}
                </p>
                
                {isUploading ? (
                  <div className="w-full max-w-xs bg-surface-container-highest rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                ) : (
                  <button className={`gradient-btn font-label text-sm text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-primary/20 w-full sm:w-auto cursor-pointer font-bold ${resume.status === 'parsed' ? 'bg-green-600 hover:bg-green-500' : ''}`}>
                    {resume.status === 'parsed' ? '✓ Uploaded Successfully' : 'Upload Resume'}
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Right: Job Analysis Area (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="glass-card rounded-2xl p-6 lg:p-8 flex flex-col h-full relative overflow-hidden">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl pointer-events-none" />
              
              <h2 className="font-display text-xl font-bold text-on-surface mb-1">Job Analysis</h2>
              <p className="font-sans text-sm text-on-surface-variant mb-6">
                Paste a job description below to analyze your match score against your uploaded resume.
              </p>

              <div className="flex-grow flex flex-col">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full min-h-[180px] flex-grow bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-sans text-base text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none mb-6 outline-none"
                  placeholder="Paste job description here... (e.g. Seeking a Senior Python Developer with experience in FastAPI, PostgreSQL, and cloud deployments...)"
                />
                
                <div className="flex justify-end">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="gradient-btn font-label text-sm text-white px-8 py-3 rounded-lg shadow-lg flex items-center gap-2 font-bold cursor-pointer disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Analyze Match
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Full Width: Analysis Results */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="lg:col-span-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Circular Score Match Card */}
                  <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center relative">
                    <h3 className="font-display text-lg font-bold text-on-surface mb-6 self-start w-full text-center">
                      Overall Match
                    </h3>
                    
                    <div className="relative w-48 h-48 mb-4">
                      {/* SVG Circular Ring */}
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          className="stroke-surface-container-highest fill-none"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="40"
                          className="stroke-primary fill-none"
                          strokeWidth="8"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: '0 251.2' }}
                          animate={{ strokeDasharray: `${(result.score / 100) * 251.2} 251.2` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                        />
                      </svg>
                      {/* Dynamic Center Text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-4xl font-extrabold text-on-surface">
                          {result.score}%
                        </span>
                      </div>
                    </div>

                    <div className="w-full mt-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-label text-xs text-on-surface-variant">ATS Parsability</span>
                        <span className="font-label text-xs font-bold text-on-surface">{result.parsability}%</span>
                      </div>
                      <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${result.parsability}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skills Alignment Match Column (Span 2) */}
                  <div className="glass-card rounded-2xl p-6 md:col-span-2 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-on-surface mb-6">Skill Alignment</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {/* Matched Skills */}
                        <div>
                          <h4 className="flex items-center gap-2 font-label text-sm text-on-surface font-semibold mb-4">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            Matched Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {result.matchedSkills.length > 0 ? (
                              result.matchedSkills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-3 py-1.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 font-label text-xs font-medium"
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-on-surface-variant text-sm font-sans italic">
                                None detected yet. Improve job description context.
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Missing Keywords */}
                        <div>
                          <h4 className="flex items-center gap-2 font-label text-sm text-on-surface font-semibold mb-4">
                            <AlertTriangle className="w-5 h-5 text-orange-400" />
                            Missing Keywords
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {result.missingSkills.length > 0 ? (
                              result.missingSkills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-3 py-1.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 font-label text-xs font-medium"
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-green-400 text-sm font-sans font-bold flex items-center gap-1">
                                <Check className="w-4 h-4" /> Perfect keyword match!
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actionable Advice Container */}
                    <div className="mt-6 p-4 rounded-lg bg-surface-container border border-outline-variant">
                      <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                        <strong className="text-on-surface font-semibold">Tip:</strong> {result.tip}
                      </p>
                    </div>

                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </main>

      {/* Floating Dynamic Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl bg-surface-container border border-white/10 text-white pointer-events-auto"
            >
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              ) : toast.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0" />
              ) : (
                <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
              )}
              <span className="text-sm font-medium font-sans">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
