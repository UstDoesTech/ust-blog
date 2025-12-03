import React, { useState, useEffect, useCallback } from 'react';
import { Timer, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

// --- Data Generators ---

const SENTENCES = [
  "The audit revealed a discrepancy in the accounts.",
  "Please verify the customer's identity before proceeding.",
  "The data breach occurred late last night.",
  "Secure transmission of files is mandatory.",
  "Review the attached documents for accuracy.",
  "The system update will require a restart.",
  "Confidentiality agreements must be signed.",
  "Access to the server room is restricted.",
  "The financial report is due by Friday.",
  "Employee records are stored securely."
];

const generateRandomSSN = () => {
  const d = () => Math.floor(Math.random() * 10);
  return `${d()}${d()}${d()}-${d()}${d()}-${d()}${d()}${d()}${d()}`;
};

const generateRandomCC = () => {
  const d = () => Math.floor(Math.random() * 10);
  const g = () => `${d()}${d()}${d()}${d()}`;
  return `${g()}-${g()}-${g()}-${g()}`;
};

interface TextSegment {
  id: string;
  text: string;
  type: 'normal' | 'pii';
  isRedacted: boolean;
}

const generateGameContent = (): TextSegment[] => {
  const segments: TextSegment[] = [];
  let idCounter = 0;

  // Generate 3-5 sentences
  const numSentences = 3 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i < numSentences; i++) {
    const sentence = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
    const words = sentence.split(' ');
    
    // Insert PII randomly into the sentence
    const insertAt = Math.floor(Math.random() * (words.length + 1));
    const piiType = Math.random() > 0.5 ? 'SSN' : 'CC';
    const piiText = piiType === 'SSN' ? generateRandomSSN() : generateRandomCC();
    
    // Add words before PII
    words.slice(0, insertAt).forEach(word => {
      segments.push({ id: `seg-${idCounter++}`, text: word, type: 'normal', isRedacted: false });
    });
    
    // Add PII
    segments.push({ id: `seg-${idCounter++}`, text: piiText, type: 'pii', isRedacted: false });
    
    // Add words after PII
    words.slice(insertAt).forEach(word => {
      segments.push({ id: `seg-${idCounter++}`, text: word, type: 'normal', isRedacted: false });
    });
  }

  return segments;
};

export default function RedactionRacer() {
  const [segments, setSegments] = useState<TextSegment[]>([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'won' | 'lost'>('start');
  const [feedback, setFeedback] = useState<{id: string, type: 'good' | 'bad'} | null>(null);

  // Initialize Game
  const startGame = useCallback(() => {
    setSegments(generateGameContent());
    setTimeLeft(10);
    setGameState('playing');
    setFeedback(null);
  }, []);

  // Timer Logic
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Check Win Condition
  useEffect(() => {
    if (gameState === 'playing') {
      const remainingPII = segments.filter(s => s.type === 'pii' && !s.isRedacted);
      if (remainingPII.length === 0 && segments.length > 0) {
        setGameState('won');
      }
    }
  }, [segments, gameState]);

  const handleSegmentClick = (id: string) => {
    if (gameState !== 'playing') return;

    setSegments(prev => prev.map(seg => {
      if (seg.id !== id) return seg;
      
      if (seg.isRedacted) return seg; // Already redacted

      if (seg.type === 'pii') {
        // Correct click
        setFeedback({ id, type: 'good' });
        setTimeout(() => setFeedback(null), 500);
        return { ...seg, isRedacted: true };
      } else {
        // Wrong click - Penalty
        setTimeLeft(t => Math.max(0, t - 1));
        setFeedback({ id, type: 'bad' });
        setTimeout(() => setFeedback(null), 500);
        return seg;
      }
    }));
  };

  // Custom Marker Cursor SVG
  const markerCursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 19l7-7 3 3-7 7-3-3z'></path><path d='M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z'></path><path d='M2 2l7.586 7.586'></path><circle cx='11' cy='11' r='2'></circle></svg>") 0 32, auto`;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg border-2 border-gray-200 font-mono">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-black text-white px-2 py-1 rounded text-lg">REDACTION</span> RACER
        </h2>
        
        <div className={`flex items-center gap-2 text-xl font-bold ${timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
          <Timer className="w-6 h-6" />
          {timeLeft}s
        </div>
      </div>

      {/* Game Area */}
      <div 
        className="relative min-h-[300px] bg-[#f8f9fa] p-8 rounded-lg border border-gray-300 leading-loose text-lg shadow-inner"
        style={{ cursor: gameState === 'playing' ? markerCursor : 'default' }}
      >
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center text-center p-6">
            <h3 className="text-2xl font-bold mb-4">Security Clearance Required</h3>
            <p className="mb-6 max-w-md text-gray-600">
              Find and redact (click) all <strong>Social Security Numbers</strong> (XXX-XX-XXXX) and <strong>Credit Card Numbers</strong> (XXXX-XXXX-XXXX-XXXX) before time runs out.
            </p>
            <p className="mb-6 text-sm text-red-500 font-bold">Warning: Redacting innocent text costs 1 second!</p>
            <button 
              onClick={startGame}
              className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              Start Mission
            </button>
          </div>
        )}

        {gameState === 'won' && (
          <div className="absolute inset-0 bg-green-50/95 z-10 flex flex-col items-center justify-center text-center p-6">
            <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
            <h3 className="text-3xl font-bold text-green-800 mb-2">Mission Accomplished!</h3>
            <p className="mb-6 text-green-700">All sensitive data has been secured.</p>
            <button 
              onClick={startGame}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> Play Again
            </button>
          </div>
        )}

        {gameState === 'lost' && (
          <div className="absolute inset-0 bg-red-50/95 z-10 flex flex-col items-center justify-center text-center p-6">
            <AlertTriangle className="w-16 h-16 text-red-600 mb-4" />
            <h3 className="text-3xl font-bold text-red-800 mb-2">Data Breach!</h3>
            <p className="mb-6 text-red-700">You failed to secure the PII in time.</p>
            <button 
              onClick={startGame}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> Try Again
            </button>
          </div>
        )}

        {/* Text Content */}
        <div className="flex flex-wrap gap-x-2 gap-y-4 select-none">
          {segments.map((seg) => (
            <span
              key={seg.id}
              onClick={() => handleSegmentClick(seg.id)}
              className={`
                relative px-1 rounded transition-all duration-200
                ${gameState === 'playing' ? 'hover:bg-yellow-200 cursor-pointer' : ''}
                ${seg.isRedacted ? 'bg-black text-black hover:bg-black' : 'text-gray-800'}
              `}
            >
              {seg.isRedacted ? '████████' : seg.text}
              
              {/* Feedback Animations */}
              {feedback?.id === seg.id && feedback.type === 'bad' && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-red-600 font-bold text-sm animate-bounce whitespace-nowrap">
                  -1s
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 text-center">
        Use your marker to black out sensitive information.
      </div>
    </div>
  );
}
