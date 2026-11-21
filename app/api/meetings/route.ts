import { getMeetings } from '@/lib/meetings-db';

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const date = params.get('date');
  const query = params.get('query') ?? '';
  const rawPage = params.get('page');
  const page =
    rawPage && /^\d+$/.test(rawPage) && Number(rawPage) > 0
      ? Number(rawPage)
      : undefined;

  const meetings = await getMeetings(query, page, date);

  return Response.json(meetings);
}
