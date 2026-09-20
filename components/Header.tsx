import NavLinks from './NavLinks';

export default function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)]">
      <div className="flex w-full flex-col gap-4 px-8 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--primary)]">
            Barrio Pradera
          </p>

          <h1 className="text-2xl font-bold">
            Sacrament Meeting Planner
          </h1>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Planificador de reuniones sacramentales
          </p>
        </div>

        <NavLinks />
      </div>
    </header>
  );
}