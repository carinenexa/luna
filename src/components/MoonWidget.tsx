import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MoonData, getMoonPhaseIcon } from '../lib/moon';
import { MessageSquare, Quote, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface MoonWidgetProps {
  moonData: MoonData;
  onNavigateToJournal: () => void;
}

export const MoonWidget: React.FC<MoonWidgetProps> = ({ moonData, onNavigateToJournal }) => {
  const [todayNote, setTodayNote] = useState<string>('');
  const dateStr = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`/api/notes/${dateStr}`);
        const data = await res.json();
        if (data && data.content) {
          setTodayNote(data.content);
        }
      } catch (err) {
        console.error('Failed to fetch today note:', err);
      }
    };
    fetchNote();
  }, [dateStr]);

  return (
    <div className="space-y-6">
      {/* Main Moon Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 text-center relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-moon-glow/20 to-transparent" />
        
        <div className="relative z-10">
          <div className="text-8xl mb-4 drop-shadow-[0_0_20px_rgba(240,244,248,0.4)] transition-transform duration-700 group-hover:scale-110">
            {getMoonPhaseIcon(moonData.phase)}
          </div>
          <h2 className="text-2xl font-serif italic text-moon-glow mb-1">
            {moonData.phaseName}
          </h2>
          <p className="text-slate-500 text-xs tracking-[0.2em] uppercase font-medium">
            {(moonData.fraction * 100).toFixed(1)}% Illuminée
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-moon-glow/5 rounded-full blur-3xl" />
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Reflection Snippet */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={onNavigateToJournal}
        className="glass-panel p-6 cursor-pointer hover:bg-white/10 transition-all group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Quote className="w-4 h-4 text-moon-glow opacity-50" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Réflexion du jour</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-moon-glow group-hover:translate-x-1 transition-all" />
        </div>

        {todayNote ? (
          <p className="text-sm text-slate-300 line-clamp-3 italic leading-relaxed font-serif">
            "{todayNote}"
          </p>
        ) : (
          <p className="text-sm text-slate-500 italic">
            Aucune réflexion enregistrée pour aujourd'hui. Prenez un moment pour méditer...
          </p>
        )}
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-4"
        >
          <span className="text-[9px] uppercase tracking-widest text-slate-500 block mb-1">Date</span>
          <span className="text-sm font-medium text-slate-200 capitalize">
            {format(new Date(), 'd MMMM', { locale: fr })}
          </span>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-4"
        >
          <span className="text-[9px] uppercase tracking-widest text-slate-500 block mb-1">Cycle</span>
          <span className="text-sm font-medium text-slate-200">
            Jour {Math.floor(moonData.phase * 29.53)} / 29.5
          </span>
        </motion.div>
      </div>
    </div>
  );
};
