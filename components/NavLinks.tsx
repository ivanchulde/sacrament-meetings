'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/meetings', label: 'Reuniones' },
  { href: '/meetings/current', label: 'Reunión actual' },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegación principal">
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => {
          // Only the longest matching link is the current page, so a detail
          // route does not mark both "Reuniones" and "Reunión actual".
          const activeHref = links
            .filter((candidate) =>
              candidate.href === '/'
                ? pathname === '/'
                : pathname === candidate.href ||
                  pathname.startsWith(`${candidate.href}/`),
            )
            .sort((a, b) => b.href.length - a.href.length)[0]?.href;
          const isActive = link.href === activeHref;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--foreground)] hover:bg-[var(--primary-light)]'
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}