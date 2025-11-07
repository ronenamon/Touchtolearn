import { useState, useRef, useEffect } from "react";
import { MagicParticles } from "./components/MagicParticles";
import { FloatingBackground } from "./components/FloatingBackground";
import { DecorativeFrame } from "./components/DecorativeFrame";
import { AudioManager } from "./components/AudioManager";
import { Settings, Volume2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { motion } from "motion/react";

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
  { text: "אדום", color: "#FF0000" },
  { text: "כחול", color: "#0066FF" },
  { text: "ירוק", color: "#00CC00" },
  { text: "צהוב", color: "#FFD700" },
  { text: "כתום", color: "#FF8800" },
  { text: "סגול", color: "#9933FF" },
  { text: "ורוד", color: "#FF69B4" },
  { text: "לבן", color: "#FFFFFF" },

  // שמות משפחה
  { text: "אבא", color: "#4169E1" },
  { text: "אמא", color: "#FF1493" },
  { text: "סבא", color: "#6495ED" },
  { text: "סבתא", color: "#FF69B4" },
  { text: "אח", color: "#32CD32" },
  { text: "אחות", color: "#FFB6C1" },
  { text: "תינוק", color: "#FFE4B5" },
];

export default function App() {
  const [touches, setTouches] = useState<Touch[]>([]);
  const [backgroundColor, setBackgroundColor] =
    useState("#1a1a1a");
  const [gradientColors, setGradientColors] = useState<string[]>([
    "#87CEEB", "#B0E0E6", "#ADD8E6", "#E0F6FF"
  ]);
  const [words, setWords] = useState<WordItem[]>(defaultWords);
  const [showSettings, setShowSettings] = useState(false);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [currentColor, setCurrentColor] = useState<string>("");
  const [isClickable, setIsClickable] = useState<boolean>(true);
  const touchIdRef = useRef(0);

  const speak = (text: string, audioUrl?: string) => {
    // אם יש קובץ אודיו מותאם אישית, נגן אותו
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio
        .play()
        .catch((err) =>
          console.error("Error playing audio:", err),
        );
      return;
    }

    // אחרת, השתמש ב-Web Speech API
    if ("speechSynthesis" in window) {
      // עצור כל דיבור קודם
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "he-IL";
      utterance.rate = 0.7;
      utterance.pitch = 1.3;

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTouch = (
    e: React.TouchEvent | React.MouseEvent,
  ) => {
    // בדוק אם אפשר ללחוץ
    if (!isClickable) return;
    
    e.preventDefault();

    if ("touches" in e) {
      Array.from(e.touches).forEach((touch) => {
        addTouchEffect(touch.clientX, touch.clientY);
      });
    } else {
      addTouchEffect(e.clientX, e.clientY);
    }
  };

  const addTouchEffect = (x: number, y: number) => {
    // חסום לחיצות נוספות
    setIsClickable(false);
    
    // בחר מילה רנדומלית
    const randomWord =
      words[Math.floor(Math.random() * words.length)];
    const id = touchIdRef.current++;

    // הוסף מגע חדש
    setTouches((prev) => [
      ...prev,
      {
        id,
        x,
        y,
        color: randomWord.color,
        word: randomWord.text,
      },
    ]);

    // שנה צבעי גרדיאנט
    setGradientColors([
      randomWord.color,
      adjustColor(randomWord.color, 20),
      adjustColor(randomWord.color, -20),
      adjustColor(randomWord.color, 40),
    ]);

    // הצג את המילה הנוכחית למשך 2 שניות
    setCurrentWord(randomWord.text);
    setCurrentColor(randomWord.color);

    // קרא את המילה
    speak(randomWord.text, randomWord.audioUrl);

    // הסר אפקטים ויזואליים אחרי 1.5 שניות
    setTimeout(() => {
      setTouches((prev) => prev.filter((t) => t.id !== id));
    }, 1500);

    // הסר את המילה ואפשר לחיצה חדשה אחרי 2 שניות
    setTimeout(() => {
      setCurrentWord("");
      setCurrentColor("");
      setIsClickable(true);
    }, 2000);
  };

  // פונקציה לשינוי גוון הצבע
  const adjustColor = (color: string, amount: number) => {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const handleAudioUpload = (word: string, file: File) => {
    const audioUrl = URL.createObjectURL(file);
    setWords((prev) =>
      prev.map((w) =>
        w.text === word ? { ...w, audioUrl } : w,
      ),
    );
  };

  const addCustomWord = (text: string, color: string) => {
    setWords((prev) => [...prev, { text, color }]);
  };

  const removeWord = (text: string) => {
    setWords((prev) => prev.filter((w) => w.text !== text));
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none transition-all duration-1000"
      style={{ 
        background: currentWord 
          ? `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]}, ${gradientColors[2]}, ${gradientColors[3]})`
          : 'linear-gradient(180deg, #87CEEB 0%, #E0F6FF 100%)',
      }}
    >
      {/* רקע עם צורות מרחפות */}
      <FloatingBackground />

      {/* מסגרת דקורטיבית */}
      <DecorativeFrame />

      <div
        className="absolute inset-0 cursor-pointer bg-[rgba(0,0,0,0)]"
        onTouchStart={handleTouch}
        onTouchMove={handleTouch}
        onMouseDown={handleTouch}
      >
        {touches.map((touch) => (
          <MagicParticles
            key={touch.id}
            x={touch.x}
            y={touch.y}
            color={touch.color}
            word={touch.word}
          />
        ))}

        {currentWord && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center pointer-events-none">
            <motion.div
              className="drop-shadow-2xl"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: [0, 1.3, 1], rotate: [0, 10, 0] }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <div
                className="text-[140px] px-8 py-4 rounded-[40px] backdrop-blur-md border-8 border-white/50"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
                  textShadow: `
                    4px 4px 0px rgba(0,0,0,0.1),
                    0 0 30px rgba(255,255,255,0.9)
                  `,
                  background: `linear-gradient(135deg, ${gradientColors[0]}ee, ${gradientColors[1]}ee)`,
                  color: '#fff',
                }}
              >
                {currentWord}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* כותרת עם אנימציה */}
      <motion.div 
        className="absolute top-12 left-1/2 -translate-x-1/2 text-center px-6 pointer-events-none z-20"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {!currentWord ? (
          <>
            <motion.div
              animate={{ 
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div
                className="text-3xl px-6 py-3 rounded-3xl backdrop-blur-sm border-3 border-white/40 inline-block mb-2"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  color: '#4A90E2',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                ✨ תלחץ על המסך ✨
              </div>
            </motion.div>
            <motion.p 
              className="text-sm px-4 py-2 rounded-xl backdrop-blur-sm inline-block mt-2"
              style={{
                background: 'rgba(255,255,255,0.7)',
                color: '#5A9FD4',
              }}
              animate={{ 
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Volume2 className="inline h-4 w-4 mr-1 mb-0.5" />
              גע במסך ללמידת צבעים ושמות
            </motion.p>
          </>
        ) : null}
      </motion.div>

      <Button
        className="absolute top-6 right-6 z-30 backdrop-blur-md border-4 border-white/50"
        variant="secondary"
        size="icon"
        onClick={() => setShowSettings(!showSettings)}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
          width: '60px',
          height: '60px',
        }}
      >
        <Settings className="h-7 w-7" />
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