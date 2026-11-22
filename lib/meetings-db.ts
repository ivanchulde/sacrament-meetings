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

// Mutations used by the Server Actions in lib/actions.ts.
export async function addMeeting(
  data: Omit<SacramentMeeting, 'id'>,
): Promise<number> {
  const rows = await sql`
    INSERT INTO meetings (
      date, meeting_type, presiding, conducting, announcements,
      opening_hymn, opening_prayer, ward_business, stake_business,
      sacrament_hymn, speakers, closing_hymn, closing_prayer
    )
    VALUES (
      ${data.date}::date,
      ${data.meetingType}::varchar,
      ${data.presiding}::varchar,
      ${data.conducting}::varchar,
      ${data.announcements ?? []}::text[],
      ${JSON.stringify(data.openingHymn)}::jsonb,
      ${data.openingPrayer}::varchar,
      ${JSON.stringify(data.wardBusiness ?? [])}::jsonb,
      ${data.stakeBusiness ?? false}::boolean,
      ${JSON.stringify(data.sacramentHymn)}::jsonb,
      ${JSON.stringify(data.speakers ?? [])}::jsonb,
      ${JSON.stringify(data.closingHymn)}::jsonb,
      ${data.closingPrayer}::varchar
    )
    RETURNING id
  `;

  return Number(rows[0].id);
}

export async function updateMeeting(
  id: number,
  updates: Partial<Omit<SacramentMeeting, 'id'>>,
): Promise<boolean> {
  // COALESCE keeps omitted fields untouched. The explicit casts are required
  // so a null parameter still has a known type for PostgreSQL.
  const rows = await sql`
    UPDATE meetings
    SET
      date            = COALESCE(${updates.date ?? null}::date, date),
      meeting_type    = COALESCE(${updates.meetingType ?? null}::varchar, meeting_type),
      presiding       = COALESCE(${updates.presiding ?? null}::varchar, presiding),
      conducting      = COALESCE(${updates.conducting ?? null}::varchar, conducting),
      announcements   = COALESCE(${
        updates.announcements ? updates.announcements : null
      }::text[], announcements),
      opening_hymn    = COALESCE(${
        updates.openingHymn ? JSON.stringify(updates.openingHymn) : null
      }::jsonb, opening_hymn),
      opening_prayer  = COALESCE(${updates.openingPrayer ?? null}::varchar, opening_prayer),
      ward_business   = COALESCE(${
        updates.wardBusiness ? JSON.stringify(updates.wardBusiness) : null
      }::jsonb, ward_business),
      stake_business  = COALESCE(${
        typeof updates.stakeBusiness === 'boolean' ? updates.stakeBusiness : null
      }::boolean, stake_business),
      sacrament_hymn  = COALESCE(${
        updates.sacramentHymn ? JSON.stringify(updates.sacramentHymn) : null
      }::jsonb, sacrament_hymn),
      speakers        = COALESCE(${
        updates.speakers ? JSON.stringify(updates.speakers) : null
      }::jsonb, speakers),
      closing_hymn    = COALESCE(${
        updates.closingHymn ? JSON.stringify(updates.closingHymn) : null
      }::jsonb, closing_hymn),
      closing_prayer  = COALESCE(${updates.closingPrayer ?? null}::varchar, closing_prayer)
    WHERE id = ${id}
    RETURNING id
  `;

  return rows.length > 0;
}

export async function deleteMeeting(id: number): Promise<boolean> {
  const rows = await sql`
    DELETE FROM meetings
    WHERE id = ${id}
    RETURNING id
  `;

  return rows.length > 0;
}
