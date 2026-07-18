import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSnakeCaseString(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export function toCamelCaseString(str: string): string {
  return str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));
}

export function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toSnakeCase(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result: any, key) => {
      result[toSnakeCaseString(key)] = toSnakeCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
}

export function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result: any, key) => {
      result[toCamelCaseString(key)] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
}

export function formatCurrencyByLocale(amount: string | number, currency: string): string {
  const val = typeof amount === 'number' ? amount : parseFloat(amount || '0');
  if (isNaN(val)) return '0.00';
  
  const isLocalAfrican = currency.toUpperCase() === 'XAF' || currency.toUpperCase() === 'XOF';
  const fractionDigits = isLocalAfrican ? 0 : 2;
  
  // Use navigator.language client-side, fallback to undefined on server
  const locale = typeof navigator !== 'undefined' ? navigator.language : undefined;
  
  const formatted = val.toLocaleString(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  });
  
  if (isLocalAfrican) {
    return `${formatted} ${currency}`;
  }
  
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  const prefix = symbols[currency.toUpperCase()] || '';
  return `${prefix}${formatted}${prefix ? '' : ` ${currency}`}`;
}
