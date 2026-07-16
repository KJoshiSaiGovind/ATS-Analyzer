import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { AuthTab } from '../types';
import { api } from '../api';

interface AuthPageProps {
  onNavigateToDashboard: (transitionType: 'push' | 'none') => void;
  tab: AuthTab;
  setTab: (tab: AuthTab) => void;
}

export default function AuthPage({ onNavigateToDashboard, tab, setTab }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields
  const [signInEmail, setSignInEmail] = useState('you@company.com');
  const [signInPassword, setSignInPassword] = useState('password123');
  
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password strength checker
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length > 5) score++;
    if (pwd.length > 8 && /[A-Z]/.test(pwd)) score++;
    if (pwd.length > 8 && /[0-9]/.test(pwd)) score++;
    if (pwd.length > 8 && /[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getPasswordStrength(signUpPassword);
  const isMatching = signUpPassword.length > 0 && signUpPassword === confirmPassword;

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      const data = await api.request('/auth/login', 'POST', { email: signInEmail, password: signInPassword });
      api.setToken(data.access_token);
      onNavigateToDashboard('none');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMatching) {
      setErrorMsg('Passwords do not match');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    try {
      await api.request('/auth/register', 'POST', {
        full_name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        role: 'candidate'
      });
      const data = await api.request('/auth/login', 'POST', { email: signUpEmail, password: signUpPassword });
      api.setToken(data.access_token);
      onNavigateToDashboard('push');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-[500px] px-4 md:px-0 py-16">
      <div className="glass-panel bg-surface-container/80 rounded-xl border border-surface-bright shadow-2xl p-8 md:p-[48px] w-full">
        {/* Segmented Toggle */}
        <div className="flex p-1 bg-surface-container-highest rounded-full mb-8 relative">
          <button
            id="tab-signin"
            onClick={() => setTab('signin')}
            className={`flex-1 py-2 font-label text-sm rounded-full transition-all duration-300 relative z-10 ${
              tab === 'signin'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Sign in
          </button>
          <button
            id="tab-signup"
            onClick={() => setTab('signup')}
            className={`flex-1 py-2 font-label text-sm rounded-full transition-all duration-300 relative z-10 ${
              tab === 'signup'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Create account
          </button>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm font-label">
            {errorMsg}
          </div>
        )}

        {/* Sign In Form */}
        {tab === 'signin' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            id="form-signin"
          >
            <div className="mb-8">
              <h1 className="font-display text-4xl font-bold text-on-surface mb-2">Welcome back</h1>
              <p className="font-sans text-lg text-on-surface-variant">Sign in to your Meridian workspace.</p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToDashboard('none')}
              className="w-full h-[56px] flex items-center justify-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-lg hover:bg-surface-bright transition-all mb-8 active:scale-[0.98] duration-200 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span className="font-label text-sm text-on-surface">Continue with Google</span>
            </button>

            <div className="relative flex items-center mb-8">
              <div className="flex-grow border-t border-outline-variant"></div>
              <span className="flex-shrink-0 mx-4 text-on-surface-variant font-label text-sm">OR</span>
              <div className="flex-grow border-t border-outline-variant"></div>
            </div>

            <form onSubmit={handleSignInSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label text-sm text-on-surface">Email address</label>
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="h-[56px] px-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder-on-surface-variant outline-none transition-all font-sans"
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label text-sm text-on-surface">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full h-[56px] px-4 pr-12 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder-on-surface-variant outline-none transition-all font-sans"
                    placeholder="Your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[58px] mt-2 bg-primary-container text-on-primary-container font-label text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-primary hover:text-on-primary transition-all active:scale-[0.98] duration-200 cursor-pointer font-bold disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <p className="text-center mt-8 font-sans text-sm text-on-surface-variant">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setTab('signup')}
                className="text-tertiary hover:text-tertiary-fixed transition-colors font-label font-bold cursor-pointer"
              >
                Sign up free
              </button>
            </p>
          </motion.div>
        )}

        {/* Create Account Form */}
        {tab === 'signup' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            id="form-signup"
          >
            <div className="mb-8">
              <h1 className="font-display text-4xl font-bold text-on-surface mb-2">Get started free</h1>
              <p className="font-sans text-lg text-on-surface-variant">No credit card required. Cancel anytime.</p>
            </div>

            <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label text-sm text-on-surface">Full Name</label>
                <input
                  type="text"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  className="h-[56px] px-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder-on-surface-variant outline-none transition-all font-sans"
                  placeholder="Jane Doe"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label text-sm text-on-surface">Work Email</label>
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  className="h-[56px] px-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder-on-surface-variant outline-none transition-all font-sans"
                  placeholder="jane@company.com"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label text-sm text-on-surface">Password</label>
                <input
                  type="password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className="h-[56px] px-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder-on-surface-variant outline-none transition-all font-sans"
                  placeholder="Create a strong password"
                  required
                />

                {/* Password Strength Indicators */}
                <div className="flex gap-1 mt-1 h-1.5 w-full">
                  {[1, 2, 3, 4].map((index) => {
                    const colors = ['bg-error', 'bg-tertiary-container', 'bg-tertiary', 'bg-primary'];
                    const activeColor = strength >= index ? colors[strength - 1] : 'bg-surface-container-highest';
                    return (
                      <div
                        key={index}
                        className={`flex-1 rounded-full transition-colors duration-300 ${activeColor}`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-label text-sm text-on-surface">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-[56px] px-4 pr-12 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder-on-surface-variant outline-none transition-all font-sans"
                    placeholder="Repeat password"
                    required
                  />
                  {confirmPassword.length > 0 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                      {isMatching ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <XCircle className="w-5 h-5 text-error" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[58px] mt-4 bg-primary-container text-on-primary-container font-label text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-primary hover:text-on-primary transition-all active:scale-[0.98] duration-200 cursor-pointer font-bold disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>

              <p className="text-center mt-4 font-label text-xs text-on-surface-variant leading-relaxed">
                By creating an account, you agree to our{' '}
                <a href="#" className="underline hover:text-on-surface transition-all">
                  Terms
                </a>{' '}
                and{' '}
                <a href="#" className="underline hover:text-on-surface transition-all">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
