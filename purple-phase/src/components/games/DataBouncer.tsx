import React, { useState, useEffect, useRef } from 'react';
import { Shield, Heart, User, Database, X, Check, Siren, Music, Disc, AlertTriangle, Zap } from 'lucide-react';

// --- Game Data & Rules ---

const ROLES: Record<string, { color: string; access: string[]; icon: string }> = {
  'Marketing Intern': { 
    color: 'text-pink-400', 
    access: ['Social Media', 'Ad Assets', 'Email Newsletter'],
    icon: '📱'
  },
  'HR Manager': { 
    color: 'text-yellow-400', 
    access: ['Payroll Table', 'Employee Records', 'Hiring Portal'],
    icon: '📋'
  },
  'SysAdmin': { 
    color: 'text-green-400', 
    access: ['Server Logs', 'Database Config', 'Firewall Settings', 'User Permissions'],
    icon: '💻'
  },
  'Finance Director': { 
    color: 'text-blue-400', 
    access: ['Bank Accounts', 'Quarterly Reports', 'Budget Sheet'],
    icon: '📈'
  },
  'Guest User': {
    color: 'text-slate-400',
    access: ['Public Website', 'Guest WiFi', 'Cafeteria Menu'],
    icon: '👤'
  }
};

const ALL_RESOURCES = [
  ...new Set(Object.values(ROLES).flatMap(r => r.access))
];

// Hacker names or traits
const HACKER_TRAITS = ['glitched_text', 'suspicious_id', 'shifty_eyes'];

// --- Components ---

