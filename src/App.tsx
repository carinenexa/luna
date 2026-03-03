/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { MoonCalendar } from './components/MoonCalendar';
import { MoonJournal } from './components/MoonJournal';
import { MoonWidget } from './components/MoonWidget';
import { getMoonData, getMoonPhaseIcon } from './lib/moon';
import { Moon as MoonIcon, Sparkles, Info, Calendar as CalendarIcon, Book, Globe, Settings, X, Home } from 'lucide-react';

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [moonData, setMoonData] = useState(getMoonData(new Date(), timezone));
  const [view, setView] = useState<'home' | 'calendar' | 'journal'>('home');
  const [showSettings, setShowSettings] = useState(false);
  const [tzSearch, setTzSearch] = useState('');

  useEffect(() => {
    setMoonData(getMoonData(selectedDate, timezone));
  }, [selectedDate, timezone]);

  // Get all supported timezones
  const allTimezones = Intl.supportedValuesOf('timeZone');
  
  const filteredTimezones = allTimezones.filter(tz => 
    tz.toLowerCase().includes(tzSearch.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col p-4 pb-24">
      {/* Top Bar */}
      <div className="flex justify-between items-center pt-4 mb-4">
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 overflow-hidden max-w-[200px]">
          <Globe className="w-3 h-3 shrink-0" />
          <span className="truncate">{timezone}</span>
        </div>
        <button 
          onClick={() => {
            setTzSearch('');
            setShowSettings(true);
          }}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <Settings className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col gap-6">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1"
            >
              <MoonWidget 
                moonData={getMoonData(new Date(), timezone)} 
                onNavigateToJournal={() => {
                  setSelectedDate(new Date());
                  setView('journal');
                }}
              />
            </motion.div>
          )}

          {view === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1"
            >
              <MoonCalendar 
                selectedDate={selectedDate} 
                timezone={timezone}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                }} 
              />
            </motion.div>
          )}

          {view === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1"
            >
              <MoonJournal date={selectedDate} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Info Card (Only on Calendar/Journal views) */}
        {view !== 'home' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4 flex items-start gap-4"
          >
            <div className="p-2 bg-white/5 rounded-lg">
              <Sparkles className="w-5 h-5 text-amber-200/60" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-200">Aperçu Lunaire</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                {moonData.phaseName === 'Pleine Lune' && "Un moment de culmination, d'émotions intenses et de clarté. Libérez ce qui ne vous sert plus."}
                {moonData.phaseName === 'Nouvelle Lune' && "Une page blanche pour de nouveaux départs. Plantez les graines de vos intentions pour ce cycle."}
                {moonData.phaseName.includes('Croissant') || moonData.phaseName.includes('Gibbeuse Croissante') ? "L'énergie augmente. Concentrez-vous sur la croissance, l'action et la manifestation." : ""}
                {moonData.phaseName.includes('Décroissante') || moonData.phaseName.includes('Dernier Croissant') ? "Une période de réflexion, d'introspection et de lâcher-prise." : ""}
                {moonData.phaseName.includes('Quartier') && "Un tournant. Équilibrez votre monde intérieur avec les exigences extérieures."}
              </p>
            </div>
          </motion.div>
        )}
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="glass-panel w-full max-w-sm max-h-[80vh] flex flex-col relative overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
                <h3 className="text-xl font-serif italic text-moon-glow">Fuseaux Horaires</h3>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="p-4 shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher une ville ou une zone..."
                    value={tzSearch}
                    onChange={(e) => setTzSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-moon-glow/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-1 custom-scrollbar">
                {filteredTimezones.length > 0 ? (
                  filteredTimezones.map(tz => (
                    <button
                      key={tz}
                      onClick={() => {
                        setTimezone(tz);
                        setShowSettings(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center justify-between group",
                        timezone === tz 
                          ? "bg-white/10 text-moon-glow" 
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                      )}
                    >
                      <span className="truncate">{tz.replace(/_/g, ' ')}</span>
                      {timezone === tz && <div className="w-1.5 h-1.5 rounded-full bg-moon-glow shadow-[0_0_8px_rgba(240,244,248,0.5)]" />}
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-600 text-sm italic">
                    Aucun fuseau horaire trouvé
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-white/5 border-t border-white/10 shrink-0">
                <button
                  onClick={() => {
                    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
                    setShowSettings(false);
                  }}
                  className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-moon-glow transition-colors"
                >
                  Réinitialiser (Auto)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-4 right-4 max-w-md mx-auto">
        <div className="glass-panel p-2 flex items-center justify-around shadow-2xl">
          <button
            onClick={() => setView('home')}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all",
              view === 'home' ? "bg-white/10 text-moon-glow" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-tighter font-bold">Accueil</span>
          </button>

          <button
            onClick={() => setView('calendar')}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all",
              view === 'calendar' ? "bg-white/10 text-moon-glow" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <CalendarIcon className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-tighter font-bold">Cycle</span>
          </button>
          
          <button
            onClick={() => setView('journal')}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all",
              view === 'journal' ? "bg-white/10 text-moon-glow" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <Book className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-tighter font-bold">Journal</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

// Utility for tailwind classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
