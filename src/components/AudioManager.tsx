import { useState } from 'react';
import { X, Upload, Plus, Trash2, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';

interface WordItem {
  text: string;
  color: string;
  audioUrl?: string;
}

interface AudioManagerProps {
  words: WordItem[];
  onClose: () => void;
  onAudioUpload: (word: string, file: File) => void;
  onAddWord: (text: string, color: string) => void;
  onRemoveWord: (text: string) => void;
}

export function AudioManager({ 
  words, 
  onClose, 
  onAudioUpload, 
  onAddWord, 
  onRemoveWord 
}: AudioManagerProps) {
  const [newWord, setNewWord] = useState('');
  const [newColor, setNewColor] = useState('#FF0000');

  const handleFileChange = (word: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      onAudioUpload(word, file);
    }
  };

  const handleAddWord = () => {
    if (newWord.trim()) {
      onAddWord(newWord.trim(), newColor);
      setNewWord('');
      setNewColor('#FF0000');
    }
  };

  const testWord = (word: WordItem) => {
    if (word.audioUrl) {
      const audio = new Audio(word.audioUrl);
      audio.play();
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word.text);
      utterance.lang = 'he-IL';
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl">ניהול מילים וקולות</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          {/* הוספת מילה חדשה */}
          <div className="space-y-2">
            <h3 className="font-medium">הוסף מילה חדשה</h3>
            <div className="flex gap-2">
              <Input
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="שם המילה (לדוגמא: אבא, אדום)"
                className="flex-1"
                dir="rtl"
              />
              <Input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-20"
              />
              <Button onClick={handleAddWord}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* רשימת מילים */}
          <div className="space-y-2">
            <h3 className="font-medium">מילים קיימות</h3>
            <ScrollArea className="h-[400px] border rounded-lg p-4">
              <div className="space-y-3">
                {words.map((word) => (
                  <div
                    key={word.text}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className="w-10 h-10 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: word.color }}
                    />
                    <div className="flex-1 text-right">
                      <div className="font-medium">{word.text}</div>
                      {word.audioUrl && (
                        <div className="text-xs text-green-600">✓ יש קובץ קול מותאם</div>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => testWord(word)}
                      title="נגן"
                    >
                      <Play className="h-4 w-4" />
                    </Button>

                    <label className="cursor-pointer">
                      <Button variant="outline" size="icon" asChild>
                        <div>
                          <Upload className="h-4 w-4" />
                        </div>
                      </Button>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(word.text, e)}
                      />
                    </label>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveWord(word.text)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="text-sm text-gray-600 space-y-1 border-t pt-4">
            <p>💡 <strong>טיפים:</strong></p>
            <p className="mr-6">• לחץ על <Upload className="inline h-3 w-3" /> להעלאת קובץ קול מותאם אישית</p>
            <p className="mr-6">• לחץ על <Play className="inline h-3 w-3" /> לבדיקת הקול</p>
            <p className="mr-6">• ללא קובץ מותאם, המערכת תקרא את המילה אוטומטית</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
