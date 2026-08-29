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
 * Helper to calculate the CAAS fee amount for a given send amount.
 * Capped at CAAS_MAX_FEE (1.2 USDT / USDC).
 */
export const calculateCaasFee = (amount: number): number => {
    if (!amount || isNaN(amount) || amount <= 0) return 0;
    const rawFee = (amount * CAAS_FEE_PERCENTAGE) / 100;
    return Math.min(rawFee, CAAS_MAX_FEE);
};

/**
 * Helper to calculate the net amount the recipient receives (Amount - Fee).
 */
export const calculateCaasRecipientReceives = (amount: number): number => {
    if (!amount || isNaN(amount) || amount <= 0) return 0;
    const fee = calculateCaasFee(amount);
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
