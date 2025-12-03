import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldAlert, Play, RotateCcw } from 'lucide-react';

// --- Configuration & Data ---
const CONFIG = {
  baseSpeed: 0.15, // Speed multiplier
  spawnInterval: 120, // Frames
  maxStrikes: 3
};

const FILLER_WORDS = [
  "the", "of", "and", "a", "to", "in", "is", "you", "that", "it", "he", "was", "for", "on", "are", "as", "with", "his", "they", "I", "at", "be", "this", "have", "from", "or", "one", "had", "by", "word", "but", "not", "what", "all", "were", "we", "when", "your", "can", "said", "there", "use", "an", "each", "which", "she", "do", "how", "their", "if", "will", "up", "other", "about", "out", "many", "then", "them", "these", "so", "some", "her", "would", "make", "like", "him", "into", "time", "has", "look", "two", "more", "write", "go", "see", "number", "no", "way", "could", "people", "my", "than", "first", "water", "been", "call", "who", "oil", "its", "now", "find"
];

const SENSITIVE_CATEGORIES: Record<string, string[]> = {
  'ALIENS': ["Alien", "UFO", "Grey", "Martian", "Saucer", "Roswell", "E.T.", "Abduct", "Probe", "Signal", "Space", "Galaxy"],
  'SPIES': ["Mole", "Agent", "Cipher", "Code", "Wire", "Asset", "Drop", "Cover", "Double", "Intel", "Nuke", "Bomb"],
  'POLITICS': ["Senator", "Bribe", "Vote", "Scandal", "Fraud", "Tax", "Lobby", "Bill", "Law", "Mayor", "Funds", "Leak"],
  'CRYPTIDS': ["Bigfoot", "Yeti", "Nessie", "Mothman", "Chupa", "Beast", "Ghost", "Spirit", "Demon", "Swamp", "Cave", "Tracks"]
};

// --- Helper Functions ---
const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const generateId = () => Math.random().toString(36).substr(2, 9);

interface Word {
  id: string;
  text: string;
  type: string;
  status: 'normal' | 'redacted' | 'mistake';
}

interface Line {
  id: string;
  y: number;
  words: Word[];
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export default function RedactionRacer() {
  // --- State ---
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameover'
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [targetCategory, setTargetCategory] = useState('ALIENS');
  const [lines, setLines] = useState<Line[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  // --- Refs for Game Loop (Mutable state without re-renders for logic) ---
  const requestRef = useRef<number>();
  const stateRef = useRef({
    score: 0,
    strikes: 0,
    speed: 1,
    frames: 0,
    difficultyLevel: 1,
    targetCategory: 'ALIENS',
    isActive: false
  });

  // --- Audio / Visual Effects ---
  const triggerShake = () => {
    document.body.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
    setTimeout(() => document.body.style.transform = "none", 100);
  };

  const spawnParticles = (x: number, y: number) => {
    const newParticles = Array.from({ length: 5 }).map(() => ({
      id: generateId(),
      x,
      y,
      vx: (Math.random() - 0.5) * 100,
      vy: (Math.random() - 0.5) * 100,
      life: 1
    }));
    setParticles(prev => [...prev, ...newParticles]);
  };

  // --- Game Logic ---

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setStrikes(0);
    setLines([]);
    setParticles([]);
    
    // Reset Refs
    stateRef.current = {
      score: 0,
      strikes: 0,
      speed: 1,
      frames: 0,
      difficultyLevel: 1,
      targetCategory: Object.keys(SENSITIVE_CATEGORIES)[0], // Start with Aliens or random
      isActive: true
    };
    
    pickNewTarget();
  }, []);

  const pickNewTarget = () => {
    const keys = Object.keys(SENSITIVE_CATEGORIES);
    const newTarget = getRandomElement(keys);
    setTargetCategory(newTarget);
    stateRef.current.targetCategory = newTarget;
  };

  const handleStrike = useCallback(() => {
    stateRef.current.strikes += 1;
    setStrikes(stateRef.current.strikes);
    triggerShake();

    if (stateRef.current.strikes >= CONFIG.maxStrikes) {
      endGame();
    }
  }, []);

