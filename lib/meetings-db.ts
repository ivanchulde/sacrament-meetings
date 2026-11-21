import { neon } from '@neondatabase/serverless';
import type { SacramentMeeting } from './types';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(connectionString);

const ITEMS_PER_PAGE = 5;

function searchPattern(query: string): string {
  // Escape ILIKE wildcards so a literal % or _ in the query is not treated
  // as a pattern by PostgreSQL.
  const escaped = query.replace(/[\\%_]/g, '\\$&');
  return `%${escaped}%`;
}

export async function getMeetings(
  query: string = '',
  currentPage?: number,
  date?: string | null,
): Promise<SacramentMeeting[]> {
  const searchTerm = searchPattern(query);
  const filterDate = date ?? null;
  // No `currentPage` means "return every match" (used by the API route).
  const limit = currentPage === undefined ? null : ITEMS_PER_PAGE;
  const offset =
    currentPage === undefined ? 0 : (currentPage - 1) * ITEMS_PER_PAGE;

  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings
    WHERE (${filterDate}::text IS NULL OR date = ${filterDate}::date)
      AND (
        presiding     ILIKE ${searchTerm} ESCAPE '\\'
        OR conducting ILIKE ${searchTerm} ESCAPE '\\'
        OR meeting_type ILIKE ${searchTerm} ESCAPE '\\'
        OR speakers::text ILIKE ${searchTerm} ESCAPE '\\'
        OR CASE meeting_type
             WHEN 'testimony' THEN 'Reunión de testimonios'
             WHEN 'regular'   THEN 'Reunión sacramental'
             WHEN 'stake'     THEN 'Reunión de estaca'
             WHEN 'general'   THEN 'Conferencia general'
             WHEN 'special'   THEN 'Reunión especial'
             ELSE meeting_type
           END ILIKE ${searchTerm} ESCAPE '\\'
      )
    ORDER BY date DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  return rows as unknown as SacramentMeeting[];
}

export async function getMeetingsTotalPages(
  query: string = '',
  date?: string | null,
): Promise<number> {
  const searchTerm = searchPattern(query);
  const filterDate = date ?? null;

  const rows = await sql`
    SELECT COUNT(*) FROM meetings
    WHERE (${filterDate}::text IS NULL OR date = ${filterDate}::date)
      AND (
        presiding     ILIKE ${searchTerm} ESCAPE '\\'
        OR conducting ILIKE ${searchTerm} ESCAPE '\\'
        OR meeting_type ILIKE ${searchTerm} ESCAPE '\\'
        OR speakers::text ILIKE ${searchTerm} ESCAPE '\\'
        OR CASE meeting_type
             WHEN 'testimony' THEN 'Reunión de testimonios'
             WHEN 'regular'   THEN 'Reunión sacramental'
             WHEN 'stake'     THEN 'Reunión de estaca'
             WHEN 'general'   THEN 'Conferencia general'
             WHEN 'special'   THEN 'Reunión especial'
             ELSE meeting_type
           END ILIKE ${searchTerm} ESCAPE '\\'
      )
  `;

  return Math.max(1, Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE));
}

export async function getMeetingById(
  id: number,
): Promise<SacramentMeeting | null> {
  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings
    WHERE id = ${id}
  `;

  return (rows[0] as unknown as SacramentMeeting) ?? null;
}

// Mutation stubs — will be wired to the database in Week 04 when forms are built.
export async function addMeeting(
  _data: Omit<SacramentMeeting, 'id'>,
): Promise<SacramentMeeting> {
  throw new Error('addMeeting: database implementation coming in Week 04');
}

export async function updateMeeting(
  _id: number,
  _updates: Partial<SacramentMeeting>,
): Promise<SacramentMeeting | null> {
  throw new Error('updateMeeting: database implementation coming in Week 04');
}

export async function deleteMeeting(_id: number): Promise<boolean> {
  throw new Error('deleteMeeting: database implementation coming in Week 04');
}
