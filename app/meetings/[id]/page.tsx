import Link from 'next/link';
import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import { getMeetingById } from '@/lib/meetings-db';

interface MeetingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MeetingPage({
  params,
}: MeetingPageProps) {
  const { id } = await params;
  const meetingId = Number(id);
  if (!Number.isInteger(meetingId)) notFound();

  const meeting = getMeetingById(meetingId);
  if (!meeting) notFound();

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          href="/meetings"
          className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--primary-light)]"
        >
          ← Volver a reuniones
        </Link>

        
      </div>

      <MeetingDetail meeting={meeting} />
    </div>
  );
}