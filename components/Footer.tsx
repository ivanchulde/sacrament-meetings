import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--primary-light)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-6 text-center">
        

        <div className="text-sm text-[var(--muted)]">
          <p>Sacrament Meeting Planner</p>
          <p className="mt-1">Barrio Pradera</p>
          <p className="mt-2 font-medium text-[var(--primary)]">
            Designed by: ANIV
          </p>
          <Image
            src="/aniv-logo.png"
            alt="Logo de ANIV"
            width={80}
            height={80}
            className="mx-auto rounded-lg"
          />
        </div>
      </div>
    </footer>
  );
}