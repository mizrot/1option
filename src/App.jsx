import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Plus, Trash2, Check, X, Play, Edit3, Trophy, 
  AlertCircle, ArrowRight, BrainCircuit, Settings, 
  Download, Upload, RotateCcw, PartyPopper 
} from 'lucide-react';
import './App.css';

// --- Default Initial Data ---
const DEFAULT_DATA = [
  {
    id: 'col-1',
    title: 'Capital of France',
    words: [
      { id: 'w-1', text: 'Lyon', isRight: false },
      { id: 'w-2', text: 'Paris', isRight: true },
      { id: 'w-3', text: 'Marseille', isRight: false },
    ]
  },
  {
    id: 'col-2',
    title: 'Fastest Land Animal',
    words: [
      { id: 'w-4', text: 'Cheetah', isRight: true },
      { id: 'w-5', text: 'Lion', isRight: false },
    ]
  }
];

// --- Shared Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, ...props }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-sm";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
    danger: "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700 shadow-none",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Main Component ---

export default function App() {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem('veriflash-data');
    return saved ? JSON.parse(saved) : DEFAULT_DATA;
  });
  const [mode, setMode] = useState('edit');
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('veriflash-data', JSON.stringify(columns));
  }, [columns]);

  // --- File I/O ---

  const handleExport = () => {
    const dataStr = JSON.stringify(columns, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `veriflash-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          setColumns(importedData);
          alert('Data loaded successfully!');
        } else {
          alert('Invalid file format: Data must be an array.');
        }
      } catch (err) {
        alert('Error parsing JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = null; 
  };

  // --- CRUD Actions ---

  const addColumn = () => {
    const newCol = {
      id: crypto.randomUUID(),
      title: 'New Category',
      words: [
        { id: crypto.randomUUID(), text: 'Option 1', isRight: true },
        { id: crypto.randomUUID(), text: 'Option 2', isRight: false }
      ]
    };
    setColumns([...columns, newCol]);
  };

  const updateColumnTitle = (colId, newTitle) => {
    setColumns(columns.map(col => col.id === colId ? { ...col, title: newTitle } : col));
  };

  const deleteColumn = (colId) => {
    setColumns(columns.filter(col => col.id !== colId));
  };

  const addWordToColumn = (colId) => {
    setColumns(columns.map(col => {
      if (col.id === colId) {
        return {
          ...col,
          words: [...col.words, { id: crypto.randomUUID(), text: 'New Word', isRight: false }]
        };
      }
      return col;
    }));
  };

  const updateWordText = (colId, wordId, newText) => {
    setColumns(columns.map(col => {
      if (col.id === colId) {
        return {
          ...col,
          words: col.words.map(w => w.id === wordId ? { ...w, text: newText } : w)
        };
      }
      return col;
    }));
  };

  const setRightWord = (colId, wordId) => {
    setColumns(columns.map(col => {
      if (col.id === colId) {
        return {
          ...col,
          words: col.words.map(w => ({ ...w, isRight: w.id === wordId }))
        };
      }
      return col;
    }));
  };

  const deleteWord = (colId, wordId) => {
    setColumns(columns.map(col => {
      if (col.id === colId) {
        return {
          ...col,
          words: col.words.filter(w => w.id !== wordId)
        };
      }
      return col;
    }));
  };

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <BrainCircuit size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">VeriFlash</h1>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setMode('edit')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === 'edit' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="flex items-center gap-2"><Edit3 size={16}/> Editor</span>
            </button>
            <button
              onClick={() => setMode('test')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === 'test' 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="flex items-center gap-2"><Play size={16}/> Test</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {mode === 'edit' ? (
          <>
            <EditView 
              columns={columns} 
              onAddColumn={addColumn}
              onUpdateTitle={updateColumnTitle}
              onDeleteColumn={deleteColumn}
              onAddWord={addWordToColumn}
              onUpdateWord={updateWordText}
              onSetRight={setRightWord}
              onDeleteWord={deleteWord}
            />
            
            <div className="mt-12 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Local File Management</h3>
              <div className="flex gap-4">
                <Button variant="secondary" onClick={handleExport}>
                  <Download size={16} /> Save to Drive (JSON)
                </Button>
                <Button variant="secondary" onClick={handleImportClick}>
                  <Upload size={16} /> Load from Drive
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".json" 
                  className="hidden" 
                />
              </div>
            </div>
          </>
        ) : (
          <TestView columns={columns} onBack={() => setMode('edit')} />
        )}
      </main>
    </div>
  );
}

// --- Sub-Components ---

function EditView({ 
  columns, onAddColumn, onUpdateTitle, onDeleteColumn,
  onAddWord, onUpdateWord, onSetRight, onDeleteWord 
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Data Editor</h2>
          <p className="text-slate-500">Add categories and mark the correct answer.</p>
        </div>
        <Button onClick={onAddColumn}>
          <Plus size={18} /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {columns.map(col => (
          <div key={col.id} className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <input 
                value={col.title}
                onChange={(e) => onUpdateTitle(col.id, e.target.value)}
                className="flex-1 bg-transparent font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded px-1 -ml-1"
                placeholder="Category Title..."
              />
              <button onClick={() => onDeleteColumn(col.id)} className="text-slate-400 hover:text-rose-500 p-1 rounded">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="p-2 flex-1 space-y-1 max-h-[400px] overflow-y-auto">
              {col.words.map(word => (
                <div key={word.id} className={`group flex items-center gap-2 p-2 rounded-lg border transition-all ${word.isRight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-transparent hover:border-slate-100'}`}>
                  <button
                    onClick={() => onSetRight(col.id, word.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${word.isRight ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-emerald-400'}`}
                  >
                    <Check size={12} strokeWidth={3} />
                  </button>
                  <input
                    value={word.text}
                    onChange={(e) => onUpdateWord(col.id, word.id, e.target.value)}
                    className="flex-1 bg-transparent text-sm focus:outline-none w-full min-w-0"
                    placeholder="Enter word..."
                  />
                  <button onClick={() => onDeleteWord(col.id, word.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 p-1">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50/50">
              <button onClick={() => onAddWord(col.id)} className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-dashed border-slate-300 hover:border-blue-200">
                <Plus size={14} /> Add Word
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestView({ columns, onBack }) {
  const [currentCard, setCurrentCard] = useState(null);
  const [gameState, setGameState] = useState('playing'); // playing | feedback | finished
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState({ correct: 0, total: 0, streak: 0 });
  const [shaking, setShaking] = useState(false);
  
  // New State for Weighted Algorithm
  const [testDeck, setTestDeck] = useState([]);
  const [completedCardIds, setCompletedCardIds] = useState(new Set());
  const [isDeckReady, setIsDeckReady] = useState(false);

  // 1. Initialize Deck with Weights
  useEffect(() => {
    const newDeck = [];
    const validColumns = columns.filter(col => col.words.length > 0);
    
    if (validColumns.length === 0) {
      setIsDeckReady(true);
      return;
    }

    validColumns.forEach(col => {
      const rightWords = col.words.filter(w => w.isRight);
      const wrongWords = col.words.filter(w => !w.isRight);
      
      // Calculate weights to ensure 50/50 probability per category
      // If a column has 1 Right and 4 Wrong:
      // Right gets weight 1.0 (Total Right mass = 1)
      // Wrong gets weight 0.25 (Total Wrong mass = 1)
      const weight = col.words.length > 0 ? 1 / col.words.length : 0;

      col.words.forEach(word => {
        newDeck.push({
          uniqueId: `${col.id}-${word.id}`, // Unique tracking ID
          word: word,
          column: col,
          weight: weight
        });
      });
    });

    setTestDeck(newDeck);
    setIsDeckReady(true);
  }, [columns]);

  // 2. Generate Card using Weights & History
  const generateCard = useCallback(() => {
    if (!isDeckReady || testDeck.length === 0) return null;

    // Filter out completed cards
    const availableCards = testDeck.filter(card => !completedCardIds.has(card.uniqueId));
    
    if (availableCards.length === 0) return 'finished';

    // Weighted Random Selection (Python random.choices equivalent)
    const totalWeight = availableCards.reduce((sum, card) => sum + card.weight, 0);
    let randomThreshold = Math.random() * totalWeight;

    for (const card of availableCards) {
      if (randomThreshold < card.weight) {
        return card;
      }
      randomThreshold -= card.weight;
    }
    
    return availableCards[availableCards.length - 1]; // Fallback for floating point errors
  }, [isDeckReady, testDeck, completedCardIds]);

  // Trigger first card load
  useEffect(() => {
    if (isDeckReady && !currentCard) {
      const card = generateCard();
      if (card === 'finished') {
        setGameState('finished');
      } else {
        setCurrentCard(card);
      }
    }
  }, [isDeckReady, generateCard, currentCard]);

  const handleGuess = (userGuessedRight) => {
    if (gameState !== 'playing' || !currentCard) return;
    const isActuallyRight = currentCard.word.isRight;
    const isUserCorrect = (userGuessedRight && isActuallyRight) || (!userGuessedRight && !isActuallyRight);

    setResult(isUserCorrect ? 'correct' : 'incorrect');
    setGameState('feedback');

    if (isUserCorrect) {
      setStats(prev => ({ correct: prev.correct + 1, total: prev.total + 1, streak: prev.streak + 1 }));
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setStats(prev => ({ correct: prev.correct, total: prev.total + 1, streak: 0 }));
    }
  };

  const nextCard = () => {
    // Add current to completed list
    if (currentCard) {
      setCompletedCardIds(prev => new Set(prev).add(currentCard.uniqueId));
    }

    setResult(null);
    setGameState('playing');
    
    // Generate next
    // Note: We need to use the functional update or updated set for immediate generation
    // But since generateCard relies on state, we rely on the next render cycle 
    // effectively by setting currentCard to null momentarily or calling generator with updated ignore list logic.
    // However, simplest React pattern here is:
    const newCompleted = new Set(completedCardIds);
    newCompleted.add(currentCard.uniqueId);
    
    // Use local Logic for immediate update to avoid flicker or wait
    const availableCards = testDeck.filter(card => !newCompleted.has(card.uniqueId));
    
    if (availableCards.length === 0) {
      setGameState('finished');
      setCurrentCard(null);
      return;
    }

    // Logic repeated here for immediate next card without useEffect lag
    const totalWeight = availableCards.reduce((sum, card) => sum + card.weight, 0);
    let randomThreshold = Math.random() * totalWeight;
    let next = availableCards[availableCards.length - 1];

    for (const card of availableCards) {
      if (randomThreshold < card.weight) {
        next = card;
        break;
      }
      randomThreshold -= card.weight;
    }

    setCurrentCard(next);
  };

  const restart = () => {
    setCompletedCardIds(new Set());
    setStats({ correct: 0, total: 0, streak: 0 });
    setGameState('playing');
    setCurrentCard(null); 
    // This will trigger the useEffect to load the first card again
  };

  // --- Render States ---

  if (!isDeckReady) return <div className="p-12 text-center text-slate-500">Preparing Deck...</div>;

  if (testDeck.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <AlertCircle size={48} className="text-amber-500" />
        <h2 className="text-2xl font-bold">Not enough data</h2>
        <p className="text-slate-500">Add categories and words in the Editor to start.</p>
        <Button onClick={onBack} variant="secondary">Back to Editor</Button>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in">
        <div className="bg-emerald-100 p-6 rounded-full text-emerald-600 mb-2">
          <PartyPopper size={64} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800">Session Complete!</h2>
          <p className="text-slate-500 mt-2">You have reviewed all available cards.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-center">
            <div className="text-xs font-bold text-slate-400 uppercase">Score</div>
            <div className="text-2xl font-black text-slate-800">{Math.round((stats.correct / stats.total) * 100) || 0}%</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold text-slate-400 uppercase">Streak</div>
            <div className="text-2xl font-black text-orange-500">{stats.streak}</div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={restart} variant="primary">
            <RotateCcw size={18} /> Start Over
          </Button>
          <Button onClick={onBack} variant="secondary">
            Back to Editor
          </Button>
        </div>
      </div>
    );
  }

  if (!currentCard) return <div className="p-12 text-center text-slate-500">Loading Card...</div>;

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Trophy size={20} /></div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Score</div>
            <div className="text-xl font-bold">{stats.correct} / {stats.total}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 font-bold uppercase">Streak</div>
          <div className={`text-xl font-bold ${stats.streak > 2 ? 'text-orange-500' : 'text-slate-400'}`}>{stats.streak} 🔥</div>
        </div>
      </div>

      <div className="relative perspective-1000">
        <div className={`relative bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-12 text-center transition-all duration-300 ${shaking ? 'animate-shake border-rose-300' : ''} ${result === 'correct' ? 'ring-4 ring-emerald-100 border-emerald-200' : ''} ${result === 'incorrect' ? 'ring-4 ring-rose-100 border-rose-200' : ''}`}>
          
          <div className="inline-block bg-slate-100 text-slate-600 text-sm font-medium px-3 py-1 rounded-full mb-6">
            Category: {currentCard.column.title}
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-12 tracking-tight">
            {currentCard.word.text}
          </h2>

          {gameState === 'feedback' && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center z-10 animate-fade-in">
              <div className={`mb-4 p-4 rounded-full ${result === 'correct' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {result === 'correct' ? <Check size={48} /> : <X size={48} />}
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${result === 'correct' ? 'text-emerald-700' : 'text-rose-700'}`}>
                {result === 'correct' ? 'Correct!' : 'Oops!'}
              </h3>
              <p className="text-slate-500 mb-6 px-8">
                The correct answer is <span className="font-bold text-slate-800">{currentCard.column.words.find(w => w.isRight)?.text}</span>
              </p>
              <Button onClick={nextCard} className="w-48 py-3 text-lg">Next Card <ArrowRight size={20} /></Button>
            </div>
          )}

          <div className={`grid grid-cols-2 gap-4 transition-opacity duration-200 ${gameState === 'feedback' ? 'opacity-0' : 'opacity-100'}`}>
            <button onClick={() => handleGuess(false)} className="group flex flex-col items-center p-6 rounded-2xl border-2 border-rose-100 bg-rose-50 hover:bg-rose-100 hover:border-rose-200 hover:-translate-y-1 transition-all">
              <div className="mb-2 bg-white text-rose-500 p-2 rounded-full shadow-sm group-hover:scale-110"><X size={24} /></div>
              <span className="font-bold text-rose-700">Incorrect</span>
            </button>
            <button onClick={() => handleGuess(true)} className="group flex flex-col items-center p-6 rounded-2xl border-2 border-emerald-100 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-200 hover:-translate-y-1 transition-all">
              <div className="mb-2 bg-white text-emerald-500 p-2 rounded-full shadow-sm group-hover:scale-110"><Check size={24} /></div>
              <span className="font-bold text-emerald-700">Correct</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-slate-400 text-sm">
        Cards remaining: {testDeck.length - completedCardIds.size} / {testDeck.length}
      </div>
    </div>
  );
}
