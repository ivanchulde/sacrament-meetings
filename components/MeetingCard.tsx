import Link from 'next/link';
import type { SacramentMeeting } from '@/lib/types';

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg hover:shadow-slate-900/5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
            {meeting.meetingType}
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-[var(--foreground)]">
            Reunión del {meeting.date}
          </h2>
        </div>
        <span className="rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-bold text-[var(--primary)]">
          #{meeting.id}
        </span>
      </div>

      <div className="mt-5 grid gap-3 text-sm">
        <div className="rounded-xl bg-[var(--surface-subtle)] p-3.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Preside
          </p>
          <p className="mt-1 font-semibold">{meeting.presiding}</p>
        </div>
        <div className="rounded-xl bg-[var(--surface-subtle)] p-3.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Dirige
          </p>
          <p className="mt-1 font-semibold">{meeting.conducting}</p>
        </div>
        <div className="rounded-xl bg-[var(--surface-subtle)] p-3.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Himno de apertura
          </p>
          <p className="mt-1 leading-5">
            N.º {meeting.openingHymn.number} · {meeting.openingHymn.title}
          </p>
        </div>
        <div className="rounded-xl bg-[var(--surface-subtle)] p-3.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Oración de apertura
          </p>
          <p className="mt-1 font-semibold">{meeting.openingPrayer}</p>
        </div>
      </div>

      <Link
        href={`/meetings/${meeting.id}`}
        className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-[var(--primary)] transition group-hover:text-[var(--accent)] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary)]"
      >
        Ver programa <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
