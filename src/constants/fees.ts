/**
 * Fee configuration constants for DigitalFX Web Application
 */

/**
 * CAAS (Crypto-as-a-Service) transfer fee percentage for USDT / USDC stablecoin transactions.
 * Example: 0.4 means 0.4% fee. Sending 100 USDT incurs a 0.40 USDT fee (Total required: 100.40 USDT).
 */
export const CAAS_FEE_PERCENTAGE = 0.4;

/**
 * Helper to calculate the CAAS fee amount for a given send amount.
 */
export const calculateCaasFee = (amount: number): number => {
    if (!amount || isNaN(amount) || amount <= 0) return 0;
    return (amount * CAAS_FEE_PERCENTAGE) / 100;
};

/**
 * Helper to calculate total amount required (Amount + Fee).
 */
export const calculateCaasTotalRequired = (amount: number): number => {
    const fee = calculateCaasFee(amount);
    return amount + fee;
};
