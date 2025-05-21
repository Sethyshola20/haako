import { Models } from "node-appwrite";

// Account-related types
export interface AccountData {
  id: string;
  availableBalance: number;
  currentBalance: number;
  institutionId: string;
  name: string;
  officialName?: string | null; // Changed to allow null values
  mask: string;
  type: string;
  subtype: string;
  appwriteItemId: string;
  sharaebleId?: string;
}

export interface AccountsResponse {
  data: AccountData[];
  totalBanks: number;
  totalCurrentBalance: number;
}

export interface TransactionData {
  id: string;
  name: string;
  amount: number;
  date: string;
  paymentChannel: string;
  category: string;
  type: string;
}

export interface SingleAccountResponse {
  data: AccountData;
  transactions: TransactionData[];
}

// Transaction-related types
export interface TransactionsResponse {
  total: number;
  documents: Models.Document[]; // Replace 'any' with a specific transaction document type
}