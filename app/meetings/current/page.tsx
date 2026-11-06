import { redirect } from 'next/navigation';
import { getMeetings } from '@/lib/meetings-db';

export default function CurrentMeetingPage() {
  const todayInEcuador = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Guayaquil',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const getDatePart = (type: 'year' | 'month' | 'day') =>
    Number(todayInEcuador.find((part) => part.type === type)?.value);

  const today = new Date(
    Date.UTC(getDatePart('year'), getDatePart('month') - 1, getDatePart('day')),
  );
  const sunday = new Date(today);
  const daysUntilSunday = (7 - today.getUTCDay()) % 7;
  sunday.setUTCDate(today.getUTCDate() + daysUntilSunday);

  const year = sunday.getUTCFullYear();
  const month = String(sunday.getUTCMonth() + 1).padStart(2, '0');
  const day = String(sunday.getUTCDate()).padStart(2, '0');
  const date = `${year}-${month}-${day}`;

  const meeting = getMeetings(date)[0];

  if (meeting) {
    redirect(`/meetings/${meeting.id}`);
  }

  redirect('/meetings');
}
