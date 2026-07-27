/**
 * Global Feature Flags
 *
 * ALLOW_CRYPTO: Set to false to hide/disable all cryptocurrency options,
 * networks, and crypto trading pairs across the application (except iUSD).
 * Simply change ALLOW_CRYPTO to true when crypto features are ready to be re-enabled.
 */
export const FEATURE_FLAGS = {
    ALLOW_CRYPTO: false,
};

export const isCryptoEnabled = (): boolean => FEATURE_FLAGS.ALLOW_CRYPTO;

/**
 * List of crypto tokens/currencies that are disabled when ALLOW_CRYPTO is false.
 * Note: 'iUSD' is intentionally omitted so iUSD remains enabled at all times.
 */
export const CRYPTO_CURRENCIES = [
    'USDT',
    'USDC',
    'BTC',
    'ETH',
    'SOL',
    'POL',
    'TRX',
    'BSC',
    'LTC',
    'XRP',
    'BCH',
    'BNB',
    'MATIC',
    'DOGE',
    'ADA',
    'AVAX',
    'DOT',
    'LINK',
    'UNI',
    'ATOM',
];

/**
 * Helper to test whether a currency/token code is a cryptocurrency (excluding iUSD).
 */
export const isCryptoCurrency = (code?: string): boolean => {
    if (!code) return false;
    const upper = code.trim().toUpperCase();
    if (upper === 'IUSD' || upper === 'USD') return false; // iUSD and fiat USD are kept enabled
    return CRYPTO_CURRENCIES.includes(upper);
};

/**
 * Helper to filter an array of items containing currency codes based on ALLOW_CRYPTO flag.
 */
export function filterCryptoItems<T>(
    items: T[],
    getCode: (item: T) => string
): T[] {
    if (FEATURE_FLAGS.ALLOW_CRYPTO) return items;
    return items.filter((item) => !isCryptoCurrency(getCode(item)));
}
