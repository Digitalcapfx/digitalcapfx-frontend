import { SelectOption } from '@/components/ui/Select'
import { getCountries } from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en.json'

const enLabels = en as Record<string, string>;

export const COUNTRY_OPTIONS: SelectOption[] = getCountries()
  .map((countryCode) => ({
    value: countryCode,
    label: enLabels[countryCode] || countryCode,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const getCountryCodeByName = (name: string): string => {
  if (!name) return '';
  if (name.length === 2) return name.toUpperCase();
  const code = Object.keys(enLabels).find((key) => enLabels[key].toLowerCase() === name.toLowerCase());
  return code || name;
};

export const getCountryNameByCode = (code: string): string => {
  if (!code) return '';
  return enLabels[code] || code;
};

export const loadSumsubScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if ((window as any).snsWebSdk) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://static.sumsub.com/idensic/static/sns-websdk-builder.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const GROUP_METADATA: Record<string, { label: string; description: string }> = {
  identity: {
    label: 'Identity Details',
    description: 'Personal details and primary identity identifiers',
  },
  address: {
    label: 'Address Details',
    description: 'Registered residential or physical address details',
  },
  contact: {
    label: 'Contact Details',
    description: 'Primary contact information for account verification',
  },
  financial: {
    label: 'Financial & Trading Details',
    description: 'Occupation, source of funds, and trading counterparties',
  },
};

export const getGroupMeta = (gKey: string) => {
  if (GROUP_METADATA[gKey]) return GROUP_METADATA[gKey];
  const humanLabel = gKey
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return {
    label: `${humanLabel} Details`,
    description: `Complete the required ${humanLabel.toLowerCase()} fields below`,
  };
};

export const getValueForKey = (obj: Record<string, any> | undefined | null, key: string): any => {
  if (!obj || typeof obj !== 'object') return undefined;

  // 1. Direct key lookup
  if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];

  // 2. camelCase lookup (e.g. address_line1 -> addressLine1)
  const camelKey = key.replace(/([-_][a-z])/g, (g) => g.toUpperCase().replace('-', '').replace('_', ''));
  if (obj[camelKey] !== undefined && obj[camelKey] !== null && obj[camelKey] !== '') return obj[camelKey];

  // 3. snake_case lookup (e.g. addressLine1 -> address_line1)
  const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  if (obj[snakeKey] !== undefined && obj[snakeKey] !== null && obj[snakeKey] !== '') return obj[snakeKey];

  // 4. Special cases (counterparties, etc)
  if (key.toLowerCase().includes('counterpart')) {
    const cp = obj.top_3_counterparties ?? obj.top3Counterparties ?? obj.counterparties;
    if (cp !== undefined && cp !== null) return cp;
  }

  if (key.toLowerCase().includes('importer')) {
    const imp = obj.is_importer ?? obj.isImporter;
    if (imp !== undefined && imp !== null) return imp;
  }

  // Fallback if empty string exists on exact key
  if (obj[key] !== undefined) return obj[key];
  if (obj[camelKey] !== undefined) return obj[camelKey];
  if (obj[snakeKey] !== undefined) return obj[snakeKey];

  return undefined;
};
