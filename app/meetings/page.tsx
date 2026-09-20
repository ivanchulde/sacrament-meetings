import MeetingCard from '@/components/MeetingCard';
import type { SacramentMeeting } from '@/lib/types';

async function getMeetings(): Promise<SacramentMeeting[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/meetings`,
    {
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error('No se pudieron obtener las reuniones');
  }

  return response.json();
}

export default async function MeetingsPage() {
  const meetings = await getMeetings();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
}