import React, { useState, useEffect } from 'react';
import { Trash2, Archive, FileText, Image, Mail, DollarSign, Calendar, AlertCircle } from 'lucide-react';

// --- Game Configuration ---

type FileType = 'Invoice' | 'Cat Meme' | 'Tax Document' | 'Old Email' | 'Project Plan' | 'Server Log';

interface FileCard {
  id: number;
  type: FileType;
  year: number;
  icon: React.ReactNode;
}

const CURRENT_YEAR = new Date().getFullYear();

const FILE_TYPES: { type: FileType; isFinancial: boolean; icon: any }[] = [
  { type: 'Invoice', isFinancial: true, icon: DollarSign },
  { type: 'Tax Document', isFinancial: true, icon: FileText },
  { type: 'Cat Meme', isFinancial: false, icon: Image },
  { type: 'Old Email', isFinancial: false, icon: Mail },
  { type: 'Project Plan', isFinancial: false, icon: FileText },
  { type: 'Server Log', isFinancial: false, icon: FileText },
];

// Policy Logic
// Financial: Keep if age <= 7 years
// Others: Keep if age <= 3 years
const shouldKeep = (file: FileCard): boolean => {
  const age = CURRENT_YEAR - file.year;
  const fileInfo = FILE_TYPES.find(f => f.type === file.type);
  
  if (fileInfo?.isFinancial) {
    return age <= 7;
  } else {
    return age <= 3;
  }
};

export default function DataRetentionSwipe() {
  const [score, setScore] = useState(0);
  const [currentFile, setCurrentFile] = useState<FileCard | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong', message: string } | null>(null);
  const [streak, setStreak] = useState(0);

  // Initialize first card
  useEffect(() => {
    nextCard();
  }, []);

  const nextCard = () => {
    const randomType = FILE_TYPES[Math.floor(Math.random() * FILE_TYPES.length)];
    // Generate year between 2010 and current year
    const randomYear = Math.floor(Math.random() * (CURRENT_YEAR - 2010 + 1)) + 2010;
    
    setCurrentFile({
      id: Date.now(),
      type: randomType.type,
      year: randomYear,
      icon: <randomType.icon className="w-16 h-16 text-slate-600" />
    });
  };

  const handleDecision = (action: 'keep' | 'delete') => {
    if (!currentFile) return;

    const keepIt = shouldKeep(currentFile);
    const isCorrect = (action === 'keep' && keepIt) || (action === 'delete' && !keepIt);

    if (isCorrect) {
      setScore(s => s + 10 + (streak * 2)); // Bonus for streaks
      setStreak(s => s + 1);
      setFeedback({ type: 'correct', message: 'Correct!' });
      
      // Quick transition
      setTimeout(() => {
        setFeedback(null);
        nextCard();
      }, 400);
    } else {
      setScore(s => Math.max(0, s - 20));
      setStreak(0);
      const reason = keepIt 
        ? "Should have KEPT this file (Policy Compliance)" 
        : "Should have DELETED this file (Data Minimization)";
      
      setFeedback({ type: 'wrong', message: reason });
      
      // Longer pause for error reading
      setTimeout(() => {
        setFeedback(null);
        nextCard();
      }, 1500);
    }
  };

  if (!currentFile) return <div>Loading...</div>;

  const age = CURRENT_YEAR - currentFile.year;

  return (
    <div className="w-full max-w-md mx-auto p-4 font-sans text-slate-900">
      
      {/* Policy Header */}
      <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg mb-6 text-center shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-1 text-red-700 font-bold uppercase tracking-wider text-sm">
          <AlertCircle size={16} /> Retention Policy
        </div>
        <p className="text-slate-800 font-medium leading-tight">
          Retain <span className="font-bold text-red-600">Financial</span> records for <span className="font-bold">7 years</span>.
          <br/>
          Delete everything else older than <span className="font-bold">3 years</span>.
        </p>
      </div>

      {/* Score Board */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="text-sm font-bold text-slate-500">CURRENT YEAR: {CURRENT_YEAR}</div>
        <div className="flex gap-4">
          <div className="font-mono font-bold text-slate-700">Streak: {streak}🔥</div>
          <div className="font-mono font-bold text-blue-600">Score: {score}</div>
        </div>
      </div>

      {/* Card Area */}
      <div className="relative h-80 w-full perspective-1000">
        
        {/* Feedback Overlay */}
        {feedback && (
          <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 backdrop-blur rounded-xl border-4 ${feedback.type === 'correct' ? 'border-green-500' : 'border-red-500'} animate-in fade-in zoom-in duration-200 text-center p-4`}>
            <h2 className={`text-4xl font-black uppercase mb-2 ${feedback.type === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
              {feedback.type === 'correct' ? 'GOOD!' : 'OOPS!'}
            </h2>
            <p className="text-slate-700 font-medium">{feedback.message}</p>
          </div>
        )}

        {/* The File Card */}
        <div className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col items-center p-6 transform transition-transform hover:scale-[1.02]">
          
          {/* File Icon */}
          <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-inner">
            {currentFile.icon}
          </div>

          {/* File Details */}
          <div className="text-center w-full">
            <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">File Type</div>
            <h3 className="text-2xl font-black text-slate-800 mb-4">{currentFile.type}</h3>
            
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar size={18} />
                <span className="font-bold">Created:</span>
              </div>
              <div className="text-xl font-mono font-bold text-blue-600">
                {currentFile.year}
              </div>
            </div>
            
            <div className="mt-2 text-xs text-slate-400 text-right">
              Age: {age} {age === 1 ? 'year' : 'years'}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => handleDecision('delete')}
          disabled={!!feedback}
          className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 border-2 border-red-300 py-4 rounded-xl font-black text-lg shadow-sm active:scale-95 transition-all flex flex-col items-center gap-1"
        >
          <Trash2 size={24} />
          DELETE
        </button>
        
        <button
          onClick={() => handleDecision('keep')}
          disabled={!!feedback}
          className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 border-2 border-green-300 py-4 rounded-xl font-black text-lg shadow-sm active:scale-95 transition-all flex flex-col items-center gap-1"
        >
          <Archive size={24} />
          KEEP
        </button>
      </div>

      <div className="mt-6 text-center text-xs text-slate-400">
        Swipe logic simulation • Data Governance Training
      </div>
    </div>
  );
}