const DataBouncerClub = () => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameover
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [timeLeft, setTimeLeft] = useState(10); // Time per person
  const [currentPerson, setCurrentPerson] = useState<any>(null);
  const [feedback, setFeedback] = useState<string | null>(null); // 'granted', 'denied', 'missed'
  const [highScore, setHighScore] = useState(0);
  const [difficulty, setDifficulty] = useState(1);

  // Audio/Visual effects state
  const [bgPulse, setBgPulse] = useState(false);

  // --- Game Logic ---

  const generatePerson = () => {
    const roleKeys = Object.keys(ROLES);
    const roleName = roleKeys[Math.floor(Math.random() * roleKeys.length)];
    const roleData = ROLES[roleName];
    
    // Decision: Should this be a valid request?
    // As difficulty increases, valid requests become trickier or hackers more frequent
    const isValidScenario = Math.random() > 0.5;
    const isHacker = Math.random() > 0.85; // 15% chance of being a hacker regardless of logic

    let requestedResource;
    
    if (isValidScenario && !isHacker) {
      // Pick a valid resource for this role
      requestedResource = roleData.access[Math.floor(Math.random() * roleData.access.length)];
    } else {
      // Pick an INVALID resource (Privilege Escalation attempt)
      // Get resources NOT in this role's access
      const invalidResources = ALL_RESOURCES.filter(r => !roleData.access.includes(r));
      requestedResource = invalidResources[Math.floor(Math.random() * invalidResources.length)];
    }

    // Hacker Override: Hackers might have valid permissions but are still "bad actors" (Fake IDs)
    // Or they simulate a valid role but have a "glitch" visual trait.
    // For this educational game, we'll treat Hackers as always DENY.
    // A Hacker might present a "Valid" card logic-wise, but visual cues give them away.
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: roleName, // The Role IS their identity in this metaphor
      roleData,
      resource: requestedResource,
      isHacker: isHacker,
      // Logic: It's valid ONLY if role matches resource AND not a hacker
      shouldGrant: isValidScenario && !isHacker
    };
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setHearts(3);
    setDifficulty(1);
    nextTurn();
  };

  const nextTurn = () => {
    setFeedback(null);
    setTimeLeft(Math.max(3, 10 - (difficulty * 0.5))); // Speed up over time
    setCurrentPerson(generatePerson());
    setBgPulse(prev => !prev); // Beat of the music
  };

  // Timer Effect
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          handleTimeout();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameState, currentPerson]);

  const handleTimeout = () => {
    handleDecision(null); // Treat as a miss
  };

  const handleDecision = (granted: boolean | null) => {
    if (!currentPerson) return;

    let success = false;
    let message = "";

    if (granted === null) {
      // Timeout
      success = false;
      message = "TOO SLOW!";
    } else if (granted === currentPerson.shouldGrant) {
      success = true;
      message = granted ? "ACCESS GRANTED" : "ACCESS DENIED";
    } else {
      success = false;
      if (currentPerson.isHacker && granted) {
        message = "SECURITY BREACH: FAKE ID!";
      } else if (granted) {
        message = "VIOLATION: LEAST PRIVILEGE!";
      } else {
        message = "ERROR: VALID USER BLOCKED";
      }
    }

    if (success) {
      setScore(s => s + 100);
      setFeedback('correct');
      if (score > 0 && score % 500 === 0) setDifficulty(d => d + 1);
    } else {
      setHearts(h => {
        const newHearts = h - 1;
        if (newHearts <= 0) setGameState('gameover');
        return newHearts;
      });
      setFeedback('wrong');
    }

    // Brief delay before next person to show feedback
    setTimeout(() => {
      if (hearts > 1 || success) { // Only continue if not game over (logic handled in setter above mainly)
         if (gameState !== 'gameover') nextTurn();
      }
    }, 800);
  };

  // --- Visuals ---

  const renderCard = () => {
    if (!currentPerson) return null;
    
    const { name, roleData, resource, isHacker } = currentPerson;
    
    return (
      <div className={`
        relative w-72 h-96 bg-slate-900 border-4 rounded-xl p-4 flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-transform duration-300
        ${feedback === 'correct' ? 'scale-110 border-green-500' : ''}
        ${feedback === 'wrong' ? 'shake border-red-500' : 'border-purple-500'}
      `}>
        {/* Holographic Sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-lg" />
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xl">
              {roleData.icon}
            </div>
            <span className="text-xs text-slate-400 font-mono">ID VERIFIED</span>
          </div>
          <div className="bg-slate-800 px-2 py-1 rounded text-[10px] text-slate-400 tracking-widest">
            VIP ACCESS
          </div>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center mb-6">
          <div className={`w-24 h-24 bg-slate-800 rounded-full mb-3 overflow-hidden border-2 ${isHacker ? 'border-red-500 animate-pulse' : 'border-slate-600'}`}>
             <img 
               src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentPerson.id}`} 
               alt="avatar" 
               className={`w-full h-full object-cover ${isHacker ? 'opacity-80 mix-blend-luminosity' : ''}`}
             />
          </div>
          <h2 className={`text-xl font-bold uppercase text-center ${roleData.color}`}>
            {name}
          </h2>
          {isHacker && (
             <span className="text-[10px] bg-red-900 text-red-200 px-2 rounded mt-1 animate-pulse">
               ⚠️ METADATA MISMATCH
             </span>
          )}
        </div>

        {/* Request Details */}
        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 flex-1 flex flex-col justify-center">
           <div className="mb-1 text-[10px] text-slate-500 uppercase tracking-widest">Requesting Access To:</div>
           <div className="text-lg text-white font-mono leading-tight break-words">
             {isHacker ? resource.split('').map((c: string, i: number) => Math.random() > 0.8 ? String.fromCharCode(33+Math.random()*50) : c).join('') : resource}
           </div>
           
           <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs">
                {roleData.access.includes(resource) ? (
                  <span className="text-green-500 flex items-center gap-1">
                     <Check size={12} /> Permission Found
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center gap-1">
                     <X size={12} /> No Permission
                  </span>
                )}
              </div>
           </div>
        </div>
      </div>
    );
  };

  // --- Screens ---

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950" />
        
        {/* Neon Sign */}
        <div className="relative z-10 mb-12 text-center group">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-pulse">
            THE DATABASE
          </h1>
          <div className="text-pink-200 tracking-[1em] text-sm mt-2 opacity-80 uppercase">VIP Access Only</div>
        </div>

        <div className="max-w-md w-full bg-slate-900/80 backdrop-blur border border-purple-500/30 p-8 rounded-2xl shadow-2xl z-10">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="text-purple-400" /> Bouncer Instructions
          </h2>
          <ul className="space-y-4 text-slate-300 text-sm mb-8">
            <li className="flex items-start gap-3">
              <span className="bg-purple-900 text-purple-200 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">1</span>
              <div>
                <strong>Least Privilege:</strong> Only grant access if the Role usually needs that data.
                <div className="text-xs text-slate-500 mt-1">e.g., Marketing shouldn't see Payroll.</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-purple-900 text-purple-200 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">2</span>
              <div>
                <strong>Spot Hackers:</strong> Watch for glitches, weird text, or suspicious metadata even if permissions match.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-purple-900 text-purple-200 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">3</span>
              <div>
                <strong>Be Quick:</strong> The line is long. Don't keep VIPs waiting.
              </div>
            </li>
          </ul>
          
          <button 
            onClick={startGame}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl text-lg shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all transform hover:scale-105"
          >
            START SHIFT
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'gameover') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle size={64} className="text-red-500 mb-6 animate-bounce" />
        <h1 className="text-5xl font-bold text-white mb-2">YOU'RE FIRED!</h1>
        <p className="text-xl text-slate-400 mb-8 max-w-lg">
          You let too many unauthorized users into the database. The compliance audit failed.
        </p>
        
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-sm mb-8">
          <div className="text-slate-500 text-xs uppercase tracking-widest mb-1">Final Score</div>
          <div className="text-4xl font-mono font-bold text-purple-400">{score}</div>
        </div>

        <button 
          onClick={() => setGameState('menu')}
          className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-200 transition-colors"
        >
          TRY AGAIN
        </button>
      </div>
    );
  }

  // Playing State
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      <style>{`
        .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }
      `}</style>

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Spotlights */}
         <div className="absolute -top-20 left-1/4 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full mix-blend-screen animate-pulse" />
         <div className="absolute top-1/2 right-0 w-80 h-80 bg-pink-600/10 blur-[80px] rounded-full mix-blend-screen" />
         {/* Grid Floor */}
         <div className="absolute bottom-0 w-full h-1/3 bg-[linear-gradient(to_top,rgba(20,20,40,1),transparent)] z-0" />
      </div>

      {/* Top HUD */}
      <div className="relative z-10 flex justify-between items-center p-4 bg-slate-900/50 backdrop-blur border-b border-slate-800">
        <div className="flex items-center gap-4">
           <div className="flex -space-x-1">
             {[...Array(3)].map((_, i) => (
               <Heart 
                 key={i} 
                 fill={i < hearts ? "#ef4444" : "none"} 
                 className={`w-6 h-6 ${i < hearts ? "text-red-500" : "text-slate-700"}`} 
               />
             ))}
           </div>
           <div className="h-8 w-px bg-slate-700" />
           <div className="text-slate-200 font-mono">
             SCORE: <span className="text-purple-400 font-bold">{score}</span>
           </div>
        </div>
        
        <div className="flex items-center gap-2">
           <span className="text-xs text-slate-400 uppercase tracking-widest hidden sm:inline">Patience</span>
           <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
             <div 
               className={`h-full transition-all duration-100 ease-linear ${timeLeft < 3 ? 'bg-red-500' : 'bg-green-500'}`} 
               style={{ width: `${(timeLeft / 10) * 100}%` }}
             />
           </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-4">
        
        {/* The Queue (Visual only) */}
        <div className="absolute top-12 left-0 w-full flex justify-center opacity-30 pointer-events-none transform scale-75 blur-[1px]">
           <div className="flex gap-4">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="w-48 h-64 bg-slate-800 rounded-lg border border-slate-700" />
             ))}
           </div>
        </div>

        {/* Feedback Text */}
        {feedback && (
          <div className={`absolute top-24 z-50 text-4xl font-black italic tracking-tighter drop-shadow-lg ${feedback === 'correct' ? 'text-green-400 rotate-[-10deg]' : 'text-red-500 rotate-[10deg]'}`}>
            {feedback === 'correct' ? 'ACCESS GRANTED' : 'VIOLATION!'}
          </div>
        )}

        {/* The Current Card */}
        <div className="mb-8 mt-8">
           {renderCard()}
        </div>

        {/* Controls */}
        <div className="flex gap-8 w-full max-w-md justify-center">
          <button 
             onClick={() => handleDecision(false)}
             className="flex-1 bg-red-900/80 hover:bg-red-600 border-2 border-red-500 text-red-100 p-4 rounded-xl flex flex-col items-center gap-2 transition-all active:scale-95 group shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          >
             <X size={32} className="group-hover:scale-110 transition-transform" />
             <span className="font-bold tracking-widest text-sm">DENY</span>
          </button>
          
          <button 
             onClick={() => handleDecision(true)}
             className="flex-1 bg-green-900/80 hover:bg-green-600 border-2 border-green-500 text-green-100 p-4 rounded-xl flex flex-col items-center gap-2 transition-all active:scale-95 group shadow-[0_0_20px_rgba(34,197,94,0.3)]"
          >
             <Check size={32} className="group-hover:scale-110 transition-transform" />
             <span className="font-bold tracking-widest text-sm">GRANT</span>
          </button>
        </div>
        
        <p className="mt-6 text-slate-500 text-xs text-center max-w-xs">
          Only grant access if the <strong>Role</strong> matches the <strong>Requested Data</strong>.
        </p>

      </div>
    </div>
  );
};

export default DataBouncerClub;
