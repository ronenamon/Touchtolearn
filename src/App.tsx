import { useState, useRef } from 'react';
import { TouchRipple } from './components/TouchRipple';
import { AudioManager } from './components/AudioManager';
import { Settings } from 'lucide-react';
import { Button } from './components/ui/button';

interface Touch {
  id: number;
  x: number;
  y: number;
  color: string;
  word: string;
}

interface WordItem {
  text: string;
  color: string;
  audioUrl?: string;
}

const defaultWords: WordItem[] = [
  // צבעים
  { text: 'אדום', color: '#FF0000' },
  { text: 'כחול', color: '#0066FF' },
  { text: 'ירוק', color: '#00CC00' },
  { text: 'צהוב', color: '#FFD700' },
  { text: 'כתום', color: '#FF8800' },
  { text: 'סגול', color: '#9933FF' },
  { text: 'ורוד', color: '#FF69B4' },
  { text: 'חום', color: '#8B4513' },
  { text: 'לבן', color: '#FFFFFF' },
  { text: 'שחור', color: '#000000' },
  
  // שמות משפחה
  { text: 'אבא', color: '#4169E1' },
  { text: 'אמא', color: '#FF1493' },
  { text: 'סבא', color: '#6495ED' },
  { text: 'סבתא', color: '#FF69B4' },
  { text: 'אח', color: '#32CD32' },
  { text: 'אחות', color: '#FFB6C1' },
  { text: 'תינוק', color: '#FFE4B5' },
];

export default function App() {
  const [touches, setTouches] = useState<Touch[]>([]);
  const [backgroundColor, setBackgroundColor] = useState('#1a1a1a');
  const [words, setWords] = useState<WordItem[]>(defaultWords);
  const [showSettings, setShowSettings] = useState(false);
  const [currentWord, setCurrentWord] = useState<string>('');
  const touchIdRef = useRef(0);

  const speak = (text: string, audioUrl?: string) => {
    // אם יש קובץ אודיו מותאם אישית, נגן אותו
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(err => console.error('Error playing audio:', err));
      return;
    }

    // אחרת, השתמש ב-Web Speech API
    if ('speechSynthesis' in window) {
      // עצור כל דיבור קודם
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'he-IL';
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTouch = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    
    if ('touches' in e) {
      Array.from(e.touches).forEach((touch) => {
        addTouchEffect(touch.clientX, touch.clientY);
      });
    } else {
      addTouchEffect(e.clientX, e.clientY);
    }
  };

  const addTouchEffect = (x: number, y: number) => {
    // בחר מילה רנדומלית
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const id = touchIdRef.current++;
    
    // הוסף מגע חדש
    setTouches(prev => [...prev, { 
      id, 
      x, 
      y, 
      color: randomWord.color,
      word: randomWord.text 
    }]);
    
    // שנה צבע רקע
    setBackgroundColor(randomWord.color + '20');
    
    // הצג את המילה הנוכחית
    setCurrentWord(randomWord.text);
    setTimeout(() => setCurrentWord(''), 1500);
    
    // קרא את המילה
    speak(randomWord.text, randomWord.audioUrl);
    
    // הסר מגע לאחר האנימציה
    setTimeout(() => {
      setTouches(prev => prev.filter(t => t.id !== id));
    }, 1000);
  };

  const handleAudioUpload = (word: string, file: File) => {
    const audioUrl = URL.createObjectURL(file);
    setWords(prev => prev.map(w => 
      w.text === word ? { ...w, audioUrl } : w
    ));
  };

  const addCustomWord = (text: string, color: string) => {
    setWords(prev => [...prev, { text, color }]);
  };

  const removeWord = (text: string) => {
    setWords(prev => prev.filter(w => w.text !== text));
  };

  return (
    <div 
      className="fixed inset-0 overflow-hidden select-none transition-colors duration-500"
      style={{ backgroundColor }}
    >
      <div
        className="absolute inset-0 cursor-pointer bg-[rgba(0,0,0,0)]"
        onTouchStart={handleTouch}
        onTouchMove={handleTouch}
        onMouseDown={handleTouch}
      >
        {touches.map(touch => (
          <TouchRipple 
            key={touch.id} 
            x={touch.x} 
            y={touch.y} 
            color={touch.color}
            word={touch.word}
          />
        ))}
        
        {currentWord && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center pointer-events-none">
            <div 
              className="text-[120px] drop-shadow-lg"
              style={{ 
                textShadow: '0 0 30px rgba(0,0,0,0.5)',
              }}
            >
              {currentWord}
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white text-center px-4 pointer-events-none">
        <h1 className="text-4xl drop-shadow-lg mb-2" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          תלחץ על המסך
        </h1>
        <p className="text-sm text-white/70">גע במסך ללמידת צבעים ושמות</p>
      </div>

      <Button
        className="absolute top-4 right-4 z-10"
        variant="secondary"
        size="icon"
        onClick={() => setShowSettings(!showSettings)}
      >
        <Settings className="h-5 w-5" />
      </Button>

      {showSettings && (
        <AudioManager
          words={words}
          onClose={() => setShowSettings(false)}
          onAudioUpload={handleAudioUpload}
          onAddWord={addCustomWord}
          onRemoveWord={removeWord}
        />
      )}
    </div>
  );
}
