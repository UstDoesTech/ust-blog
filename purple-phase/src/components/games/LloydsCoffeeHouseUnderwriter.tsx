import React, { useState, useEffect } from 'react';
import { Anchor, Skull, Coins, Scroll, AlertTriangle, Ship } from 'lucide-react';

// --- TYPES ---

interface Route {
  name: string;
  risk: number;
  baseValue: number;
  flavor: string;
}

interface Cargo {
  name: string;
  volatility: number;
  description: string;
}

interface Captain {
  name: string;
  skill: number;
  wage: number;
  trait: string;
}

interface Offer {
  route: Route;
  cargo: Cargo;
  captain: Captain;
  cargoValue: number;
  premium: number;
  trueRisk: number;
}

interface Log {
  message: string;
  type: 'neutral' | 'danger' | 'success';
  id: number;
}

// --- GAME DATA & CONSTANTS ---

const ROUTES: Route[] = [
  { name: 'London to Amsterdam', risk: 0.1, baseValue: 500, flavor: 'A short, safe hop across the channel.' },
  { name: 'London to Jamaica', risk: 0.4, baseValue: 2000, flavor: 'High risk of Spanish privateers and hurricanes.' },
  { name: 'London to Bombay', risk: 0.6, baseValue: 5000, flavor: 'A perilous journey around the Cape. Immense rewards.' },
  { name: 'London to Venice', risk: 0.25, baseValue: 1200, flavor: 'Barbary pirates patrol these waters.' },
  { name: 'The Triangle Trade', risk: 0.5, baseValue: 3500, flavor: 'Moral hazards aside, the disease risk is high.' }
];

const CARGO_TYPES: Cargo[] = [
  { name: 'Wool & Textiles', volatility: 1.0, description: 'Standard cargo. Low spoilage.' },
  { name: 'Spices', volatility: 1.5, description: 'Highly valuable, but easily damaged by water.' },
  { name: 'Gold & Silver', volatility: 2.0, description: 'Theft magnet. Pirates love this.' },
  { name: 'Tea', volatility: 1.2, description: 'Must be kept dry at all costs.' }
];

const CAPTAINS: Captain[] = [
  { name: 'Cpt. Blackwood', skill: 0.2, wage: 1.5, trait: 'Expert Navigator' }, // Skill reduces risk
  { name: 'Cpt. Drunkard', skill: -0.1, wage: 0.8, trait: 'Often Inebriated' }, // Negative skill increases risk
  { name: 'Cpt. Sterling', skill: 0.05, wage: 1.0, trait: 'Reliable' },
  { name: 'Cpt. Reckless', skill: -0.2, wage: 0.6, trait: 'Cuts Corners' }
];

