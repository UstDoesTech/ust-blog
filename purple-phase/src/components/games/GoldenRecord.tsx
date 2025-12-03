import React, { useState } from 'react';
import { Database, CheckCircle, XCircle, Award, GripVertical } from 'lucide-react';

interface DataItem {
  id: string;
  value: string;
  source: string;
  type: 'name' | 'address';
}

const SOURCE_DATA: DataItem[] = [
  { id: 'sales-name', value: 'Jon Smith', source: 'Sales System', type: 'name' },
  { id: 'sales-address', value: '123 Main St.', source: 'Sales System', type: 'address' },
  { id: 'hr-name', value: 'John A. Smith', source: 'HR System', type: 'name' },
  { id: 'hr-address', value: 'PO Box 444.', source: 'HR System', type: 'address' },
  { id: 'crm-name', value: 'J. Smith', source: 'Legacy CRM', type: 'name' },
  { id: 'crm-address', value: '123 Main Street.', source: 'Legacy CRM', type: 'address' },
];

const CORRECT_ANSWERS = {
  name: 'John A. Smith',
  address: '123 Main Street.'
};

export default function GoldenRecord() {
  const [goldenRecord, setGoldenRecord] = useState<{
    name: DataItem | null;
    address: DataItem | null;
  }>({ name: null, address: null });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [draggedItem, setDraggedItem] = useState<DataItem | null>(null);

  const handleDragStart = (item: DataItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (slot: 'name' | 'address') => {
    if (!draggedItem) return;
    
    if (draggedItem.type === slot) {
      setGoldenRecord(prev => ({
        ...prev,
        [slot]: draggedItem
      }));
    }
    setDraggedItem(null);
  };

  const handleVerify = () => {
    if (!goldenRecord.name || !goldenRecord.address) {
      setFeedback({ type: 'error', message: 'Please fill both fields before verifying!' });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

    const nameCorrect = goldenRecord.name.value === CORRECT_ANSWERS.name;
    const addressCorrect = goldenRecord.address.value === CORRECT_ANSWERS.address;

    if (nameCorrect && addressCorrect) {
      setFeedback({ 
        type: 'success', 
        message: 'Perfect! You created the correct Golden Record by choosing the most complete and accurate data from each system.' 
      });
    } else {
      const errors = [];
      if (!nameCorrect) errors.push('Name should be the most complete version');
      if (!addressCorrect) errors.push('Address should be the most complete version');
      
      setFeedback({ 
        type: 'error', 
        message: `Not quite right. ${errors.join('. ')}.` 
      });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleReset = () => {
    setGoldenRecord({ name: null, address: null });
    setFeedback(null);
  };

  const getSystemColor = (source: string) => {
    switch(source) {
      case 'Sales System': return 'bg-blue-50 border-blue-300';
      case 'HR System': return 'bg-green-50 border-green-300';
      case 'Legacy CRM': return 'bg-purple-50 border-purple-300';
      default: return 'bg-slate-50 border-slate-300';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-slate-50 rounded-xl font-sans">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-slate-800 mb-2 flex items-center justify-center gap-2">
          <Award className="text-yellow-500" size={32} />
          GOLDEN RECORD CREATION
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto">
          Master Data Management: Drag the most <strong>complete and accurate</strong> data from each source system to create the single source of truth.
        </p>
      </div>

      {/* Source Systems */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Sales System */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold">
            <Database size={20} />
            <h3 className="text-sm uppercase tracking-wider">Sales System</h3>
          </div>
          <div className="space-y-2">
            {SOURCE_DATA.filter(d => d.source === 'Sales System').map(item => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item)}
                className="bg-white p-3 rounded border border-blue-200 cursor-move hover:shadow-md transition-shadow flex items-center gap-2"
              >
                <GripVertical size={16} className="text-slate-400" />
                <div className="flex-1">
                  <div className="text-xs text-slate-500 uppercase">{item.type}</div>
                  <div className="font-medium text-slate-800">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HR System */}
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3 text-green-700 font-bold">
            <Database size={20} />
            <h3 className="text-sm uppercase tracking-wider">HR System</h3>
          </div>
          <div className="space-y-2">
            {SOURCE_DATA.filter(d => d.source === 'HR System').map(item => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item)}
                className="bg-white p-3 rounded border border-green-200 cursor-move hover:shadow-md transition-shadow flex items-center gap-2"
              >
                <GripVertical size={16} className="text-slate-400" />
                <div className="flex-1">
                  <div className="text-xs text-slate-500 uppercase">{item.type}</div>
                  <div className="font-medium text-slate-800">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legacy CRM */}
        <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3 text-purple-700 font-bold">
            <Database size={20} />
            <h3 className="text-sm uppercase tracking-wider">Legacy CRM</h3>
          </div>
          <div className="space-y-2">
            {SOURCE_DATA.filter(d => d.source === 'Legacy CRM').map(item => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item)}
                className="bg-white p-3 rounded border border-purple-200 cursor-move hover:shadow-md transition-shadow flex items-center gap-2"
              >
                <GripVertical size={16} className="text-slate-400" />
                <div className="flex-1">
                  <div className="text-xs text-slate-500 uppercase">{item.type}</div>
                  <div className="font-medium text-slate-800">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Golden Record Area */}
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-4 border-yellow-400 rounded-xl p-6 shadow-xl relative">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 px-4 py-1 rounded-full">
          <span className="text-yellow-900 font-black text-sm uppercase tracking-wider flex items-center gap-1">
            <Award size={16} /> The Golden Record
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {/* Name Slot */}
          <div
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('name')}
            className={`min-h-20 border-2 border-dashed rounded-lg p-4 transition-all ${
              goldenRecord.name 
                ? `${getSystemColor(goldenRecord.name.source)} border-solid` 
                : 'border-yellow-300 bg-white/50 hover:bg-white/80'
            }`}
          >
            <div className="text-xs text-yellow-700 font-bold uppercase mb-2">Official Name</div>
            {goldenRecord.name ? (
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800 text-lg">{goldenRecord.name.value}</div>
                  <div className="text-xs text-slate-500">from {goldenRecord.name.source}</div>
                </div>
                <button
                  onClick={() => setGoldenRecord(prev => ({ ...prev, name: null }))}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="text-slate-400 italic text-sm">Drag name here...</div>
            )}
          </div>

          {/* Address Slot */}
          <div
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('address')}
            className={`min-h-20 border-2 border-dashed rounded-lg p-4 transition-all ${
              goldenRecord.address 
                ? `${getSystemColor(goldenRecord.address.source)} border-solid` 
                : 'border-yellow-300 bg-white/50 hover:bg-white/80'
            }`}
          >
            <div className="text-xs text-yellow-700 font-bold uppercase mb-2">Official Address</div>
            {goldenRecord.address ? (
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800 text-lg">{goldenRecord.address.value}</div>
                  <div className="text-xs text-slate-500">from {goldenRecord.address.source}</div>
                </div>
                <button
                  onClick={() => setGoldenRecord(prev => ({ ...prev, address: null }))}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="text-slate-400 italic text-sm">Drag address here...</div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleVerify}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-bold py-3 rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} /> Verify Golden Record
          </button>
          <button
            onClick={handleReset}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-6 py-3 rounded-lg shadow-md transition-all active:scale-95"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`mt-6 p-4 rounded-lg border-2 flex items-start gap-3 ${
          feedback.type === 'success' 
            ? 'bg-green-50 border-green-500 text-green-800' 
            : 'bg-red-50 border-red-500 text-red-800'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle className="text-green-600 shrink-0" size={24} />
          ) : (
            <XCircle className="text-red-600 shrink-0" size={24} />
          )}
          <p className="font-medium">{feedback.message}</p>
        </div>
      )}

      {/* Hint */}
      <div className="mt-6 text-center text-xs text-slate-500">
        <p><strong>Hint:</strong> Choose the version with the most detail. Middle initials, full street names, etc.</p>
      </div>
    </div>
  );
}
