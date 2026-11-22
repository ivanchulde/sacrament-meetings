'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { meetingTypeLabels } from '@/lib/meeting-labels';
import type { State } from '@/lib/actions';
import type { SacramentMeeting } from '@/lib/types';

type MeetingAction = (state: State, formData: FormData) => Promise<State>;

interface MeetingFormProps {
  action: MeetingAction;
  meeting?: SacramentMeeting;
  submitLabel: string;
}

const initialState: State = { message: null, errors: {} };

const baseFieldClass =
  'mt-1 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30';
const labelClass = 'block text-sm font-semibold text-[var(--foreground)]';
const hintClass = 'mt-1 text-xs leading-5 text-[var(--muted)]';

function fieldClass(errors?: string[]): string {
  return `${baseFieldClass} ${
    errors?.length ? 'border-red-600' : 'border-[var(--border)]'
  }`;
}

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={`${id}-error`} aria-live="polite" aria-atomic="true">
      {errors?.map((error) => (
        <p key={error} className="mt-1 text-sm font-medium text-red-700">
          {error}
        </p>
      ))}
    </div>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  errors?: string[];
  hint?: string;
  type?: string;
  name?: string;
  required?: boolean;
  defaultValue?: string | number;
  min?: number;
  max?: number;
  rows?: number;
  multiline?: boolean;
}

function TextField({
  id,
  label,
  errors,
  hint,
  type = 'text',
  name,
  required,
  defaultValue,
  min,
  max,
  rows,
  multiline,
}: TextFieldProps) {
  const describedBy = hint ? `${id}-error ${id}-hint` : `${id}-error`;
  const shared = {
    id,
    name: name ?? id,
    required,
    defaultValue,
    'aria-describedby': describedBy,
    'aria-invalid': errors?.length ? (true as const) : undefined,
    className: fieldClass(errors),
  };

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {multiline ? (
        <textarea {...shared} rows={rows ?? 3} />
      ) : (
        <input {...shared} type={type} min={min} max={max} />
      )}
      {hint && (
        <p id={`${id}-hint`} className={hintClass}>
          {hint}
        </p>
      )}
      <FieldError id={id} errors={errors} />
    </div>
  );
}

export default function MeetingForm({
  action,
  meeting,
  submitLabel,
}: MeetingFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const errors = state.errors;

  return (
    <form
      action={formAction}
      noValidate
      className="space-y-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7"
    >
      {state.message && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          {state.message}
        </p>
      )}

      <fieldset className="space-y-5">
        <legend className="text-lg font-bold">Datos generales</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="date"
            label="Fecha de la reunión"
            type="date"
            required
            defaultValue={meeting?.date ?? ''}
            errors={errors?.date}
          />
          <div>
            <label htmlFor="meetingType" className={labelClass}>
              Tipo de reunión
            </label>
            <select
              id="meetingType"
              name="meetingType"
              required
              defaultValue={meeting?.meetingType ?? 'regular'}
              aria-describedby="meetingType-error"
              aria-invalid={errors?.meetingType?.length ? true : undefined}
              className={fieldClass(errors?.meetingType)}
            >
              {Object.entries(meetingTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <FieldError id="meetingType" errors={errors?.meetingType} />
          </div>
          <TextField
            id="presiding"
            label="Preside"
            required
            defaultValue={meeting?.presiding ?? ''}
            errors={errors?.presiding}
          />
          <TextField
            id="conducting"
            label="Dirige"
            required
            defaultValue={meeting?.conducting ?? ''}
            errors={errors?.conducting}
          />
        </div>
        <TextField
          id="announcements"
          label="Anuncios"
          multiline
          hint="Un anuncio por línea."
          defaultValue={meeting?.announcements?.join('\n') ?? ''}
          errors={errors?.announcements}
        />
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-lg font-bold">Himnos y oraciones</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="openingHymnNumber"
            label="N.º himno de apertura"
            type="number"
            min={1}
            max={999}
            required
            defaultValue={meeting?.openingHymn.number ?? ''}
            errors={errors?.openingHymnNumber}
          />
          <TextField
            id="openingHymnTitle"
            label="Título del himno de apertura"
            required
            defaultValue={meeting?.openingHymn.title ?? ''}
            errors={errors?.openingHymnTitle}
          />
          <TextField
            id="openingPrayer"
            label="Oración de apertura"
            required
            defaultValue={meeting?.openingPrayer ?? ''}
            errors={errors?.openingPrayer}
          />
          <div aria-hidden="true" className="hidden sm:block" />
          <TextField
            id="sacramentHymnNumber"
            label="N.º himno sacramental"
            type="number"
            min={1}
            max={999}
            required
            defaultValue={meeting?.sacramentHymn.number ?? ''}
            errors={errors?.sacramentHymnNumber}
          />
          <TextField
            id="sacramentHymnTitle"
            label="Título del himno sacramental"
            required
            defaultValue={meeting?.sacramentHymn.title ?? ''}
            errors={errors?.sacramentHymnTitle}
          />
          <TextField
            id="closingHymnNumber"
            label="N.º himno de clausura"
            type="number"
            min={1}
            max={999}
            required
            defaultValue={meeting?.closingHymn.number ?? ''}
            errors={errors?.closingHymnNumber}
          />
          <TextField
            id="closingHymnTitle"
            label="Título del himno de clausura"
            required
            defaultValue={meeting?.closingHymn.title ?? ''}
            errors={errors?.closingHymnTitle}
          />
          <TextField
            id="closingPrayer"
            label="Oración de clausura"
            required
            defaultValue={meeting?.closingPrayer ?? ''}
            errors={errors?.closingPrayer}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-lg font-bold">Participación y asuntos</legend>
        <TextField
          id="wardBusiness"
          label="Asuntos del barrio"
          multiline
          hint="Un asunto por línea."
          defaultValue={meeting?.wardBusiness.map((item) => item.description).join('\n') ?? ''}
          errors={errors?.wardBusiness}
        />
        <TextField
          id="speakers"
          label="Discursos"
          multiline
          hint="Una entrada por línea, con el formato Nombre | Tema."
          defaultValue={meeting?.speakers
            .filter((item) => item.type === 'speaker')
            .map((item) => `${item.name} | ${item.topic}`)
            .join('\n')}
          errors={errors?.speakers}
        />
        <TextField
          id="musicalNumbers"
          label="Números musicales"
          multiline
          hint="Una entrada por línea, con el formato Nombre | Tema."
          defaultValue={meeting?.speakers
            .filter((item) => item.type === 'musical-number')
            .map((item) => `${item.name} | ${item.topic}`)
            .join('\n')}
          errors={errors?.musicalNumbers}
        />
        <div>
          <div className="flex items-start gap-3">
            <input
              id="stakeBusiness"
              name="stakeBusiness"
              type="checkbox"
              defaultChecked={meeting?.stakeBusiness ?? false}
              aria-describedby="stakeBusiness-error"
              className="mt-1 size-4 rounded border-[var(--border)] accent-[var(--primary)]"
            />
            <label htmlFor="stakeBusiness" className={labelClass}>
              Se tratarán asuntos de la estaca
            </label>
          </div>
          <FieldError id="stakeBusiness" errors={errors?.stakeBusiness} />
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        >
          {isPending ? 'Guardando…' : submitLabel}
        </button>
        <Link
          href="/meetings"
          className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-semibold hover:bg-[var(--primary-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
