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

  if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) <= 0) {
    notFound();
  }

  const meeting = await getMeetingById(Number(id));

  if (!meeting) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          href="/meetings"
          className="print:hidden rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--primary-light)]"
        >
          ← Volver a reuniones
        </Link>
      </div>

      <MeetingDetail meeting={meeting} />
    </div>
  );
}
