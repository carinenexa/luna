import React from 'react';
import { MoonData, getMoonPhaseIcon } from '../lib/moon';
import { Sparkles, Info, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'motion/react';

interface MoonDetailProps {
  moonData: MoonData;
  date: Date;
}

export const MoonDetail: React.FC<MoonDetailProps> = ({ moonData, date }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 space-y-6"
    >
      <div className="flex items-center gap-6">
        <div className="text-6xl drop-shadow-[0_0_10px_rgba(240,244,248,0.3)] shrink-0">
          {getMoonPhaseIcon(moonData.phase)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
            <CalendarIcon className="w-3 h-3" />
            {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
          </div>
          <h3 className="text-xl font-serif italic text-moon-glow mb-1">
            {moonData.phaseName}
          </h3>
          <p className="text-slate-400 text-xs tracking-widest uppercase">
            {(moonData.fraction * 100).toFixed(1)}% Illuminée
          </p>
        </div>
      </div>

      <div className="h-px bg-white/5 w-full" />

      <div className="flex gap-4">
        <div className="p-2 bg-white/5 rounded-lg h-fit">
          <Sparkles className="w-5 h-5 text-amber-200/60" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-slate-200 mb-1">Aperçu & Énergie</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {moonData.phaseName === 'Pleine Lune' && "Un moment de culmination, d'émotions intenses et de clarté. Libérez ce qui ne vous sert plus. L'énergie est à son maximum."}
            {moonData.phaseName === 'Nouvelle Lune' && "Une page blanche pour de nouveaux départs. Plantez les graines de vos intentions pour ce cycle. Idéal pour la méditation."}
            {moonData.phaseName.includes('Croissant') || moonData.phaseName.includes('Gibbeuse Croissante') ? "L'énergie augmente progressivement. Concentrez-vous sur la croissance, l'action et la manifestation de vos projets." : ""}
            {moonData.phaseName.includes('Décroissante') || moonData.phaseName.includes('Dernier Croissant') ? "Une période de réflexion, d'introspection et de lâcher-prise. Ralentissez et nettoyez votre espace." : ""}
            {moonData.phaseName.includes('Quartier') && "Un tournant critique. Équilibrez votre monde intérieur avec les exigences extérieures. Prenez des décisions fermes."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <span className="text-[9px] uppercase tracking-widest text-slate-500 block mb-1">Âge de la Lune</span>
          <span className="text-sm font-medium text-slate-200">{Math.floor(moonData.phase * 29.53)} jours</span>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <span className="text-[9px] uppercase tracking-widest text-slate-500 block mb-1">Fraction</span>
          <span className="text-sm font-medium text-slate-200">{(moonData.fraction).toFixed(3)}</span>
        </div>
      </div>
    </motion.div>
  );
};
