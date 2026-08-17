import { BaseService } from './base.service';

export interface AccountData {
  id: string;
  accountNumber: string;
  balance: string;
  availableBalance: string;
  currency: string;
  status: string;
  createdAt: string;
  iban?: string | null;
  bic?: string | null;
  sortCode?: string | null;
  accountNumberUk?: string | null;
}

export interface AccountListResponse {
  success: boolean;
  data: AccountData[];
}

export interface CryptoTokenData {
  symbol?: string;
  name?: string;
  balance?: number;
  balance_raw?: string;
  balanceRaw?: string;
  balance_usdc?: string;
  balanceUsdc?: string;
  balance_usdt?: string;
  balance_formatted?: string;
  balanceFormatted?: string;
  wallet_address?: string;
  walletAddress?: string;
}

export interface CryptoBalanceData extends CryptoTokenData {
  tokens?: CryptoTokenData[];
}

export interface CryptoBalanceResponse {
  success: boolean;
  data: CryptoBalanceData | CryptoBalanceData[];
}

export const extractCryptoTokenList = (data: any): CryptoTokenData[] => {
  if (!data) return [];
  if (data.tokens && Array.isArray(data.tokens) && data.tokens.length > 0) {
    const rootAddress = data.wallet_address || data.walletAddress || '';
    return data.tokens.map((t: any) => ({
      ...t,
      wallet_address: t.wallet_address || t.walletAddress || rootAddress,
      walletAddress: t.wallet_address || t.walletAddress || rootAddress,
    }));
  }
  if (Array.isArray(data)) {
    return data;
  }
  if (typeof data === 'object') {
    const rootAddress = data.wallet_address || data.walletAddress || '';
    const tokens: CryptoTokenData[] = [];
    const usdcVal = parseFloat(data.balance_usdc || data.balanceUsdc || (data.symbol === 'USDC' ? data.balance : 0) || '0');
    tokens.push({
      symbol: 'USDC',
      name: 'USD Coin',
      balance: usdcVal,
      balance_raw: data.balance_usdc || String(usdcVal),
      balance_formatted: `${usdcVal.toFixed(2)} USDC`,
      wallet_address: rootAddress,
    });
    const usdtVal = parseFloat(data.balance_usdt || data.balanceUsdt || (data.symbol === 'USDT' ? data.balance : 0) || '0');
    tokens.push({
      symbol: 'USDT',
      name: 'Tether USD',
      balance: usdtVal,
      balance_raw: data.balance_usdt || String(usdtVal),
      balance_formatted: `${usdtVal.toFixed(2)} USDT`,
      wallet_address: rootAddress,
    });
    return tokens;
  }
  return [data];
};

export interface CaasWalletData {
  caasWalletId?: string;
  caas_wallet_id?: string;
  abstractionAddress?: string;
  abstraction_address?: string;
  walletAddress?: string;
  id?: string;
  is_active?: boolean;
  user_id?: string;
  createdAt?: string;
  created_at?: string;
}

export interface CaasWalletResponse {
  success: boolean;
  data: CaasWalletData;
}

class AccountService extends BaseService {
  async getAccounts(): Promise<AccountListResponse> {
    const response = await this.api.get('/accounts');
    return response.data;
  }

  async getCryptoBalances(): Promise<CryptoBalanceResponse> {
    const response = await this.api.get('/crypto/balances');
    return response.data;
  }

  async getCryptoWallet(): Promise<CaasWalletResponse> {
    const response = await this.api.get('/crypto/wallet');
    return response.data;
  }

  async getAccountByCurrency(currency: string): Promise<{ success: boolean; data: AccountData }> {
    const response = await this.api.get(`/accounts/${currency}`);
    return response.data;
  }

  async getTransactionDetails(currency: string, id: string): Promise<{ success: boolean; data: any }> {
    const response = await this.api.get(`/accounts/${currency}/transactions/${id}`);
    return response.data;
  }

  async getFiatWalletDetail(currency: string): Promise<{ success: boolean; data: any }> {
    const response = await this.api.get(`/wallets/fiat/${currency}`);
    return response.data;
  }

  async getFiatWalletTransactions(currency: string): Promise<{ success: boolean; data: any[] }> {
    const response = await this.api.get(`/wallets/fiat/${currency}/transactions`);
    return response.data;
  }

  async getStablecoinWalletDetail(symbol: string): Promise<{ success: boolean; data: any }> {
    const response = await this.api.get(`/wallets/stablecoin/${symbol}`);
    return response.data;
  }

  async getStablecoinWalletTransactions(symbol: string): Promise<{ success: boolean; data: any }> {
    const response = await this.api.get(`/wallets/stablecoin/${symbol}/transactions`);
    return response.data;
  }

  async getWalletDetail(currency: string): Promise<{ success: boolean; data: any }> {
    const code = currency.toUpperCase();
    if (code === 'IUSD' || code === 'USDC' || code === 'USDT') {
      const symbol = code === 'IUSD' ? 'iUSD' : code;
      const response = await this.api.get(`/wallets/stablecoin/${symbol}`);
      return response.data;
    } else if (code === 'XAF' || code === 'XOF') {
      const response = await this.api.get(`/accounts/${code}`);
      return response.data;
    } else {
      const response = await this.api.get(`/wallets/fiat/${code}`);
      return response.data;
    }
  }

  async getWalletTransactions(currency: string, page: number = 1): Promise<{ success: boolean; data: any }> {
    const code = currency.toUpperCase();
    if (code === 'IUSD' || code === 'USDC' || code === 'USDT') {
      const symbol = code === 'IUSD' ? 'iUSD' : code;
      const response = await this.api.get(`/wallets/stablecoin/${symbol}/transactions`, { params: { page } });
      return response.data;
    } else if (code === 'XAF' || code === 'XOF') {
      const response = await this.api.get(`/accounts/${code}/transactions`, { params: { page } });
      return response.data;
    } else {
      const response = await this.api.get(`/wallets/fiat/${code}/transactions`, { params: { page } });
      return response.data;
    }
  }

  async getCryptoTransaction(id: string): Promise<{ success: boolean; data: any }> {
    const response = await this.api.get(`/crypto/transactions/${id}`);
    return response.data;
  }

  async getWaaSWallets(refresh = false): Promise<{ success: boolean; data: any; error?: any }> {
    const response = await this.api.get('/wallets/addresses', { params: { refresh } });
    return response.data;
  }

  async getWaaSWalletDetail(network: string): Promise<{ success: boolean; data: any; error?: any }> {
    const response = await this.api.get(`/wallets/crypto/${network}`);
    return response.data;
  }

  async provisionWaaSWallet(network: string): Promise<{ success: boolean; data: any; error?: any }> {
    const response = await this.api.post('/wallets', { network });
    return response.data;
  }

  async getWaaSWalletTransactions(network: string): Promise<{ success: boolean; data: any[]; error?: any }> {
    const response = await this.api.get(`/wallets/crypto/${network}/transactions`);
    return response.data;
  }
}

export const accountService = new AccountService();
