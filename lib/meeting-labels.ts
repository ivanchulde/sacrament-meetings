import type { MeetingType } from './types';

// Single source of truth for the Spanish labels shown in the UI. Keep the
// SQL label aliases in lib/meetings-db.ts in sync with these values so a
// search by visible label returns the expected meetings.
export const meetingTypeLabels: Record<MeetingType, string> = {
  testimony: 'Reunión de testimonios',
  regular: 'Reunión sacramental',
  stake: 'Reunión de estaca',
  general: 'Conferencia general',
  special: 'Reunión especial',
};
