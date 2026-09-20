import type { SacramentMeeting } from './types';

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-09-20',
    meetingType: 'regular',
    presiding: 'Obispo Luis Chulde',
    conducting: 'Hermano Carlos Mendoza',
    announcements: [
      'La reunión de jóvenes será el miércoles a las 18:30.',
      'Las entrevistas de diezmos estarán disponibles después de la reunión.',
    ],
    openingHymn: {
      number: 2,
      title: 'El Espíritu de Dios',
    },
    openingPrayer: 'Hermano Carlos Mendoza',
    wardBusiness: [
      {
        description: 'Sostenimiento de nuevos llamamientos.',
      },
    ],
    stakeBusiness: false,
    sacramentHymn: {
      number: 105,
      title: 'Jesús, en la corte celestial',
    },
    speakers: [
      {
        name: 'Ana Cristina Borja',
        topic: 'La importancia de la oración',
        type: 'speaker',
      },
      {
        name: 'Coro del Barrio',
        topic: 'Venid a mí',
        type: 'musical-number',
      },
      {
        name: 'Luis Chulde',
        topic: 'Seguir al Salvador',
        type: 'speaker',
      },
    ],
    closingHymn: {
      number: 73,
      title: 'Yo sé que vive mi Señor',
    },
    closingPrayer: 'Hermana María González',
  },
  {
    id: 2,
    date: '2026-09-13',
    meetingType: 'testimony',
    presiding: 'Obispo Luis Chulde',
    conducting: 'Hermano José Ramírez',
    announcements: [
      'La actividad de barrio se realizará el próximo sábado.',
    ],
    openingHymn: {
      number: 16,
      title: 'Un pobre forastero',
    },
    openingPrayer: 'Hermano José Ramírez',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: {
      number: 117,
      title: 'Jesús es nuestro amigo',
    },
    speakers: [
      {
        name: 'Miembros del barrio',
        topic: 'Reunión de testimonios',
        type: 'speaker',
      },
    ],
    closingHymn: {
      number: 89,
      title: 'Oh, dulce paz',
    },
    closingPrayer: 'Hermana Laura Pérez',
  },
  {
    id: 3,
    date: '2026-09-06',
    meetingType: 'regular',
    presiding: 'Obispo Luis Chulde',
    conducting: 'Hermana Patricia López',
    announcements: [
      'La clase de inglés comenzará el martes a las 18:30.',
      'Se invita a todos los miembros a participar en la actividad familiar.',
    ],
    openingHymn: {
      number: 100,
      title: 'La luz de Dios',
    },
    openingPrayer: 'Hermana Patricia López',
    wardBusiness: [
      {
        description: 'Sostenimiento de llamamientos.',
      },
    ],
    stakeBusiness: true,
    sacramentHymn: {
      number: 93,
      title: '¡Oh, está todo bien!',
    },
    speakers: [
      {
        name: 'Pedro Torres',
        topic: 'La fe en Jesucristo',
        type: 'speaker',
      },
      {
        name: 'Coro del Barrio',
        topic: 'Venid a mí',
        type: 'musical-number',
      },
    ],
    closingHymn: {
      number: 60,
      title: 'Venid, los que tenéis de Dios el llamamiento',
    },
    closingPrayer: 'Hermano Andrés Castillo',
  },
  {
    id: 4,
    date: '2026-08-30',
    meetingType: 'stake',
    presiding: 'Presidente David Martínez',
    conducting: 'Hermano Roberto Sánchez',
    announcements: ['La conferencia de estaca será el próximo mes.'],
    openingHymn: {
      number: 27,
      title: 'Oh, cómo amo a Jehová',
    },
    openingPrayer: 'Hermano Roberto Sánchez',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: {
      number: 101,
      title: 'Dios, bendícenos',
    },
    speakers: [
      {
        name: 'Presidente David Martínez',
        topic: 'Fortalecer nuestra fe',
        type: 'speaker',
      },
      {
        name: 'Hermana Sofía Andrade',
        topic: 'El servicio cristiano',
        type: 'speaker',
      },
    ],
    closingHymn: {
      number: 99,
      title: 'Tan solo con pensar en ti',
    },
    closingPrayer: 'Hermano Miguel Herrera',
  },
  {
    id: 5,
    date: '2026-08-23',
    meetingType: 'general',
    presiding: 'Élder William Johnson',
    conducting: 'Hermano Fernando Ruiz',
    announcements: [
      'La transmisión de la conferencia general estará disponible para todos los miembros.',
    ],
    openingHymn: {
      number: 66,
      title: 'Venid a mí',
    },
    openingPrayer: 'Hermana Daniela Morales',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: {
      number: 117,
      title: 'Jesús es nuestro amigo',
    },
    speakers: [
      {
        name: 'Élder William Johnson',
        topic: 'La esperanza en Cristo',
        type: 'speaker',
      },
      {
        name: 'Cuarteto del Barrio',
        topic: 'Te seguiré',
        type: 'musical-number',
      },
    ],
    closingHymn: {
      number: 73,
      title: 'Yo sé que vive mi Señor',
    },
    closingPrayer: 'Hermano Fernando Ruiz',
  },
];

export function getMeetings(
  date?: string | null,
): SacramentMeeting[] {
  if (date) {
    return meetings.filter((meeting) => meeting.date === date);
  }

  return [...meetings].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

export function getMeetingById(
  id: number,
): SacramentMeeting | null {
  return meetings.find((meeting) => meeting.id === id) ?? null;
}