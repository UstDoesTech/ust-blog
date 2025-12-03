import React, { useState, useEffect } from 'react';
import { User, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

// --- Game Configuration ---

type Role = 'Intern' | 'Manager' | 'SysAdmin';
type Asset = 'Cafeteria Menu' | 'Q3 Salaries' | 'Server Logs';

const ROLES: Role[] = ['Intern', 'Manager', 'SysAdmin'];
const ASSETS: Asset[] = ['Cafeteria Menu', 'Q3 Salaries', 'Server Logs'];

// Access Rules
// SysAdmin: All
// Manager: Menu, Salaries
// Intern: Menu
const canAccess = (role: Role, asset: Asset): boolean => {
  if (role === 'SysAdmin') return true;
  if (role === 'Manager') return asset === 'Cafeteria Menu' || asset === 'Q3 Salaries';
  if (role === 'Intern') return asset === 'Cafeteria Menu';
  return false;
};

export default function DataBouncer() {
  const [score, setScore] = useState(0);
  const [currentRole, setCurrentRole] = useState<Role>('Intern');
  const [currentAsset, setCurrentAsset] = useState<Asset>('Cafeteria Menu');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [characterId, setCharacterId] = useState(1); // To force avatar refresh if we were using real images

  // Initialize first turn
  useEffect(() => {
    nextTurn();
  }, []);

  const nextTurn = () => {
    const randomRole = ROLES[Math.floor(Math.random() * ROLES.length)];
    const randomAsset = ASSETS[Math.floor(Math.random() * ASSETS.length)];
    setCurrentRole(randomRole);
    setCurrentAsset(randomAsset);
    setCharacterId(prev => prev + 1);
  };

  const handleDecision = (grant: boolean) => {
    const allowed = canAccess(currentRole, currentAsset);
    const isCorrect = grant === allowed;

    if (isCorrect) {
      setScore(s => s + 10);
      setFeedback({ type: 'success', message: 'Correct Decision!' });
      setTimeout(() => {
        setFeedback(null);
        nextTurn();
      }, 800);
    } else {
      setScore(s => s - 10);
      setFeedback({ type: 'error', message: 'Violation! Incorrect Access Control.' });
      setTimeout(() => {
        setFeedback(null);
        nextTurn();
      }, 1500); // Longer penalty pause
    }
  };

  // Visual helpers
  const getRoleColor = (role: Role) => {
    switch (role) {
      case 'SysAdmin': return 'bg-purple-600';
      case 'Manager': return 'bg-blue-600';
      case 'Intern': return 'bg-green-600';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-slate-100 rounded-xl shadow-xl font-sans text-slate-900">
      
      {/* Header / Scoreboard */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center gap-2">
          <Shield className="text-blue-600 w-8 h-8" />
          <h1 className="text-2xl font-bold text-slate-800">DATA BOUNCER</h1>
        </div>
        <div className="text-xl font-mono font-bold">
          Score: <span className={score >= 0 ? 'text-green-600' : 'text-red-600'}>{score}</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex flex-col items-center relative min-h-[400px]">
        
        {/* Feedback Overlay */}
        {feedback && (
          <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl animate-in fade-in zoom-in duration-200`}>
            {feedback.type === 'success' ? (
              <CheckCircle className="w-24 h-24 text-green-500 mb-4" />
            ) : (
              <AlertTriangle className="w-24 h-24 text-red-500 mb-4" />
            )}
            <h2 className={`text-3xl font-black uppercase ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {feedback.type === 'success' ? 'Good Job' : 'Violation!'}
            </h2>
            <p className="text-slate-600 mt-2 font-medium">{feedback.message}</p>
          </div>
        )}

        {/* Character / ID Card */}
        <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl border-2 border-slate-300 overflow-hidden flex flex-col transform transition-all hover:scale-105">
          {/* ID Header */}
          <div className={`${getRoleColor(currentRole)} p-4 text-white text-center`}>
            <div className="uppercase tracking-widest text-xs font-bold opacity-80">Employee ID</div>
            <div className="text-2xl font-black uppercase mt-1">{currentRole}</div>
          </div>

          {/* ID Body */}
          <div className="flex-1 p-6 flex flex-col items-center bg-slate-50">
            <div className="w-24 h-24 bg-slate-200 rounded-full mb-6 flex items-center justify-center border-4 border-white shadow-md">
              <User className="w-12 h-12 text-slate-400" />
            </div>
            
            <div className="w-full bg-white p-4 rounded-lg border border-slate-200 shadow-inner text-center">
              <div className="text-xs text-slate-500 uppercase font-bold mb-1">Requesting Access To</div>
              <div className="text-lg font-bold text-slate-800 leading-tight">
                {currentAsset}
              </div>
            </div>

            {/* Rules Hint (Optional, maybe remove for difficulty?) */}
            <div className="mt-auto text-xs text-slate-400 text-center">
              Verifying permissions...
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-6 mt-8 w-full max-w-md">
          <button
            onClick={() => handleDecision(false)}
            disabled={!!feedback}
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-4 rounded-xl font-black text-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <XCircle className="w-6 h-6" /> DENY
          </button>
          
          <button
            onClick={() => handleDecision(true)}
            disabled={!!feedback}
            className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-4 rounded-xl font-black text-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-6 h-6" /> GRANT
          </button>
        </div>

      </div>

      {/* Rules Reference */}
      <div className="mt-12 bg-slate-200 p-4 rounded-lg text-sm text-slate-600">
        <h3 className="font-bold mb-2 uppercase text-xs tracking-wider text-slate-500">Access Protocols</h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <li className="bg-white p-2 rounded border border-slate-300">
            <span className="font-bold text-purple-600">SysAdmin:</span> All Access
          </li>
          <li className="bg-white p-2 rounded border border-slate-300">
            <span className="font-bold text-blue-600">Manager:</span> Menu & Salaries
          </li>
          <li className="bg-white p-2 rounded border border-slate-300">
            <span className="font-bold text-green-600">Intern:</span> Menu Only
          </li>
        </ul>
      </div>

    </div>
  );
}
