import Link from 'next/link';

export default function MeetingNotFound() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center shadow-sm sm:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
        404
      </p>
      <h2 className="mt-3 text-2xl font-bold">Reunión no encontrada</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        No existe una reunión con ese identificador, o fue eliminada. Revisa la
        lista de reuniones para elegir otra.
      </p>
      <Link
        href="/meetings"
        className="mt-6 inline-flex rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
      >
        Volver a reuniones
      </Link>
    </div>
  );
}
