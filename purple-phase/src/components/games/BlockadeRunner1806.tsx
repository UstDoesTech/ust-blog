import React, { useState, useEffect, useRef } from 'react';
import { Ship, Anchor, Coins, Skull, Map as MapIcon, Wind, AlertCircle } from 'lucide-react';

// --- TYPES ---

type GoodType = 'COTTON' | 'COLONIAL' | 'ARMS';

interface Good {
  name: string;
  baseCost: number;
  risk: number;
}

interface Port {
  id: string;
  name: string;
  type: 'safe' | 'hostile' | 'neutral';
  demandMod: number;
  difficulty: number;
  desc: string;
}

interface Log {
  msg: string;
  type: 'neutral' | 'danger' | 'success' | 'warning';
  id: number;
}

interface Encounter {
  type: string;
  title: string;
  desc: string;
  port: Port;
}

// --- GAME DATA ---

const START_YEAR = 1806;
const END_YEAR = 1815;

const GOODS: Record<GoodType, Good> = {
  COTTON: { name: 'Manchester Cotton', baseCost: 10, risk: 1.0 }, // Standard
  COLONIAL: { name: 'Colonial Sugar', baseCost: 25, risk: 1.2 }, // High demand, recognizable
  ARMS: { name: 'Muskets & Powder', baseCost: 50, risk: 2.0 } // Illegal, high profit
};

const PORTS: Port[] = [
  { id: 'LONDON', name: 'London (Home)', type: 'safe', demandMod: 0, difficulty: 0, desc: "Buy goods here." },
  { id: 'HAMBURG', name: 'Hamburg', type: 'hostile', demandMod: 2.5, difficulty: 0.8, desc: "Strict French control. High profit." },
  { id: 'LISBON', name: 'Lisbon', type: 'neutral', demandMod: 1.5, difficulty: 0.3, desc: "Friendly port, but low margins." },
  { id: 'AMSTERDAM', name: 'Amsterdam', type: 'hostile', demandMod: 3.0, difficulty: 0.9, desc: "King Louis is watching. Very dangerous." },
  { id: 'NAPLES', name: 'Naples', type: 'hostile', demandMod: 2.0, difficulty: 0.6, desc: "Corrupt officials make it easier." },
];

// --- COMPONENTS ---

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "danger" | "neutral" | "gold";
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
}

