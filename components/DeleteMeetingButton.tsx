'use client';

import { useFormStatus } from 'react-dom';

interface DeleteMeetingButtonProps {
  action: () => Promise<void>;
  description: string;
}

function SubmitButton({ description }: { description: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={`Eliminar ${description}`}
      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
    >
      {pending ? 'Eliminando…' : 'Eliminar'}
    </button>
  );
}

export default function DeleteMeetingButton({
  action,
  description,
}: DeleteMeetingButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`¿Eliminar ${description}? Esta acción no se puede deshacer.`)) {
          event.preventDefault();
        }
      }}
    >
      <SubmitButton description={description} />
    </form>
  );
}
