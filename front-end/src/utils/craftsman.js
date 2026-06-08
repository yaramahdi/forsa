const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

/**
 * Resolves a relative image path to a full URL.
 * Handles both "/uploads/..." and "uploads/..." (missing leading slash).
 */
export function resolveImage(src) {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  if (src.startsWith('/uploads')) return `${API_BASE_URL}${src}`;
  if (src.startsWith('uploads')) return `${API_BASE_URL}/${src}`;
  return src;
}

/**
 * Profession lookup map. Keys are both English identifiers and Arabic labels
 * so any value stored in the DB normalizes correctly.
 */
export const professionMeta = {
  engineer:    { key: 'engineer',    ar: 'مهندس',    en: 'Engineer'    },
  plumber:     { key: 'plumber',     ar: 'سباك',     en: 'Plumber'     },
  painter:     { key: 'painter',     ar: 'دهان',     en: 'Painter'     },
  carpenter:   { key: 'carpenter',   ar: 'نجار',     en: 'Carpenter'   },
  electrician: { key: 'electrician', ar: 'كهربائي',  en: 'Electrician' },
  technician:  { key: 'technician',  ar: 'فني',      en: 'Technician'  },
  driver:      { key: 'driver',      ar: 'سائق',     en: 'Driver'      },
  mechanic:    { key: 'mechanic',    ar: 'ميكانيكي', en: 'Mechanic'    },
  // Arabic keys for direct lookups (backend stores Arabic labels)
  مهندس:    { key: 'engineer',    ar: 'مهندس',    en: 'Engineer'    },
  سباك:     { key: 'plumber',     ar: 'سباك',     en: 'Plumber'     },
  'سبّاك':  { key: 'plumber',     ar: 'سباك',     en: 'Plumber'     },
  دهان:     { key: 'painter',     ar: 'دهان',     en: 'Painter'     },
  نجار:     { key: 'carpenter',   ar: 'نجار',     en: 'Carpenter'   },
  كهربائي:  { key: 'electrician', ar: 'كهربائي',  en: 'Electrician' },
  فني:      { key: 'technician',  ar: 'فني',      en: 'Technician'  },
  سائق:     { key: 'driver',      ar: 'سائق',     en: 'Driver'      },
  ميكانيكي: { key: 'mechanic',    ar: 'ميكانيكي', en: 'Mechanic'    },
};

/**
 * Returns the logged-in craftsman's ID from localStorage, or '' if not found.
 */
export function getCurrentLoggedInCraftsmanId() {
  if (typeof window === 'undefined') return '';
  try {
    const raw = window.localStorage.getItem('forsaCraftsman');
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    return String(parsed?._id || parsed?.id || '').trim();
  } catch {
    return '';
  }
}

function normalizePriceValue(item) {
  const candidates = [
    item?.price, item?.hourlyRate, item?.servicePrice,
    item?.startingPrice, item?.minPrice, item?.priceRange?.min,
  ];
  const found = candidates.find((v) => v !== undefined && v !== null && v !== '');
  if (found === undefined) return null;
  const numeric = Number(found);
  return Number.isFinite(numeric) ? numeric : null;
}

/**
 * Normalizes a raw craftsman object from the API into a consistent shape.
 *
 * @typedef {Object} NormalizedCraftsman
 * @property {string}      id
 * @property {string}      firstName
 * @property {string}      lastName
 * @property {string}      fullName           - "firstName lastName"
 * @property {string}      profession         - Arabic display label, e.g. "مهندس"
 * @property {string}      professionKey      - English key, e.g. "engineer"
 * @property {string}      professionEn       - English label, e.g. "Engineer"
 * @property {string}      city
 * @property {string}      neighborhood
 * @property {string}      address            - "city - neighborhood" formatted
 * @property {string}      phone
 * @property {string}      email
 * @property {number}      yearsOfExperience
 * @property {number|null} price
 * @property {string}      profileImage       - resolved URL (empty string if none)
 * @property {string[]}    workImages         - array of resolved URLs
 * @property {string}      bio
 * @property {boolean}     featured
 * @property {boolean}     verified           - true when featured (admin-approved)
 */
export function normalizeCraftsman(item) {
  if (!item) return null;

  const rawProfession = String(item?.profession || '').trim();
  const professionInfo = professionMeta[rawProfession] || {
    key: rawProfession.toLowerCase(),
    ar: rawProfession || 'غير محدد',
    en: rawProfession || 'Unknown',
  };

  const firstName = item?.firstName || '';
  const lastName  = item?.lastName  || '';
  const city         = item?.city         || '';
  const neighborhood = item?.neighborhood || '';

  return {
    id:               item?._id || item?.id || '',
    firstName,
    lastName,
    fullName:         `${firstName} ${lastName}`.trim() || 'بدون اسم',
    profession:       professionInfo.ar,
    professionKey:    professionInfo.key,
    professionEn:     professionInfo.en,
    city,
    neighborhood,
    address:          [city, neighborhood].filter(Boolean).join(' - ') || 'العنوان غير متوفر',
    phone:            item?.phone || '',
    email:            item?.email || '',
    yearsOfExperience: Number(item?.yearsOfExperience ?? item?.years ?? 0),
    price:            normalizePriceValue(item),
    profileImage:     resolveImage(item?.profileImage || item?.avatar || item?.image || ''),
    workImages:       Array.isArray(item?.workImages)
                        ? item.workImages.map(resolveImage).filter(Boolean)
                        : [],
    bio:              item?.bio || '',
    featured:         Boolean(item?.featured ?? item?.isFeatured ?? false),
    verified:         Boolean(item?.featured ?? item?.isFeatured ?? false),
  };
}
