/**
 * Fee configuration constants for DigitalCapFx Web Application
 */

/**
 * CAAS (Crypto-as-a-Service) transfer fee percentage for USDT / USDC stablecoin transactions.
 * Fee is 0.3% capped at 1.2 USDT / USDC.
 * Fee is charged from the amount the user is sending, so the recipient receives (Amount - Fee).
 * Example: Sending 100 USDT incurs a 0.30 USDT fee, recipient receives 99.70 USDT.
 * Sending 1,000 USDT incurs a 1.20 USDT fee (capped), recipient receives 998.80 USDT.
 */
export const CAAS_FEE_PERCENTAGE = 0.3;
export const CAAS_MAX_FEE = 1.2;

/**
 * Check if transfer fee is enabled.
 * Only enabled when URL query contains `useFee=true` (or persisted in session/local storage).
 */
export const isFeeEnabled = (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('useFee')) {
            const isEnabled = urlParams.get('useFee') === 'true' || urlParams.get('useFee') === '1';
            if (isEnabled) {
                localStorage.setItem('dfx_use_fee', 'true');
            } else {
                localStorage.removeItem('dfx_use_fee');
            }
            return isEnabled;
        }
        return localStorage.getItem('dfx_use_fee') === 'true';
    } catch {
        return false;
    }
};

/**
 * Helper to calculate the CAAS fee amount for a given send amount.
 * Capped at CAAS_MAX_FEE (1.2 USDT / USDC).
 * Returns 0 if fee calculation is disabled (useFee !== true).
 */
export const calculateCaasFee = (amount: number, forceFee?: boolean): number => {
    if (!amount || isNaN(amount) || amount <= 0) return 0;
    if (!forceFee && !isFeeEnabled()) return 0;
    const rawFee = (amount * CAAS_FEE_PERCENTAGE) / 100;
    return Math.min(rawFee, CAAS_MAX_FEE);
};

/**
 * Helper to calculate the net amount the recipient receives (Amount - Fee).
 * Returns full amount if fee calculation is disabled.
 */
export const calculateCaasRecipientReceives = (amount: number, forceFee?: boolean): number => {
    if (!amount || isNaN(amount) || amount <= 0) return 0;
    const fee = calculateCaasFee(amount, forceFee);
    return Math.max(0, amount - fee);
};

/**
 * Helper to calculate total amount required from user balance.
 * Since the fee is deducted from the amount sent, the required balance is the amount entered.
 */
export const calculateCaasTotalRequired = (amount: number): number => {
    if (!amount || isNaN(amount) || amount <= 0) return 0;
    return amount;
};
