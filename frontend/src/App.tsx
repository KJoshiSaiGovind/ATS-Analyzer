import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import AuthPage from './components/AuthPage';
import DashboardPage from './components/DashboardPage';
import { Screen, AuthTab } from './types';

export default function App() {
  const [screen, setScreen] = useState<Screen>('auth');
  const [authTab, setAuthTab] = useState<AuthTab>('signin');
  const [transitionType, setTransitionType] = useState<'push' | 'none'>('none');

  const handleNavigateToDashboard = (type: 'push' | 'none') => {
    setTransitionType(type);
    setScreen('dashboard');
  };

  const handleLogout = () => {
    setTransitionType('none');
    setAuthTab('signin');
    setScreen('auth');
  };

  return (
    <div className="min-h-screen bg-[#09122b] text-on-background relative overflow-x-hidden flex flex-col justify-start">
      
      {/* Background decorative ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[30%] -left-[20%] w-[80%] h-[80%] rounded-full bg-surface-container blur-[150px] opacity-40" />
        <div className="absolute -bottom-[30%] -right-[20%] w-[80%] h-[80%] rounded-full bg-surface-container-lowest blur-[150px] opacity-50" />
      </div>

      <AnimatePresence mode="wait">
        {screen === 'auth' ? (
          <motion.div
            key="auth"
            initial={transitionType === 'push' ? { x: '-100%', opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            exit={transitionType === 'push' ? { x: '-100%', opacity: 0 } : false}
            transition={{ type: 'spring', damping: 28, stiffness: 150 }}
            className="w-full min-h-screen flex justify-center items-center relative z-10"
          >
            <AuthPage
              onNavigateToDashboard={handleNavigateToDashboard}
              tab={authTab}
              setTab={setAuthTab}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={transitionType === 'push' ? { x: '100%', opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            exit={transitionType === 'push' ? { x: '100%', opacity: 0 } : false}
            transition={{ type: 'spring', damping: 28, stiffness: 150 }}
            className="w-full relative z-10 min-h-screen flex flex-col"
          >
            <DashboardPage onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
