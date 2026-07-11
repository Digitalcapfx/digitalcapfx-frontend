import { BaseService } from './base.service';

export interface AccountData {
  id: string;
  account_number: string;
  balance: string;
  available_balance: string;
  currency: string;
  status: string;
  created_at: string;
}

export interface AccountListResponse {
  success: boolean;
  data: AccountData[];
}

export interface CryptoBalanceData {
  balance_usdc: string;
  wallet_address: string;
}

export interface CryptoBalanceResponse {
  success: boolean;
  data: CryptoBalanceData;
}

export interface CaasWalletData {
  caas_wallet_id: string;
  abstraction_address: string;
  created_at: string;
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
}

export const accountService = new AccountService();
