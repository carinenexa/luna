export interface Eclipse {
  date: string;
  type: 'Totale' | 'Annulaire' | 'Partielle';
  description: string;
}

export const solarEclipses: Eclipse[] = [
  {
    date: '2023-04-20',
    type: 'Totale',
    description: 'Éclipse hybride visible en Australie et Asie du Sud-Est.'
  },
  {
    date: '2023-10-14',
    type: 'Annulaire',
    description: 'Visible à travers l\'Amérique du Nord, centrale et du Sud.'
  },
  {
    date: '2024-04-08',
    type: 'Totale',
    description: 'La Grande Éclipse Nord-Américaine.'
  },
  {
    date: '2024-10-02',
    type: 'Annulaire',
    description: 'Visible au Chili, en Argentine et dans le Pacifique.'
  },
  {
    date: '2025-03-29',
    type: 'Partielle',
    description: 'Visible en Europe, au nord de l\'Asie et en Afrique.'
  },
  {
    date: '2025-09-21',
    type: 'Partielle',
    description: 'Visible dans le Pacifique Sud, en Nouvelle-Zélande et en Antarctique.'
  },
  {
    date: '2026-02-17',
    type: 'Annulaire',
    description: 'Visible en Antarctique.'
  },
  {
    date: '2026-08-12',
    type: 'Totale',
    description: 'Visible en Arctique, au Groenland, en Islande et en Espagne.'
  },
  {
    date: '2027-02-06',
    type: 'Annulaire',
    description: 'Visible au Chili, en Argentine et dans l\'Atlantique Sud.'
  },
  {
    date: '2027-08-02',
    type: 'Totale',
    description: 'Visible en Afrique du Nord, au Moyen-Orient et en Asie du Sud.'
  },
  {
    date: '2028-01-26',
    type: 'Annulaire',
    description: 'Visible en Amérique du Sud et en Afrique de l\'Ouest.'
  },
  {
    date: '2028-07-22',
    type: 'Totale',
    description: 'Visible en Australie et en Nouvelle-Zélande.'
  }
];
