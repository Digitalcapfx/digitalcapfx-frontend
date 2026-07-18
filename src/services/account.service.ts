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

export interface CryptoBalanceData {
  symbol: string;
  name: string;
  balance: number;
  balanceUsdc: string;
  balanceFormatted: string;
  walletAddress: string;
}

export interface CryptoBalanceResponse {
  success: boolean;
  data: CryptoBalanceData;
}

export interface CaasWalletData {
  caasWalletId: string;
  abstractionAddress: string;
  createdAt: string;
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

  async getStablecoinWalletTransactions(symbol: string): Promise<{ success: boolean; data: any[] }> {
    const response = await this.api.get(`/wallets/stablecoin/${symbol}/transactions`);
    return response.data;
  }
}

export const accountService = new AccountService();
