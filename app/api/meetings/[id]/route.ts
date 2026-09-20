import { getMeetingById } from '@/lib/meetings-db';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const { id } = await context.params;
  const meetingId = Number(id);

  if (!Number.isInteger(meetingId)) {
    return Response.json(
      { error: 'ID de reunión inválido' },
      { status: 400 },
    );
  }

  const meeting = getMeetingById(meetingId);

  if (!meeting) {
    return Response.json(
      { error: 'Reunión no encontrada' },
      { status: 404 },
    );
  }

  return Response.json(meeting);
}