const Button: React.FC<ButtonProps> = ({ onClick, children, variant = "primary", disabled = false, className="", size="md" }) => {
  const base = "px-4 py-2 font-serif font-bold rounded border-2 flex items-center justify-center gap-2 transition-all active:translate-y-0.5";
  const sizeStyles = size === "sm" ? "text-sm py-1 px-2" : "";
  const styles = {
    primary: "bg-[#1a237e] text-white border-[#0d47a1] hover:bg-[#283593]", // British Navy Blue
    danger: "bg-[#b71c1c] text-white border-[#880e4f] hover:bg-[#c62828]", // French Red
    neutral: "bg-[#d7ccc8] text-slate-900 border-[#a1887f] hover:bg-[#efebe9]", // Parchment
    gold: "bg-[#ffb300] text-black border-[#ff6f00] hover:bg-[#ffca28]" 
  };
  return <button onClick={onClick} disabled={disabled} className={`${base} ${sizeStyles} ${styles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>{children}</button>;
};

export default function BlockadeRunner() {
  // --- STATE ---
  const [year, setYear] = useState(START_YEAR);
  const [month, setMonth] = useState(1);
  const [gold, setGold] = useState(500);
  const [inventory, setInventory] = useState<Record<GoodType, number>>({ COTTON: 0, COLONIAL: 0, ARMS: 0 });
  const [location, setLocation] = useState('LONDON');
  const [notoriety, setNotoriety] = useState(0); // How much the French want you
  const [logs, setLogs] = useState<Log[]>([]);
  
  // Navigation State
  const [gameState, setGameState] = useState<'DOCK' | 'SAILING' | 'ENCOUNTER' | 'GAMEOVER' | 'VICTORY'>('DOCK');
  const [destination, setDestination] = useState<Port | null>(null);
  const [encounterData, setEncounterData] = useState<Encounter | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

  // --- HELPERS ---
  const addLog = (msg: string, type: Log['type'] = 'neutral') => setLogs(prev => [...prev.slice(-5), { msg, type, id: Date.now() + Math.random() }]);
  
  const getInventoryCount = () => inventory.COTTON + inventory.COLONIAL + inventory.ARMS;

  // --- ACTIONS ---

  const buyGoods = (goodKey: GoodType) => {
    const good = GOODS[goodKey];
    if (gold < good.baseCost) { addLog("Not enough Sovereign!", "danger"); return; }
    if (getInventoryCount() >= 50) { addLog("Hold is full!", "danger"); return; }

    setGold(prev => prev - good.baseCost);
    setInventory(prev => ({ ...prev, [goodKey]: prev[goodKey] + 1 }));
  };

  const setSail = (targetPortId: string) => {
    if (getInventoryCount() === 0) { addLog("Sailing with an empty hold is a waste of wind.", "danger"); return; }
    
    const targetPort = PORTS.find(p => p.id === targetPortId);
    if (!targetPort) return;

    setDestination(targetPort);
    setGameState('SAILING');
    addLog(`Anchors aweigh! Setting course for ${targetPort.name}...`, "neutral");
    
    // Simulate Voyage Delay
    setTimeout(() => {
        calculateArrival(targetPortId);
    }, 2000);
  };

  const calculateArrival = (targetPortId: string) => {
    const port = PORTS.find(p => p.id === targetPortId);
    if (!port) return;
    
    // 1. Calculate Detection Chance
    // Base difficulty + Notoriety + Year Scaling (It gets harder as Napoleon tightens grip)
    const yearMod = (year - START_YEAR) * 0.05;
    const risk = port.difficulty + (notoriety / 100) + yearMod;
    
    const roll = Math.random();

    if (roll < risk) {
        // ENCOUNTER: FRENCH CUSTOMS (Douaniers)
        setEncounterData({
            type: 'CUSTOMS',
            title: 'Le Douanier',
            desc: `French Customs officers have intercepted your ship outside ${port.name}. They demand to inspect the hold.`,
            port: port
        });
        setGameState('ENCOUNTER');
    } else {
        // SUCCESS
        arriveSafely(port);
    }
  };

  const arriveSafely = (port: Port) => {
      setLocation(port.id);
      setGameState('DOCK');
      addLog(`Arrived in ${port.name} unnoticed. The black market awaits.`, "success");
      advanceTime();
  };

  const handleEncounter = (choice: 'BRIBE' | 'RUN' | 'FIGHT') => {
      if (!encounterData) return;
      const { port } = encounterData;
      
      if (choice === 'BRIBE') {
          const bribeCost = 100 + (year - START_YEAR) * 20;
          if (gold < bribeCost) {
              addLog("You don't have enough gold to bribe them!", "danger");
              return;
          }
          setGold(prev => prev - bribeCost);
          addLog("The officer takes the purse and looks the other way.", "neutral");
          arriveSafely(port);
      } 
      else if (choice === 'RUN') {
          // Risky: 50/50
          if (Math.random() > 0.5) {
              addLog("You outran the French cutter! But the ship took damage.", "success");
              arriveSafely(port);
          } else {
              addLog("Caught! They seized your cargo.", "danger");
              setInventory({ COTTON: 0, COLONIAL: 0, ARMS: 0 });
              setNotoriety(prev => prev + 20);
              setLocation(port.id); // You arrive, but empty
              setGameState('DOCK');
          }
      }
      else if (choice === 'FIGHT') {
          // Very Risky, High Reward (Notoriety Spike)
          if (Math.random() > 0.7) {
              addLog("You sank the patrol boat! The Empire will hunt you.", "success");
              setNotoriety(prev => prev + 50);
              arriveSafely(port);
          } else {
              setGameState('GAMEOVER');
              addLog("Your ship was blown out of the water.", "danger");
          }
      }
  };

  const sellGoods = () => {
    const port = PORTS.find(p => p.id === location);
    if (!port) return;

    let revenue = 0;
    
    (Object.keys(inventory) as GoodType[]).forEach(key => {
        const count = inventory[key];
        const good = GOODS[key];
        // Calculate Price: Base * Port Demand * Random Fluctuation
        const price = Math.floor(good.baseCost * port.demandMod * (0.8 + Math.random() * 0.4));
        revenue += count * price;
    });

    setGold(prev => prev + revenue);
    setInventory({ COTTON: 0, COLONIAL: 0, ARMS: 0 });
    setNotoriety(prev => Math.max(0, prev - 5)); // Cooling off slightly
    addLog(`Sold all cargo for £${revenue}.`, "success");
  };

  const returnToLondon = () => {
      setLocation('LONDON');
      setGameState('DOCK');
      addLog("Returned to London to restock.", "neutral");
      advanceTime();
  };

  const advanceTime = () => {
      let newMonth = month + 1;
      let newYear = year;
      if (newMonth > 12) {
          newMonth = 1;
          newYear += 1;
          historicalEvent(newYear);
      }
      setMonth(newMonth);
      setYear(newYear);

      if (newYear > END_YEAR) {
          setGameState('VICTORY');
      }
  };

  const historicalEvent = (yr: number) => {
      if (yr === 1807) addLog("News: Orders in Council! Britain retaliates against France.", "warning");
      if (yr === 1810) addLog("News: The Trianon Tariff! French raise tariffs on smuggled goods.", "danger");
      if (yr === 1812) addLog("News: Napoleon marches on Russia! Port security is lax.", "success");
      if (yr === 1814) addLog("News: Napoleon abdicates! The blockade is crumbling.", "success");
  };

  // --- RENDERERS ---

  const currentLocation = PORTS.find(p => p.id === location);

  if (gameState === 'GAMEOVER') {
      return (
          <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
              <div className="text-center space-y-4">
                  <Skull size={64} className="mx-auto text-red-600" />
                  <h1 className="text-4xl font-serif">Captured</h1>
                  <p>Your ship rots in a French drydock. The Blockade stands.</p>
                  <Button onClick={() => window.location.reload()} variant="neutral">Try Again</Button>
              </div>
          </div>
      );
  }

  if (gameState === 'VICTORY') {
      return (
          <div className="min-h-screen bg-[#1a237e] text-white flex items-center justify-center p-4">
              <div className="text-center space-y-4">
                  <Anchor size={64} className="mx-auto text-yellow-400" />
                  <h1 className="text-4xl font-serif">Rule Britannia!</h1>
                  <p className="text-slate-900">The war is over. You retired with £{gold}. You are a legend of the merchant navy.</p>
                  <Button onClick={() => window.location.reload()} variant="gold">Play Again</Button>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#d7ccc8] font-serif text-slate-900 p-4 bg-cover" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/parchment.png")'}}>
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center border-b-4 border-slate-900 pb-4 mb-6">
            <div>
                <h1 className="text-3xl font-black flex items-center gap-2"><Ship /> The Blockade Runner</h1>
                <p className="italic">{month}/{year} | Location: {currentLocation?.name}</p>
            </div>
            <div className="text-right">
                <div className="text-3xl font-bold flex items-center justify-end gap-2 text-[#1a237e]">
                    <Coins /> £{gold}
                </div>
                <div className="text-sm font-sans flex items-center justify-end gap-1">
                    Notoriety: <span className={notoriety > 50 ? 'text-red-700 font-bold' : ''}>{Math.floor(notoriety)}%</span>
                </div>
            </div>
        </div>

        {/* MAIN GAMEPLAY */}
        <div className="grid md:grid-cols-2 gap-6">
            
            {/* LEFT: INTERFACE */}
            <div className="space-y-6">
                
                {/* DOCK VIEW */}
                {gameState === 'DOCK' && location === 'LONDON' && (
                    <div className="bg-[#efebe9] p-4 rounded border-2 border-[#a1887f] shadow-lg">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Anchor/> London Market</h2>
                        <div className="space-y-2">
                            {(Object.keys(GOODS) as GoodType[]).map(key => (
                                <div key={key} className="flex justify-between items-center bg-white p-2 rounded border border-[#d7ccc8]">
                                    <div>
                                        <div className="font-bold">{GOODS[key].name}</div>
                                        <div className="text-xs">Cost: £{GOODS[key].baseCost}</div>
                                    </div>
                                    <Button size="sm" onClick={() => buyGoods(key)} variant="primary">Buy</Button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-[#a1887f]">
                            <h3 className="font-bold mb-2">Set Course For:</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {PORTS.filter(p => p.id !== 'LONDON').map(port => (
                                    <Button key={port.id} variant="neutral" className="text-sm" onClick={() => setSail(port.id)}>
                                        {port.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'DOCK' && location !== 'LONDON' && currentLocation && (
                     <div className="bg-[#efebe9] p-4 rounded border-2 border-[#a1887f] shadow-lg">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MapIcon/> {currentLocation.name}</h2>
                        <p className="mb-4">{currentLocation.desc}</p>
                        <div className="p-4 bg-white border rounded text-center mb-4">
                            <div className="text-sm uppercase tracking-widest mb-1">Cargo Value Here</div>
                            <div className="text-2xl font-bold text-green-800">High Demand</div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button variant="gold" onClick={sellGoods} disabled={getInventoryCount() === 0}>
                                Sell All Goods
                            </Button>
                            <Button variant="primary" onClick={returnToLondon}>
                                Return to London
                            </Button>
                        </div>
                     </div>
                )}

                {gameState === 'SAILING' && (
                    <div className="bg-[#1a237e] text-white p-8 rounded border-4 border-double border-yellow-500 shadow-xl flex flex-col items-center justify-center h-64 animate-pulse">
                        <Wind size={64} className="mb-4"/>
                        <h2 className="text-2xl font-bold mb-2">Crossing the Channel...</h2>
                        <p className="italic">Dodging French Privateers...</p>
                    </div>
                )}

                {gameState === 'ENCOUNTER' && encounterData && (
                    <div className="bg-[#b71c1c] text-white p-6 rounded border-4 border-double border-yellow-500 shadow-xl">
                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><AlertCircle/> {encounterData.title}</h2>
                        <p className="mb-6">{encounterData.desc}</p>
                        <div className="space-y-3">
                            <Button variant="neutral" className="w-full text-black" onClick={() => handleEncounter('BRIBE')}>
                                Bribe Officer (£{100 + (year - START_YEAR) * 20})
                            </Button>
                            <Button variant="gold" className="w-full" onClick={() => handleEncounter('RUN')}>
                                Full Sail! (Risk Cargo)
                            </Button>
                            <Button variant="neutral" className="w-full text-black bg-slate-300" onClick={() => handleEncounter('FIGHT')}>
                                Open Fire! (Risk Ship)
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT: INFO */}
            <div className="space-y-6">
                
                {/* CARGO MANIFEST */}
                <div className="bg-white p-4 rounded border-2 border-slate-900">
                    <h3 className="font-bold text-sm uppercase tracking-widest border-b mb-2">Ship's Manifest</h3>
                    {getInventoryCount() === 0 ? <p className="italic text-slate-900">Empty Hold</p> : (
                        <ul className="space-y-1 text-sm">
                            {inventory.COTTON > 0 && <li>{inventory.COTTON}x Cotton Bales</li>}
                            {inventory.COLONIAL > 0 && <li>{inventory.COLONIAL}x Sugar Crates</li>}
                            {inventory.ARMS > 0 && <li>{inventory.ARMS}x Muskets (Contraband)</li>}
                        </ul>
                    )}
                    <div className="mt-4 pt-2 border-t text-xs text-right text-slate-900">
                        Capacity: {getInventoryCount()} / 50
                    </div>
                </div>

                {/* LOGS */}
                <div className="bg-[#efebe9] p-4 rounded border shadow-inner h-64 overflow-y-auto font-mono text-sm" style={{scrollbarWidth: 'thin'}}>
                    <h3 className="font-bold text-xs uppercase mb-2 text-slate-900">Captain's Log</h3>
                    <div className="space-y-2">
                        {logs.map(log => (
                            <div key={log.id} className={`p-1 border-l-2 pl-2 ${
                                log.type === 'danger' ? 'border-red-600 text-red-900' : 
                                log.type === 'success' ? 'border-green-600 text-green-900' : 'border-slate-400'
                            }`}>
                                {log.msg}
                            </div>
                        ))}
                        <div ref={logsEndRef} />
                    </div>
                </div>
            </div>

        </div>

        {/* FOOTER TIP */}
        <div className="mt-8 text-center text-sm italic text-slate-900">
            "The Continental System was not a blockade of Britain by Europe, but a self-blockade of Europe by Napoleon."
        </div>

      </div>
    </div>
  );
}