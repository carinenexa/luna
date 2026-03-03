import React from 'react';
import { format, isAfter, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { solarEclipses } from '../lib/eclipses';
import { Sun, Calendar as CalendarIcon, Info, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export const EclipseTracker: React.FC = () => {
  const now = new Date();
  
  const futureEclipses = solarEclipses.filter(e => isAfter(parseISO(e.date), now));
  const pastEclipses = solarEclipses.filter(e => !isAfter(parseISO(e.date), now)).reverse();

  const renderEclipseCard = (eclipse: typeof solarEclipses[0], isFuture: boolean) => (
    <div 
      key={eclipse.date}
      className="glass-panel p-4 flex items-start gap-4 hover:bg-white/5 transition-colors group"
    >
      <div className={`p-3 rounded-xl shrink-0 ${
        isFuture ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-500'
      }`}>
        <Sun className="w-6 h-6" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className="text-sm font-bold text-slate-200 capitalize">
            {format(parseISO(eclipse.date), 'd MMMM yyyy', { locale: fr })}
          </h4>
          <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${
            eclipse.type === 'Totale' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' : 
            eclipse.type === 'Annulaire' ? 'border-blue-500/30 text-blue-500 bg-blue-500/5' :
            'border-slate-500/30 text-slate-400 bg-slate-500/5'
          }`}>
            {eclipse.type}
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {eclipse.description}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-8">
      <section>
        <div className="flex items-center gap-2 mb-4 px-2">
          <div className="w-1 h-4 bg-amber-500 rounded-full" />
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Prochaines Éclipses</h3>
        </div>
        <div className="space-y-3">
          {futureEclipses.map(e => renderEclipseCard(e, true))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4 px-2">
          <div className="w-1 h-4 bg-slate-700 rounded-full" />
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Éclipses Passées</h3>
        </div>
        <div className="space-y-3 opacity-70">
          {pastEclipses.map(e => renderEclipseCard(e, false))}
        </div>
      </section>

      <div className="glass-panel p-4 bg-blue-500/5 border-blue-500/10 flex gap-3">
        <Info className="w-5 h-5 text-blue-400 shrink-0" />
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Les éclipses solaires se produisent lorsque la Lune passe entre la Terre et le Soleil, occultant totalement ou partiellement l'image du Soleil pour un observateur sur Terre.
        </p>
      </div>
    </div>
  );
};
