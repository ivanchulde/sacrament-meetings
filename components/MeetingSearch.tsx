'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function MeetingSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get('query') ?? '';
  const inputRef = useRef<HTMLInputElement>(null);
  const previousQuery = useRef(query);

  // The URL is the source of truth: restore the input when it changes from
  // the outside (back/forward buttons, shared links).
  useEffect(() => {
    if (query !== previousQuery.current) {
      previousQuery.current = query;
      if (inputRef.current) inputRef.current.value = query;
    }
  }, [query]);

  const pushSearch = useDebouncedCallback((nextQuery: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextQuery) {
      params.set('query', nextQuery);
    } else {
      params.delete('query');
    }

    // A new search always starts on page 1.
    params.delete('page');

    const next = params.toString();
    if (next !== searchParams.toString()) {
      router.push(`${pathname}?${next}`);
    }
  }, 300);

  return (
    <div className="mb-6">
      <label
        htmlFor="meeting-search"
        className="mb-2 block text-sm font-semibold text-[var(--foreground)]"
      >
        Buscar reuniones
      </label>
      <input
        id="meeting-search"
        ref={inputRef}
        type="search"
        defaultValue={query}
        onChange={(event) => pushSearch(event.target.value)}
        placeholder="Orador, presidente, director o tipo de reunión"
        aria-label="Buscar reuniones"
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] shadow-sm outline-none placeholder:text-[var(--muted)] focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary-light)]"
      />
    </div>
  );
}