// --- COMPONENTS ---

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-[#f5e6d3] border-2 border-[#8b5a2b] rounded shadow-lg p-4 ${className}`}>
    {children}
  </div>
);

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "danger" | "success" | "outline";
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, variant = "primary", disabled = false, className = "" }) => {
  const baseStyle = "px-4 py-2 font-serif font-bold rounded transition-colors duration-200 flex items-center justify-center gap-2";
  const styles = {
    primary: "bg-[#2c3e50] text-[#f5e6d3] hover:bg-[#1a252f]",
    danger: "bg-[#8b0000] text-white hover:bg-[#660000]",
    success: "bg-[#27ae60] text-white hover:bg-[#219150]",
    outline: "border-2 border-[#2c3e50] text-[#2c3e50] hover:bg-[#eaddcf]"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${styles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

export default function MaritimeInsuranceGame() {
  // Game State
  const [wealth, setWealth] = useState(1000);
  const [reputation, setReputation] = useState(50);
  const [turn, setTurn] = useState(1);
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Initialize Game
  useEffect(() => {
    generateOffer();
    addLog("Welcome to Lloyd's Coffee House, 1688. Build your fortune by underwriting ships.");
  }, []);

  // Helper: Generate a random proposal
  const generateOffer = () => {
    const route = ROUTES[Math.floor(Math.random() * ROUTES.length)];
    const cargo = CARGO_TYPES[Math.floor(Math.random() * CARGO_TYPES.length)];
    const captain = CAPTAINS[Math.floor(Math.random() * CAPTAINS.length)];

    // Calculate Value
    const cargoValue = Math.floor(route.baseValue * cargo.volatility);
    
    // Calculate True Risk (Hidden slightly from player)
    // Base Risk - Captain Skill
    let trueRisk = route.risk - captain.skill; 
    trueRisk = Math.max(0.05, Math.min(0.95, trueRisk)); // Clamp risk between 5% and 95%

    // Calculate Premium (The money you get upfront)
    // In 1600s, premiums were high. Let's say 15% to 40% of value depending on perception.
    const perceivedRisk = route.risk; // Player sees route risk primarily
    const premiumRate = perceivedRisk * 0.8; // Market rate slightly lower than raw risk usually
    const premium = Math.floor(cargoValue * premiumRate);

    setCurrentOffer({
      route,
      cargo,
      captain,
      cargoValue,
      premium,
      trueRisk
    });
  };

  const addLog = (message: string, type: Log['type'] = 'neutral') => {
    setLogs(prev => [{ message, type, id: Date.now() }, ...prev.slice(0, 5)]);
  };

  const handleDecision = (accepted: boolean) => {
    if (!currentOffer) return;

    if (!accepted) {
      addLog("You declined the risk. The captain looks elsewhere.", "neutral");
      advanceTurn();
      return;
    }

    // Player accepts risk
    if (wealth < currentOffer.cargoValue * 0.1) {
      addLog("You lack the capital to back this venture!", "danger");
      return;
    }

    const { premium, cargoValue, trueRisk, route } = currentOffer;
    
    // Immediate mechanic: 
    // 1. Take Premium
    // 2. Roll for Disaster
    
    const roll = Math.random();
    let newWealth = wealth + premium;
    let disasterHappened = roll < trueRisk;

    if (disasterHappened) {
      // Payout logic
      const payout = cargoValue;
      newWealth -= payout;
      
      const reasons = ["Pirates seized the ship!", "Lost in a terrible storm.", "Crew mutiny!", "Sunk by the French Navy."];
      const reason = reasons[Math.floor(Math.random() * reasons.length)];
      
      addLog(`DISASTER: ${route.name} - ${reason} Payout: £${payout}.`, "danger");
      setReputation(prev => Math.min(100, prev + 5)); // Paying out increases trust/reputation
    } else {
      addLog(`SUCCESS: The ship arrived safely from ${route.name.split(' to ')[1]}. You keep the £${premium} premium.`, "success");
      setReputation(prev => Math.max(0, prev - 1)); // Slowly decaying rep if you just take money? Or maybe neutral.
    }

    setWealth(newWealth);
    checkWinCondition(newWealth);
    advanceTurn();
  };

  const advanceTurn = () => {
    setTurn(prev => prev + 1);
    generateOffer();
  };

  const checkWinCondition = (currentWealth: number) => {
    if (currentWealth <= 0) {
      setGameOver(true);
    } else if (currentWealth >= 5000) {
      setGameWon(true);
    }
  };

  const resetGame = () => {
    setWealth(1000);
    setReputation(50);
    setTurn(1);
    setLogs([]);
    setGameOver(false);
    setGameWon(false);
    generateOffer();
    addLog("New ledger opened. Good luck.");
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5e6d3] p-8 font-serif text-[#2c3e50]">
        <Skull size={64} className="mb-4 text-[#8b0000]" />
        <h1 className="text-4xl font-bold mb-4">Bankruptcy</h1>
        <p className="text-xl mb-8">You have been ruined. Your name is struck from the Black Book.</p>
        <Button onClick={resetGame}>Start New Ledger</Button>
      </div>
    );
  }

  if (gameWon) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5e6d3] p-8 font-serif text-[#2c3e50]">
        <Coins size={64} className="mb-4 text-[#27ae60]" />
        <h1 className="text-4xl font-bold mb-4">Merchant Prince</h1>
        <p className="text-xl mb-8">You have amassed £{wealth}. You are the master of Lloyd's!</p>
        <Button onClick={resetGame}>Start New Ledger</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eaddcf] p-4 md:p-8 font-serif text-[#2c3e50]">
      <div className="max-w-4xl mx-auto grid gap-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b-4 border-[#2c3e50] pb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Anchor /> Lloyd's Underwriter
            </h1>
            <p className="text-sm opacity-75">London, 1688</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">£{wealth}</div>
            <div className="text-sm">Turn: {turn} | Rep: {reputation}</div>
          </div>
        </div>

        {/* Main Game Loop */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Left Column: The Offer */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Scroll size={20}/> Current Proposal
            </h2>
            
            {currentOffer && (
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Ship size={120} />
                </div>
                
                <div className="relative z-10 space-y-4">
                  <div>
                    <span className="text-xs font-bold tracking-widest uppercase text-[#8b5a2b]">Route</span>
                    <div className="text-lg font-bold">{currentOffer.route.name}</div>
                    <div className="text-sm italic opacity-75">{currentOffer.route.flavor}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-bold tracking-widest uppercase text-[#8b5a2b]">Cargo</span>
                      <div className="font-semibold">{currentOffer.cargo.name}</div>
                    </div>
                    <div>
                      <span className="text-xs font-bold tracking-widest uppercase text-[#8b5a2b]">Captain</span>
                      <div className="font-semibold">{currentOffer.captain.name}</div>
                      <div className={`text-xs ${currentOffer.captain.skill < 0 ? 'text-red-600' : 'text-green-700'}`}>
                        {currentOffer.captain.trait}
                      </div>
                    </div>
                  </div>

                  <hr className="border-[#8b5a2b] opacity-30" />

                  <div className="bg-[#fffdf5] p-3 rounded border border-[#8b5a2b] border-opacity-20">
                    <div className="flex justify-between items-center mb-1">
                      <span>Insured Value:</span>
                      <span className="font-bold text-lg">£{currentOffer.cargoValue}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#27ae60]">
                      <span>Your Premium:</span>
                      <span className="font-bold text-xl">+£{currentOffer.premium}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button 
                      variant="danger" 
                      className="flex-1"
                      onClick={() => handleDecision(false)}
                    >
                      Reject Risk
                    </Button>
                    <Button 
                      variant="success" 
                      className="flex-1"
                      onClick={() => handleDecision(true)}
                    >
                      Sign & Seal
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Educational Tip */}
            <div className="text-sm bg-[#d4c5b0] p-3 rounded italic text-center">
              "Underwriters must weigh the skill of the captain against the perils of the sea. A drunken captain on a calm sea is worse than a master sailor in a storm."
            </div>
          </div>

          {/* Right Column: Ledger / Logs */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <AlertTriangle size={20}/> The Ledger (News)
            </h2>
            
            <div className="bg-[#f5e6d3] border-2 border-[#8b5a2b] rounded shadow-inner h-96 overflow-y-auto p-4 flex flex-col gap-2">
              {logs.length === 0 && <p className="text-center opacity-50 mt-10">No entries yet.</p>}
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className={`p-2 rounded text-sm border-l-4 ${
                    log.type === 'danger' ? 'bg-red-50 border-red-500 text-red-900' :
                    log.type === 'success' ? 'bg-green-50 border-green-500 text-green-900' :
                    'bg-white border-gray-400'
                  }`}
                >
                  <span className="font-bold mr-2">Day {new Date(log.id).getSeconds()}:</span> 
                  {log.message}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}