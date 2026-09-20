import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden rounded-2xl">
      <Image
        src="/barrio-pradera.jpg"
        alt="Barrio Pradera"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-6 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-widest">
          Barrio Pradera
        </p>

        <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
          Sacrament Meeting Planner
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
          Consulta y organiza los programas de las reuniones sacramentales,
          incluyendo himnos, oraciones, anuncios, discursos y números
          musicales.
        </p>

        <Link
          href="/meetings"
          className="mt-8 rounded-md bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Ver reuniones
        </Link>
      </div>
    </section>
  );
}