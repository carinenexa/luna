import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Save, Loader2, Moon as MoonIcon, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JournalProps {
  date: Date;
}

export const MoonJournal: React.FC<JournalProps> = ({ date }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const dateStr = format(date, 'yyyy-MM-dd');

  useEffect(() => {
    const fetchNote = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/notes/${dateStr}`);
        const data = await res.json();
        setContent(data.content || '');
      } catch (err) {
        console.error('Failed to fetch note:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNote();
  }, [dateStr]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr, content }),
      });
    } catch (err) {
      console.error('Failed to save note:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="glass-panel p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg">
            <Edit3 className="w-5 h-5 text-moon-glow" />
          </div>
          <div>
            <h3 className="text-lg font-serif italic text-moon-glow">Réflexions Lunaires</h3>
            <p className="text-xs text-slate-400 capitalize">{format(date, 'EEEE d MMMM', { locale: fr })}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded-full transition-all text-sm font-medium"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Enregistrer
        </button>
      </div>

      <div className="relative flex-1">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-white/20" />
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Comment vous sentez-vous durant cette phase lunaire ? Notez vos intentions, vos rêves ou vos réflexions..."
            className="w-full h-full bg-transparent border-none focus:ring-0 text-slate-300 placeholder:text-slate-600 resize-none font-sans leading-relaxed text-sm"
          />
        )}
      </div>
    </div>
  );
};
