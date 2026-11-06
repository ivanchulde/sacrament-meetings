'use client';

import type { SacramentMeeting } from '@/lib/types';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

const meetingTypeLabels: Record<SacramentMeeting['meetingType'], string> = {
  testimony: 'Reunión de testimonios',
  regular: 'Reunión sacramental',
  stake: 'Reunión de estaca',
  general: 'Conferencia general',
};

const sectionClassName =
  'rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6';
const sectionTitleClassName =
  'flex items-center gap-3 text-lg font-bold tracking-tight text-[var(--foreground)]';
const labelClassName =
  'text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]';
const valueClassName = 'mt-1.5 text-sm font-medium leading-6 text-[var(--foreground)]';

function formatMeetingDate(date: string) {
  return new Intl.DateTimeFormat('es-EC', {
    dateStyle: 'full',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const announcements = meeting.announcements ?? [];
  const speakers = meeting.speakers.filter((item) => item.type === 'speaker');
  const musicalNumbers = meeting.speakers.filter(
    (item) => item.type === 'musical-number',
  );

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex justify-end print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-[var(--primary-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        >
          <span aria-hidden="true">⎙</span>
          Imprimir programa
        </button>
      </div>

      <article className="agenda-sheet space-y-5 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xl shadow-slate-900/5 sm:space-y-6 sm:p-7 lg:p-9">
        <header className="overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] px-6 py-7 text-white sm:px-8 sm:py-9">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">
            Barrio Pradera · Programa dominical
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-4xl">
            {meetingTypeLabels[meeting.meetingType]}
          </h2>
          <p className="mt-2 text-sm capitalize text-white/85 sm:text-base">
            {formatMeetingDate(meeting.date)}
          </p>

          <div className="mt-6 grid gap-3 border-t border-white/20 pt-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Preside
              </p>
              <p className="mt-1 font-semibold">{meeting.presiding}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Dirige
              </p>
              <p className="mt-1 font-semibold">{meeting.conducting}</p>
            </div>
          </div>
        </header>

        <section className={sectionClassName}>
          <h3 className={sectionTitleClassName}>
            <span className="flex size-8 items-center justify-center rounded-full bg-[var(--primary-light)] text-sm text-[var(--primary)]">
              1
            </span>
            Orden de la reunión
          </h3>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-[var(--surface-subtle)] p-4">
              <dt className={labelClassName}>Himno de apertura</dt>
              <dd className={valueClassName}>
                N.º {meeting.openingHymn.number} · {meeting.openingHymn.title}
              </dd>
            </div>
            <div className="rounded-xl bg-[var(--surface-subtle)] p-4">
              <dt className={labelClassName}>Oración de apertura</dt>
              <dd className={valueClassName}>{meeting.openingPrayer}</dd>
            </div>
            <div className="rounded-xl bg-[var(--surface-subtle)] p-4">
              <dt className={labelClassName}>Himno sacramental</dt>
              <dd className={valueClassName}>
                N.º {meeting.sacramentHymn.number} · {meeting.sacramentHymn.title}
              </dd>
            </div>
            <div className="rounded-xl bg-[var(--surface-subtle)] p-4">
              <dt className={labelClassName}>Himno de clausura</dt>
              <dd className={valueClassName}>
                N.º {meeting.closingHymn.number} · {meeting.closingHymn.title}
              </dd>
            </div>
            <div className="rounded-xl bg-[var(--surface-subtle)] p-4 sm:col-span-2">
              <dt className={labelClassName}>Oración de clausura</dt>
              <dd className={valueClassName}>{meeting.closingPrayer}</dd>
            </div>
          </dl>
        </section>

        {announcements.length > 0 && (
          <section className={sectionClassName}>
            <h3 className={sectionTitleClassName}>
              <span className="flex size-8 items-center justify-center rounded-full bg-[var(--primary-light)] text-sm text-[var(--primary)]">
                2
              </span>
              Anuncios
            </h3>
            <ul className="mt-4 grid list-none gap-2 p-0">
              {announcements.map((announcement) => (
                <li
                  key={announcement}
                  className="rounded-xl bg-[var(--surface-subtle)] px-4 py-3 text-sm leading-6"
                >
                  {announcement}
                </li>
              ))}
            </ul>
          </section>
        )}

        {meeting.wardBusiness.length > 0 && (
          <section className={sectionClassName}>
            <h3 className={sectionTitleClassName}>
              <span className="flex size-8 items-center justify-center rounded-full bg-[var(--primary-light)] text-sm text-[var(--primary)]">
                3
              </span>
              Asuntos del barrio
            </h3>
            <ul className="mt-4 grid list-none gap-2 p-0">
              {meeting.wardBusiness.map((item) => (
                <li
                  key={item.description}
                  className="rounded-xl bg-[var(--surface-subtle)] px-4 py-3 text-sm leading-6"
                >
                  {item.description}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={sectionClassName}>
          <h3 className={sectionTitleClassName}>
            <span className="flex size-8 items-center justify-center rounded-full bg-[var(--primary-light)] text-sm text-[var(--primary)]">
              4
            </span>
            Asuntos de la estaca
          </h3>
          <p className="mt-4 text-sm leading-6">
            {meeting.stakeBusiness
              ? 'Se tratarán asuntos de la estaca durante la reunión.'
              : 'No se tratarán asuntos de la estaca en esta reunión.'}
          </p>
        </section>

        {speakers.length > 0 && (
          <section className={sectionClassName}>
            <h3 className={sectionTitleClassName}>
              <span className="flex size-8 items-center justify-center rounded-full bg-[var(--primary-light)] text-sm text-[var(--primary)]">
                5
              </span>
              Discursos
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {speakers.map((speaker) => (
                <article
                  key={`${speaker.name}-${speaker.topic}`}
                  className="rounded-xl border-l-4 border-[var(--accent)] bg-[var(--surface-subtle)] p-4"
                >
                  <p className="font-bold">{speaker.name}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                    {speaker.topic}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {musicalNumbers.length > 0 && (
          <section className={sectionClassName}>
            <h3 className={sectionTitleClassName}>
              <span className="flex size-8 items-center justify-center rounded-full bg-[var(--primary-light)] text-sm text-[var(--primary)]">
                ♪
              </span>
              Números musicales
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {musicalNumbers.map((number) => (
                <article
                  key={`${number.name}-${number.topic}`}
                  className="rounded-xl border-l-4 border-[var(--accent)] bg-[var(--surface-subtle)] p-4"
                >
                  <p className="font-bold">{number.name}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                    {number.topic}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