  const endGame = () => {
    stateRef.current.isActive = false;
    setGameState('gameover');
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const spawnLine = () => {
    const numWords = 3 + Math.floor(Math.random() * 3);
    const includeSensitive = Math.random() > 0.3;
    const currentTarget = stateRef.current.targetCategory;
    
    const words: Word[] = [];
    const sensitiveIndex = includeSensitive ? Math.floor(Math.random() * numWords) : -1;

    for (let i = 0; i < numWords; i++) {
      let text = "";
      let type = "filler";

      if (i === sensitiveIndex) {
        text = getRandomElement(SENSITIVE_CATEGORIES[currentTarget]);
        type = "sensitive";
      } else if (Math.random() < 0.1) {
        // Decoy
        const allKeys = Object.keys(SENSITIVE_CATEGORIES);
        const wrongKey = allKeys.find(k => k !== currentTarget) || allKeys[0];
        text = getRandomElement(SENSITIVE_CATEGORIES[wrongKey]);
        type = "decoy";
      } else {
        text = getRandomElement(FILLER_WORDS);
      }

      words.push({
        id: generateId(),
        text,
        type,
        status: 'normal' // 'normal', 'redacted', 'mistake'
      });
    }

    setLines(prev => [
      ...prev,
      {
        id: generateId(),
        y: 100, // Starts at bottom (100%)
        words
      }
    ]);
  };

  const handleWordClick = (lineId: string, wordId: string, e: React.MouseEvent | React.TouchEvent) => {
    if (gameState !== 'playing') return;

    // Use client coordinates for particles
    // @ts-ignore
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    // @ts-ignore
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    setLines(prevLines => prevLines.map(line => {
      if (line.id !== lineId) return line;
      
      const newWords = line.words.map(word => {
        if (word.id !== wordId) return word;
        if (word.status !== 'normal') return word; // Already clicked

        if (word.type === 'sensitive') {
          // Correct
          stateRef.current.score += 10;
          setScore(stateRef.current.score);
          spawnParticles(clientX, clientY);
          
          // Difficulty scaling
          if (stateRef.current.score % 50 === 0) {
             stateRef.current.speed += 0.2;
             stateRef.current.difficultyLevel++;
             pickNewTarget();
          }
          return { ...word, status: 'redacted' as const };
        } else {
          // Mistake
          handleStrike();
          return { ...word, status: 'mistake' as const };
        }
      });
      
      return { ...line, words: newWords };
    }));
  };

  // --- The Game Loop ---
  const updateGame = useCallback(() => {
    if (!stateRef.current.isActive) return;

    stateRef.current.frames++;

    // Spawning
    const currentInterval = Math.max(30, CONFIG.spawnInterval - (stateRef.current.difficultyLevel * 5));
    if (stateRef.current.frames % currentInterval === 0) {
      spawnLine();
    }

    // Moving & Checking Bounds
    setLines(prevLines => {
      const moveStep = CONFIG.baseSpeed * stateRef.current.speed;
      const nextLines: Line[] = [];

      prevLines.forEach(line => {
        const newY = line.y - moveStep;

        // Check for leaks (reached top without redaction)
        if (newY < 5) { // Crossed the "Leak Zone" threshold
            let lineModified = false;
            const newWords = line.words.map(w => {
                if (w.type === 'sensitive' && w.status === 'normal') {
                    handleStrike();
                    lineModified = true;
                    return { ...w, status: 'mistake' as const }; // Auto-fail it visually
                }
                return w;
            });
            
            if (newY > -10) {
                 nextLines.push(lineModified ? { ...line, y: newY, words: newWords } : { ...line, y: newY });
            }
        } else if (newY > -10) {
             // Keep line if still visible
             nextLines.push({ ...line, y: newY });
        }
      });
      return nextLines;
    });
    
    // Particle Animation
    setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx * 0.016,
        y: p.y + p.vy * 0.016,
        life: p.life - 0.05
    })).filter(p => p.life > 0));

    requestRef.current = requestAnimationFrame(updateGame);
  }, [handleStrike]);

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, updateGame]);


  // --- Render Helpers ---
  return (
    <div className="relative w-full h-screen overflow-hidden bg-neutral-800 flex flex-col items-center justify-center font-mono select-none">
      
      {/* External Fonts & Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Courier+Prime:wght@400;700&display=swap');
        
        .font-typewriter { font-family: 'Courier Prime', monospace; }
        .font-stamp { font-family: 'Special Elite', cursive; }
        
        .paper-texture {
            background-color: #f0e6d2;
            background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
        }
        
        .scanlines {
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.05) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 2px, 3px 100%;
        }

        .redacted-texture {
            background-color: #111;
            color: transparent;
        }
        .redacted-texture::after {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23333' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Main Game Container */}
      <div className="relative w-full max-w-2xl h-full paper-texture shadow-2xl flex flex-col overflow-hidden">
        
        {/* CRT Overlay */}
        <div className="absolute inset-0 scanlines pointer-events-none z-20"></div>

        {/* Particles */}
        {particles.map(p => (
            <div 
                key={p.id}
                className="absolute w-1 h-1 bg-black rounded-full pointer-events-none z-30"
                style={{ left: p.x, top: p.y, opacity: p.life }}
            />
        ))}

        {/* Header */}
        <header className="bg-neutral-900 text-neutral-100 p-3 flex justify-between items-center z-30 border-b-4 border-red-700 shadow-md">
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest opacity-70">Clearance</div>
            <div className="text-xl font-stamp font-bold">{score}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-center">
                <div className="text-xs uppercase tracking-widest opacity-70">Breaches</div>
                <div className={`text-xl font-stamp font-bold ${strikes > 0 ? 'text-red-500' : 'text-white'}`}>
                    {strikes}/{CONFIG.maxStrikes}
                </div>
            </div>
          </div>
        </header>

        {/* Directive Banner */}
        <div className="bg-neutral-200 p-2 text-center border-b border-neutral-400 z-20 shadow-sm text-sm md:text-base font-typewriter">
           DIRECTIVE: REDACT ALL MENTIONS OF <span className="font-sans font-black text-red-700 text-lg uppercase tracking-wide ml-1">{targetCategory}</span>
        </div>

        {/* Game Area */}
        <div className="flex-grow relative overflow-hidden cursor-text" onMouseDown={(e) => e.preventDefault()}>
            
            {/* Shredder/Leak Zone */}
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-red-500/20 to-transparent border-b border-dashed border-red-500/50 z-10 flex justify-center pt-1 pointer-events-none">
                <span className="text-red-700 text-xs font-bold tracking-[0.2em] uppercase">Leak Zone - Do Not Cross</span>
            </div>

            {/* Moving Lines */}
            {lines.map(line => (
                <div 
                    key={line.id} 
                    className="absolute w-full flex justify-center flex-wrap px-4 transition-transform duration-75 ease-linear font-typewriter text-lg md:text-xl leading-relaxed text-neutral-900"
                    style={{ top: `${line.y}%` }}
                >
                    {line.words.map(word => (
                        <span 
                            key={word.id}
                            onMouseDown={(e) => handleWordClick(line.id, word.id, e)}
                            onTouchStart={(e) => handleWordClick(line.id, word.id, e)}
                            className={`
                                m-1 px-1 rounded-sm cursor-pointer transition-colors duration-100 relative
                                ${word.status === 'normal' ? 'hover:bg-neutral-300' : ''}
                                ${word.status === 'redacted' ? 'redacted-texture pointer-events-none' : ''}
                                ${word.status === 'mistake' ? 'bg-red-500/30 line-through text-red-700' : ''}
                            `}
                        >
                            {word.text}
                        </span>
                    ))}
                </div>
            ))}
        </div>

        {/* Start Screen */}
        {gameState === 'start' && (
            <div className="absolute inset-0 bg-neutral-900/90 z-50 flex flex-col items-center justify-center text-white text-center p-6 backdrop-blur-sm">
                <ShieldAlert size={64} className="text-red-600 mb-4" />
                <h1 className="font-stamp text-4xl md:text-6xl text-red-500 mb-4 -rotate-2 drop-shadow-md">TOP SECRET</h1>
                <div className="max-w-md space-y-4 font-typewriter text-sm md:text-base mb-8">
                    <p><strong>MISSION:</strong> Classified documents are being leaked.</p> 
                    <p>You must <span className="bg-black px-1">REDACT</span> sensitive keywords before they reach the public domain.</p>
                    <p>Tap the <span className="text-red-400 font-bold">RED</span> keywords specified in your directive.</p>
                </div>
                <button 
                    onClick={startGame}
                    className="bg-[#f0e6d2] text-neutral-900 px-8 py-4 font-stamp text-xl md:text-2xl shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_#000] transition-all flex items-center gap-2 hover:bg-white"
                >
                    <Play size={24} /> ACCEPT ASSIGNMENT
                </button>
            </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-neutral-900/90 z-50 flex flex-col items-center justify-center text-white text-center p-6 backdrop-blur-sm">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 font-stamp text-6xl text-red-600 border-8 border-red-600 p-4 -rotate-12 opacity-90 animate-pulse whitespace-nowrap">
                    TERMINATED
                </div>
                
                <div className="mt-32 max-w-md font-typewriter mb-8">
                    <p className="text-lg mb-2">You let too many secrets slip, Agent.</p>
                    <p className="text-2xl">Final Clearance: <span className="font-stamp text-red-500 text-3xl">{score}</span></p>
                </div>

                <button 
                    onClick={startGame}
                    className="bg-[#f0e6d2] text-neutral-900 px-8 py-4 font-stamp text-xl md:text-2xl shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_#000] transition-all flex items-center gap-2 hover:bg-white"
                >
                    <RotateCcw size={24} /> RETRY MISSION
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
