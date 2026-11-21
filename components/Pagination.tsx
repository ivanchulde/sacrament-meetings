'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
}

const linkClassName =
  'inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--primary)] shadow-sm transition hover:border-[var(--primary)] hover:bg-[var(--primary-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]';

const disabledClassName =
  'inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--muted)] opacity-60';

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawPage = searchParams.get('page') ?? '';
  const parsedPage = /^\d+$/.test(rawPage) ? Number(rawPage) : 1;
  // Keep the label in sync with the server-clamped data for out-of-range URLs.
  const currentPage = Math.min(Math.max(parsedPage, 1), totalPages);

  function createPageURL(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  }

  return (
    <nav
      aria-label="Paginación de reuniones"
      className="mt-8 flex flex-wrap items-center justify-center gap-4"
    >
      {currentPage > 1 ? (
        <Link href={createPageURL(currentPage - 1)} className={linkClassName}>
          <span aria-hidden="true">←</span> Anterior
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClassName}>
          <span aria-hidden="true">←</span> Anterior
        </span>
      )}

      <span aria-live="polite" className="text-sm text-[var(--muted)]">
        Página <strong className="text-[var(--foreground)]">{currentPage}</strong>{' '}
        de {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link href={createPageURL(currentPage + 1)} className={linkClassName}>
          Siguiente <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClassName}>
          Siguiente <span aria-hidden="true">→</span>
        </span>
      )}
    </nav>
  );
}
