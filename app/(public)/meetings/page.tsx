import { Suspense } from 'react';
import Link from 'next/link';
import { connection } from 'next/server';
import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';
import { getMeetings, getMeetingsTotalPages } from '@/lib/meetings-db';

interface MeetingsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

export default async function MeetingsPage({
  searchParams,
}: MeetingsPageProps) {
  await connection();

  const params = await searchParams;
  const query = firstValue(params.query);

  const totalPages = await getMeetingsTotalPages(query);
  const rawPage = firstValue(params.page);
  const requestedPage = /^\d+$/.test(rawPage) ? Number(rawPage) : 1;
  const page = Math.min(Math.max(requestedPage, 1), totalPages);

  const meetings = await getMeetings(query, page);

  return (
    <div>
      <div className="mb-6 flex justify-end print:hidden">
        <Link
          href="/meetings/new"
          className="rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        >
          + Nueva reunión
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="mb-6 h-12 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)]" />
        }
      >
        <MeetingSearch />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        {meetings.map((meeting) => (
          <MeetingCard
            key={meeting.id}
            meeting={meeting}
            showAdminActions
          />
        ))}
      </div>

      {meetings.length === 0 && (
        <p className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
          {query
            ? `No se encontraron reuniones para «${query}».`
            : 'No hay reuniones disponibles.'}
        </p>
      )}

      {totalPages > 1 && (
        <Suspense
          fallback={
            <div className="mt-8 h-10 animate-pulse rounded-xl bg-[var(--surface-subtle)]" />
          }
        >
          <Pagination totalPages={totalPages} />
        </Suspense>
      )}
    </div>
  );
}
