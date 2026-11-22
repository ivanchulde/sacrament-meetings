'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
  addMeeting,
  deleteMeeting as deleteMeetingRecord,
  updateMeeting as updateMeetingRecord,
} from './meetings-db';
import type { MeetingType, SpeakerItem } from './types';

const MEETING_TYPES = [
  'testimony',
  'regular',
  'stake',
  'general',
  'special',
] as const satisfies readonly MeetingType[];

const hymnNumberSchema = z
  .string({ error: 'Ingresa el número del himno.' })
  .trim()
  .min(1, 'Ingresa el número del himno.')
  .refine(
    (value) =>
      !value || (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 999),
    'El número debe estar entre 1 y 999.',
  );

const hymnTitleSchema = z
  .string({ error: 'Escribe el título del himno.' })
  .trim()
  .min(2, 'Escribe el título del himno (al menos 2 caracteres).');

const person = z
  .string()
  .trim()
  .min(3, 'Escribe el nombre (al menos 3 caracteres).');

const prayer = z
  .string()
  .trim()
  .min(3, 'Escribe el nombre de quien ofrece la oración.');

function isRealDate(value: string): boolean {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function hasValidEntries(value: string | undefined): boolean {
  if (!value) return true;

  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .every((line) => {
      const parts = line.split('|');
      return (
        parts.length === 2 &&
        parts[0].trim().length > 0 &&
        parts[1].trim().length > 0
      );
    });
}

const MeetingFormSchema = z.object({
  date: z
    .string({ error: 'Selecciona una fecha.' })
    .trim()
    .refine((value) => value.length > 0, 'Selecciona una fecha.')
    .refine(
      (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value),
      'Usa el formato AAAA-MM-DD.',
    )
    .refine(
      (value) =>
        !value ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        isRealDate(value),
      'La fecha no existe en el calendario.',
    ),
  meetingType: z.enum(MEETING_TYPES, {
    error: 'Selecciona un tipo de reunión.',
  }),
  presiding: person,
  conducting: person,
  announcements: z.string().trim().optional(),
  openingHymnNumber: hymnNumberSchema,
  openingHymnTitle: hymnTitleSchema,
  openingPrayer: prayer,
  wardBusiness: z.string().trim().optional(),
  stakeBusiness: z.boolean(),
  sacramentHymnNumber: hymnNumberSchema,
  sacramentHymnTitle: hymnTitleSchema,
  speakers: z
    .string()
    .trim()
    .optional()
    .refine(
      hasValidEntries,
      'Usa el formato Nombre | Tema, una entrada por línea.',
    ),
  musicalNumbers: z
    .string()
    .trim()
    .optional()
    .refine(
      hasValidEntries,
      'Usa el formato Nombre | Tema, una entrada por línea.',
    ),
  closingHymnNumber: hymnNumberSchema,
  closingHymnTitle: hymnTitleSchema,
  closingPrayer: prayer,
});

type MeetingFormValues = z.infer<typeof MeetingFormSchema>;

export type State = {
  message?: string | null;
  errors?: Partial<Record<keyof MeetingFormValues, string[]>>;
};

function validationState(error: z.ZodError<MeetingFormValues>): State {
  return {
    errors: z.flattenError(error).fieldErrors as State['errors'],
    message: 'Revisa los campos marcados antes de continuar.',
  };
}

function toLines(value: string | undefined): string[] {
  return (value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function toPeople(
  value: string | undefined,
  type: SpeakerItem['type'],
): SpeakerItem[] {
  return toLines(value).map((line) => {
    const [name, topic] = line.split('|').map((part) => part.trim());
    return { name, topic, type };
  });
}

function toMeeting(values: MeetingFormValues): Omit<
  import('./types').SacramentMeeting,
  'id'
> {
  return {
    date: values.date,
    meetingType: values.meetingType,
    presiding: values.presiding,
    conducting: values.conducting,
    announcements: toLines(values.announcements),
    openingHymn: {
      number: Number(values.openingHymnNumber),
      title: values.openingHymnTitle,
    },
    openingPrayer: values.openingPrayer,
    wardBusiness: toLines(values.wardBusiness).map((description) => ({
      description,
    })),
    stakeBusiness: values.stakeBusiness,
    sacramentHymn: {
      number: Number(values.sacramentHymnNumber),
      title: values.sacramentHymnTitle,
    },
    speakers: [
      ...toPeople(values.speakers, 'speaker'),
      ...toPeople(values.musicalNumbers, 'musical-number'),
    ],
    closingHymn: {
      number: Number(values.closingHymnNumber),
      title: values.closingHymnTitle,
    },
    closingPrayer: values.closingPrayer,
  };
}

function formDataToValues(formData: FormData): unknown {
  return {
    date: formData.get('date'),
    meetingType: formData.get('meetingType'),
    presiding: formData.get('presiding'),
    conducting: formData.get('conducting'),
    announcements: formData.get('announcements') ?? '',
    openingHymnNumber: formData.get('openingHymnNumber'),
    openingHymnTitle: formData.get('openingHymnTitle'),
    openingPrayer: formData.get('openingPrayer'),
    wardBusiness: formData.get('wardBusiness') ?? '',
    stakeBusiness: formData.has('stakeBusiness'),
    sacramentHymnNumber: formData.get('sacramentHymnNumber'),
    sacramentHymnTitle: formData.get('sacramentHymnTitle'),
    speakers: formData.get('speakers') ?? '',
    musicalNumbers: formData.get('musicalNumbers') ?? '',
    closingHymnNumber: formData.get('closingHymnNumber'),
    closingHymnTitle: formData.get('closingHymnTitle'),
    closingPrayer: formData.get('closingPrayer'),
  };
}

function isUniqueDateError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === '23505'
  );
}

function duplicateDateState(): State {
  return {
    errors: { date: ['Ya existe una reunión con esa fecha.'] },
    message: 'No se pudo guardar la reunión.',
  };
}

function isValidId(id: number): boolean {
  return Number.isSafeInteger(id) && id > 0;
}

export async function createMeeting(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const parsed = MeetingFormSchema.safeParse(formDataToValues(formData));

  if (!parsed.success) {
    return validationState(parsed.error);
  }

  try {
    await addMeeting(toMeeting(parsed.data));
  } catch (error) {
    console.error('Error creating meeting:', error);
    // A duplicate date is a normal user mistake, so show it on the field.
    if (isUniqueDateError(error)) {
      return duplicateDateState();
    }
    throw new Error(
      'No se pudo crear la reunión. Inténtalo de nuevo más tarde.',
    );
  }

  revalidatePath('/meetings');
  redirect('/meetings');
}

export async function updateMeeting(
  id: number,
  _prevState: State,
  formData: FormData,
): Promise<State> {
  if (!isValidId(id)) {
    throw new Error('ID de reunión inválido.');
  }

  const parsed = MeetingFormSchema.safeParse(formDataToValues(formData));

  if (!parsed.success) {
    return validationState(parsed.error);
  }

  try {
    const updated = await updateMeetingRecord(id, toMeeting(parsed.data));
    if (!updated) {
      throw new Error(`Meeting ${id} no longer exists`);
    }
  } catch (error) {
    console.error('Error updating meeting:', error);
    if (isUniqueDateError(error)) {
      return duplicateDateState();
    }
    throw new Error(
      'No se pudo actualizar la reunión. Inténtalo de nuevo más tarde.',
    );
  }

  revalidatePath('/meetings');
  revalidatePath(`/meetings/${id}`);
  redirect('/meetings');
}

export async function deleteMeeting(id: number): Promise<void> {
  if (!isValidId(id)) {
    throw new Error('ID de reunión inválido.');
  }

  try {
    const deleted = await deleteMeetingRecord(id);
    if (!deleted) {
      throw new Error(`Meeting ${id} no longer exists`);
    }
  } catch (error) {
    console.error('Error deleting meeting:', error);
    throw new Error(
      'No se pudo eliminar la reunión. Inténtalo de nuevo más tarde.',
    );
  }

  revalidatePath('/meetings');
  revalidatePath(`/meetings/${id}`);
}
