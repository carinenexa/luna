import React, { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMoonData, getMoonPhaseIcon } from '../lib/moon';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  timezone: string;
}

export const MoonCalendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, timezone }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-xl font-serif italic text-moon-glow capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-[10px] uppercase tracking-widest text-slate-500 font-medium">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const moonData = getMoonData(currentDay, timezone);
        const isSelected = isSameDay(currentDay, selectedDate);
        const isCurrentMonth = isSameMonth(currentDay, monthStart);
        const isToday = isSameDay(currentDay, new Date());

        days.push(
          <div
            key={currentDay.toString()}
            onClick={() => onDateSelect(currentDay)}
            className={cn(
              "relative h-16 flex flex-col items-center justify-center cursor-pointer transition-all border",
              !isCurrentMonth && "opacity-20",
              // Today's specific styling
              isToday && !isSelected && "border-blue-500/30 bg-blue-500/5 rounded-lg",
              isToday && isSelected && "border-blue-400/50 bg-white/15 rounded-lg",
              // Selection styling
              isSelected && !isToday && "bg-white/10 border-white/20 rounded-lg",
              // Default/Hover styling
              !isSelected && !isToday && "border-transparent hover:bg-white/5 rounded-lg"
            )}
          >
            <span className={cn(
              "text-xs mb-1",
              isToday ? "text-blue-400 font-bold" : "text-slate-300"
            )}>
              {format(currentDay, 'd')}
            </span>
            <span className="text-lg leading-none">
              {getMoonPhaseIcon(moonData.phase)}
            </span>
            {isSelected && (
              <div className="absolute bottom-1 w-1 h-1 bg-moon-glow rounded-full" />
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="px-2 pb-4">{rows}</div>;
  };

  return (
    <div className="glass-panel overflow-hidden">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};
