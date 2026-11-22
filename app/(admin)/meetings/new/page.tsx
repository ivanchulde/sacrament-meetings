import type { Metadata } from 'next';
import MeetingForm from '@/components/MeetingForm';
import { createMeeting } from '@/lib/actions';

export const metadata: Metadata = {
  title: 'Nueva reunión | Sacrament Meeting Planner',
};

export default function NewMeetingPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-6 text-2xl font-bold">Nueva reunión</h2>
      <MeetingForm action={createMeeting} submitLabel="Crear reunión" />
    </div>
  );
}
