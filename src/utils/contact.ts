// src/utils/contact.ts
export const CONTACT_EMAIL = 'contact@anstalle.com';

const isChineseVersion = import.meta.env.VITE_IS_CHINESE_VERSION === 'true';

export const CONTACT_PHONE = isChineseVersion
  ? '+86 15822674205'
  : '+33 0662926877';


export const PLAN_PRICES: Record<string, { usd: number; cny: number; eur: number }> = {
  week:   { usd: 4,   cny: 28,   eur: 2.3 },
  month:  { usd: 12,  cny: 68,   eur: 8.8 },
  season: { usd: 28,  cny: 198,  eur: 26.8 },
  year:   { usd: 88,  cny: 538,  eur: 76.8 },
};