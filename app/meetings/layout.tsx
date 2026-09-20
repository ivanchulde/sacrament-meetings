export default function MeetingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--primary)]">
          Planificador
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Reuniones sacramentales
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Consulta los programas actuales y anteriores de las reuniones
          sacramentales.
        </p>
      </header>

      {children}
    </section>
  );
}