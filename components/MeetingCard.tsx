import Link from 'next/link';
import type { SacramentMeeting } from '@/lib/types';

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--primary)]">
            {meeting.meetingType}
          </p>

          <h2 className="mt-1 text-xl font-bold">
            Reunión del {meeting.date}
          </h2>
        </div>

        <span className="rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-medium">
          #{meeting.id}
        </span>
      </div>

      <div className="mt-5 space-y-2 text-sm">
        <p>
          <strong>Preside:</strong> {meeting.presiding}
        </p>

        <p>
          <strong>Dirige:</strong> {meeting.conducting}
        </p>

        <p>
          <strong>Himno de apertura:</strong>{' '}
          {meeting.openingHymn.number} — {meeting.openingHymn.title}
        </p>

        <p>
          <strong>Oración inicial:</strong> {meeting.openingPrayer}
        </p>
      </div>

      <Link
        href={`/meetings/${meeting.id}`}
        className="mt-6 inline-block rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        Ver reunión
      </Link>
    </article>
  );
}