'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface MeetingsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  // Next.js 16 passes `retry` (it refetches the segment); `reset` is kept for
  // earlier versions and resets the boundary without refetching.
  retry?: () => void;
}

export default function Error({
  error,
  reset,
  retry,
}: MeetingsErrorProps) {
  useEffect(() => {
    console.error('Uncaught error in meetings:', error);
  }, [error]);

  const tryAgain = retry ?? reset;

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center shadow-sm sm:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
        Error inesperado
      </p>
      <h2 className="mt-3 text-2xl font-bold">Algo salió mal</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        No pudimos completar la operación. Inténtalo de nuevo; si el problema
        continúa, vuelve a la lista de reuniones.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={tryAgain}
          className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        >
          Try Again
        </button>
        <Link
          href="/meetings"
          className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-semibold hover:bg-[var(--primary-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        >
          Volver a reuniones
        </Link>
      </div>
    </div>
  );
}
