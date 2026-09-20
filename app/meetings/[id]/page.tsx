import Link from 'next/link';
import MeetingDetail from '@/components/MeetingDetail';
import type { SacramentMeeting } from '@/lib/types';

interface MeetingPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getMeeting(id: string): Promise<SacramentMeeting> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/meetings/${id}`,
    {
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error('No se pudo obtener la reunión');
  }

  return response.json();
}

export default async function MeetingPage({
  params,
}: MeetingPageProps) {
  const { id } = await params;
  const meeting = await getMeeting(id);

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