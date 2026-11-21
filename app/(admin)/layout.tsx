import Link from 'next/link';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <header className="mb-8 print:hidden">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
          Administración
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Planificación de reuniones
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Herramientas para los líderes del barrio. La autenticación se agregará
          en la Week 05.
        </p>

        <Link
          href="/meetings"
          className="mt-4 inline-flex rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--primary-light)]"
        >
          ← Volver a reuniones
        </Link>
      </header>

      {children}
    </section>
  );
}
