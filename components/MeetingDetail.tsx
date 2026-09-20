'use client';
import type { SacramentMeeting } from '@/lib/types';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}


export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const speakers = meeting.speakers.filter(
    (item) => item.type === 'speaker',
  );
    const handlePrint = () => {
    window.print();
  };

  const musicalNumbers = meeting.speakers.filter(
    (item) => item.type === 'musical-number',
  );

  return (
    <article className="space-y-8">
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 print:hidden"
        >
          Imprimir reunión
        </button>
      <header className="border-b border-[var(--border)] pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--primary)]">
          {meeting.meetingType}
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          Reunión del {meeting.date}
        </h2>

        <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
          <p>
            <strong>Preside:</strong> {meeting.presiding}
          </p>
          <p>
            <strong>Dirige:</strong> {meeting.conducting}
          </p>
        </div>
      </header>

      <section>
        <h3 className="text-xl font-bold">Programa</h3>

        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="font-semibold">Himno de apertura</dt>
            <dd>
              #{meeting.openingHymn.number} — {meeting.openingHymn.title}
            </dd>
          </div>

          <div>
            <dt className="font-semibold">Oración de apertura</dt>
            <dd>{meeting.openingPrayer}</dd>
          </div>

          <div>
            <dt className="font-semibold">Himno sacramental</dt>
            <dd>
              #{meeting.sacramentHymn.number} —{' '}
              {meeting.sacramentHymn.title}
            </dd>
          </div>

          <div>
            <dt className="font-semibold">Himno de clausura</dt>
            <dd>
              #{meeting.closingHymn.number} — {meeting.closingHymn.title}
            </dd>
          </div>

          <div>
            <dt className="font-semibold">Oración de clausura</dt>
            <dd>{meeting.closingPrayer}</dd>
          </div>
        </dl>
      </section>

      {meeting.announcements.length > 0 && (
        <section>
          <h3 className="text-xl font-bold">Anuncios</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
            {meeting.announcements.map((announcement) => (
              <li key={announcement}>{announcement}</li>
            ))}
          </ul>
        </section>
      )}

      {meeting.wardBusiness.length > 0 && (
        <section>
          <h3 className="text-xl font-bold">Asuntos del barrio</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
            {meeting.wardBusiness.map((item) => (
              <li key={item.description}>{item.description}</li>
            ))}
          </ul>
        </section>
      )}

      {meeting.stakeBusiness && (
        <section>
          <h3 className="text-xl font-bold">Asuntos de la estaca</h3>
          <p className="mt-2 text-sm">
            Se tratarán asuntos de la estaca durante la reunión.
          </p>
        </section>
      )}

      {speakers.length > 0 && (
        <section>
          <h3 className="text-xl font-bold">Discursos</h3>
          <div className="mt-4 space-y-4">
            {speakers.map((speaker) => (
              <div
                key={`${speaker.name}-${speaker.topic}`}
                className="rounded-lg border border-[var(--border)] p-4"
              >
                <p className="font-semibold">{speaker.name}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {speaker.topic}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {musicalNumbers.length > 0 && (
        <section>
          <h3 className="text-xl font-bold">Números musicales</h3>
          <div className="mt-4 space-y-4">
            {musicalNumbers.map((number) => (
              <div
                key={`${number.name}-${number.topic}`}
                className="rounded-lg border border-[var(--border)] p-4"
              >
                <p className="font-semibold">{number.name}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {number.topic}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}