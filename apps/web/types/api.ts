import { Models } from "node-appwrite";


export interface AccountsResponse {
  data: Account[];
  totalBanks: number;
  totalCurrentBalance: number;
}


export interface SingleAccountResponse {
  data: Account;
  transactions: Transaction[];
}

// Transaction-related types
export interface TransactionsResponse {
  total: number;
  documents: Models.Document[]; // Replace 'any' with a specific transaction document type
}