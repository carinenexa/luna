import { format } from 'date-fns';
import { toDate, fromZonedTime } from 'date-fns-tz';
import SunCalc from 'suncalc';

export type MoonPhase = 
  | 'Nouvelle Lune'
  | 'Premier Croissant'
  | 'Premier Quartier'
  | 'Lune Gibbeuse Croissante'
  | 'Pleine Lune'
  | 'Lune Gibbeuse Décroissante'
  | 'Dernier Quartier'
  | 'Dernier Croissant';

export interface MoonData {
  phase: number; // 0 to 1
  phaseName: MoonPhase;
  fraction: number;
  angle: number;
  date: Date;
}

/**
 * Calculates moon data for a specific date and timezone.
 * To get a representative phase for a day, we calculate it for "noon" in that timezone.
 */
export function getMoonData(date: Date, timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): MoonData {
  // 1. Create a date representing noon on the given day in the target timezone
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  // Create a string like "2026-03-03 12:00:00"
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')} 12:00:00`;
  
  // Convert this local "noon" string to a UTC Date object
  const targetDate = fromZonedTime(dateStr, timezone);

  const illumination = SunCalc.getMoonIllumination(targetDate);
  const phase = illumination.phase;
  
  let phaseName: MoonPhase = 'Nouvelle Lune';
  
  // Precise phase thresholds
  if (phase < 0.02 || phase > 0.98) phaseName = 'Nouvelle Lune';
  else if (phase < 0.23) phaseName = 'Premier Croissant';
  else if (phase < 0.27) phaseName = 'Premier Quartier';
  else if (phase < 0.48) phaseName = 'Lune Gibbeuse Croissante';
  else if (phase < 0.52) phaseName = 'Pleine Lune';
  else if (phase < 0.73) phaseName = 'Lune Gibbeuse Décroissante';
  else if (phase < 0.77) phaseName = 'Dernier Quartier';
  else phaseName = 'Dernier Croissant';

  return {
    phase,
    phaseName,
    fraction: illumination.fraction,
    angle: illumination.angle,
    date: targetDate
  };
}

export function getMoonPhaseIcon(phase: number) {
  // Simple mapping for demonstration, could be more granular
  if (phase < 0.03 || phase > 0.97) return '🌑';
  if (phase < 0.22) return '🌒';
  if (phase < 0.28) return '🌓';
  if (phase < 0.47) return '🌔';
  if (phase < 0.53) return '🌕';
  if (phase < 0.72) return '🌖';
  if (phase < 0.78) return '🌗';
  return '🌘';
}
