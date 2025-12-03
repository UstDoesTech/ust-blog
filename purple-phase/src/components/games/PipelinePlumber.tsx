import React, { useState } from 'react';
import { Play, RotateCcw, Database, LayoutDashboard, ArrowRight, ArrowDown } from 'lucide-react';

interface Tile {
  id: string;
  label: string;
  color: string;
  correctIndex: number;
}

const TILES: Tile[] = [
  { id: 'dedup', label: 'Remove Duplicates', color: 'bg-red-500', correctIndex: 0 },
  { id: 'format', label: 'Standardize Format', color: 'bg-yellow-500', correctIndex: 1 },
  { id: 'schema', label: 'Validate Schema', color: 'bg-green-500', correctIndex: 2 },
];

export default function PipelinePlumber() {
  const [slots, setSlots] = useState<(Tile | null)[]>([null, null, null]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isDragging, setIsDragging] = useState<string | null>(null);

  // Derive available tiles (those not in slots)
  const availableTiles = TILES.filter(tile => !slots.some(s => s?.id === tile.id));

  const handleDragStart = (e: React.DragEvent, tileId: string) => {
    e.dataTransfer.setData('text/plain', tileId);
    setIsDragging(tileId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    const tileId = e.dataTransfer.getData('text/plain');
    const tile = TILES.find(t => t.id === tileId);
    
    if (!tile) return;

    setSlots(prev => {
      const newSlots = [...prev];
      
      // If tile was already in a slot, remove it from there
      const existingIndex = newSlots.findIndex(s => s?.id === tileId);
      if (existingIndex !== -1) {
        newSlots[existingIndex] = null;
      }

      // Place in new slot (swapping if occupied)
      const occupiedTile = newSlots[slotIndex];
      newSlots[slotIndex] = tile;
      
      return newSlots;
    });
    
    setIsDragging(null);
    setFeedback({ type: null, message: '' });
  };

  const handleBankDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const tileId = e.dataTransfer.getData('text/plain');
    
    setSlots(prev => {
      const newSlots = [...prev];
      const existingIndex = newSlots.findIndex(s => s?.id === tileId);
      if (existingIndex !== -1) {
        newSlots[existingIndex] = null;
      }
      return newSlots;
    });
    setIsDragging(null);
  };

  const runPipeline = () => {
    // Check if all slots are filled
    if (slots.some(s => s === null)) {
      setFeedback({ type: 'error', message: 'Pipeline incomplete! Fill all slots.' });
      return;
    }

    // Check order
    const isCorrect = slots.every((slot, index) => slot?.correctIndex === index);

    if (isCorrect) {
      setFeedback({ type: 'success', message: 'Success: Data flowing!' });
    } else {
      setFeedback({ type: 'error', message: 'Error: Bad Data Quality!' });
    }
  };

  const resetGame = () => {
    setSlots([null, null, null]);
    setFeedback({ type: null, message: '' });
  };

  return (
    <div className="min-h-[600px] bg-slate-900 p-4 md:p-8 flex flex-col items-center justify-center font-sans text-slate-100 select-none">
      
      <div className="max-w-4xl w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-purple-400">Pipeline Plumber</h2>

        {/* Main Game Area */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 mb-12 bg-slate-800/50 p-4 md:p-8 rounded-xl border border-slate-700">
          
          {/* Source */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-amber-900/80 border-4 border-amber-700 rounded-lg flex items-center justify-center shadow-lg">
              <Database size={32} className="text-amber-200 opacity-50 md:w-12 md:h-12" />
            </div>
            <span className="font-bold text-amber-500 text-sm md:text-base">Dirty Source Data</span>
          </div>

          {/* Pipeline Slots */}
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-4 relative w-full">
            {/* Connecting Line Background - Desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-2 bg-slate-700 -z-10 transform -translate-y-1/2"></div>
            {/* Connecting Line Background - Mobile */}
            <div className="block md:hidden absolute left-1/2 top-0 h-full w-2 bg-slate-700 -z-10 transform -translate-x-1/2"></div>

            {slots.map((slot, index) => (
              <div 
                key={index}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`
                  w-full max-w-[200px] h-20 md:w-40 md:h-24 border-2 border-dashed rounded-lg flex items-center justify-center transition-all
                  ${slot ? 'border-transparent' : 'border-slate-500 bg-slate-800/50 hover:bg-slate-700/50'}
                `}
              >
                {slot ? (
                  <div 
                    draggable
                    onDragStart={(e) => handleDragStart(e, slot.id)}
                    className={`
                      w-full h-full ${slot.color} rounded-lg flex items-center justify-center p-2 text-center shadow-lg cursor-grab active:cursor-grabbing
                      transform transition-transform hover:scale-105
                    `}
                  >
                    <span className="font-bold text-white text-sm md:text-base drop-shadow-md">{slot.label}</span>
                  </div>
                ) : (
                  <span className="text-slate-600 text-xs uppercase font-bold">Step {index + 1}</span>
                )}
              </div>
            ))}
            
            <div className="hidden md:block">
              <ArrowRight className={`text-slate-600 ${feedback.type === 'success' ? 'text-green-500 animate-pulse' : ''}`} size={32} />
            </div>
            <div className="block md:hidden">
              <ArrowDown className={`text-slate-600 ${feedback.type === 'success' ? 'text-green-500 animate-pulse' : ''}`} size={32} />
            </div>
          </div>

          {/* Destination */}
          <div className="flex flex-col items-center gap-2">
            <div className={`w-24 h-24 md:w-32 md:h-32 border-4 rounded-lg flex items-center justify-center shadow-lg transition-colors duration-500 ${feedback.type === 'success' ? 'bg-blue-500 border-blue-400 shadow-blue-500/50' : 'bg-blue-900/30 border-blue-800'}`}>
              <LayoutDashboard size={32} className={`transition-colors md:w-12 md:h-12 ${feedback.type === 'success' ? 'text-white' : 'text-blue-500/50'}`} />
            </div>
            <span className="font-bold text-blue-400 text-sm md:text-base">Clean Dashboard</span>
          </div>
        </div>

        {/* Controls & Feedback */}
        <div className="flex flex-col items-center gap-8">
          
          {/* Feedback Message */}
          <div className={`h-12 flex items-center justify-center text-xl font-bold transition-all text-center ${
            feedback.type === 'success' ? 'text-green-400 scale-110' : 
            feedback.type === 'error' ? 'text-red-400 shake' : 'text-transparent'
          }`}>
            {feedback.message || "..."}
          </div>

          {/* Draggable Bank */}
          <div 
            className="flex flex-wrap gap-4 p-6 bg-slate-800 rounded-xl border border-slate-700 min-h-[100px] w-full justify-center items-center"
            onDragOver={handleDragOver}
            onDrop={handleBankDrop}
          >
            {availableTiles.length === 0 && <span className="text-slate-600 italic text-sm">All modules deployed</span>}
            
            {availableTiles.map(tile => (
              <div
                key={tile.id}
                draggable
                onDragStart={(e) => handleDragStart(e, tile.id)}
                className={`
                  px-4 py-3 ${tile.color} rounded-lg shadow-lg cursor-grab active:cursor-grabbing
                  font-bold text-white text-sm hover:brightness-110 transition-all
                `}
              >
                {tile.label}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={runPipeline}
              className="flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold shadow-lg shadow-purple-900/20 transition-all active:scale-95"
            >
              <Play size={20} fill="currentColor" /> <span className="hidden sm:inline">Run Pipeline</span><span className="sm:hidden">Run</span>
            </button>
            
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-full font-bold transition-all active:scale-95"
            >
              <RotateCcw size={20} /> Reset
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }
      `}</style>
    </div>
  );
}
