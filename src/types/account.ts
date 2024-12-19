export interface AccountBalance {
  id: number;
  cash: number;
  portfolio_value: number;
  created_at: string;
}

export interface AccountBalanceResponse {
  data: AccountBalance | null;
  error: Error | null;
} 