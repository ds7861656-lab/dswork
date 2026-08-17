// src/hooks/useCurrency.ts
import { useTranslation } from 'react-i18next';
import { PLAN_PRICES } from '../utils/contact';

type CurrencyKey = 'cny' | 'eur' | 'usd';

export const useCurrency = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language?.toLowerCase() || 'en';

  // Decide currency from language
  let currencyKey: CurrencyKey = 'usd';
  if (lang.startsWith('zh')) {
    currencyKey = 'cny';
  } else if (lang.startsWith('fr')) {
    currencyKey = 'eur';
  }
  // English, Arabic, and everything else → USD

  const symbolMap: Record<CurrencyKey, string> = {
    cny: '¥',
    eur: '€',
    usd: '$',
  };

  const codeMap: Record<CurrencyKey, string> = {
    cny: 'CNY',
    eur: 'EUR',
    usd: 'USD',
  };

  const symbol = symbolMap[currencyKey];
  const code = codeMap[currencyKey];
  const isChinese = currencyKey === 'cny';
  const isEuro = currencyKey === 'eur';

  const getPrice = (planId: string): number => {
    const prices = PLAN_PRICES[planId];
    if (!prices) return 0;
    return prices[currencyKey];
  };

  const format = (planId: string): string => `${symbol}${getPrice(planId)}`;

  return { symbol, code, isChinese, isEuro, getPrice, format };
};