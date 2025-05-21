"use server";

import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,
} from "plaid";

import { plaidClient } from "../lib/plaid";
import { ApiResponse, ErrorCodes, createErrorResponse, createSuccessResponse } from "../utils/error-handler";

import { getTransactionsByBankId } from "./transaction.action";
import { getBanks, getBank } from "./user.action";
import { AccountsResponse, SingleAccountResponse } from "@/types/api";
import { Models } from "node-appwrite";

// Get multiple bank accounts
export async function getAccounts({ userId }: getAccountsProps): Promise<ApiResponse<AccountsResponse>> {
  try {
    // get banks from db
    const banks = await getBanks({ userId }) as unknown as Bank[];
    
    if (!banks || banks.length === 0) {
      return createSuccessResponse({ 
        data: [], 
        totalBanks: 0, 
        totalCurrentBalance: 0 
      });
    }

    const accounts = await Promise.all(
      banks?.map(async (bank: Bank) => {
        // get each account info from plaid
        const accountsResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });
        const accountData = accountsResponse.data.accounts[0];

        // get institution info from plaid
        const institution = await getInstitution({
          institutionId: accountsResponse.data.item.institution_id!,
        });

        if(!institution) {
          throw new Error("Institution not found");
        }

        const account = {
          id: accountData.account_id,
          availableBalance: accountData.balances.available!,
          currentBalance: accountData.balances.current!,
          institutionId: institution.institution_id,
          name: accountData.name,
          officialName: accountData.official_name || undefined, // Convert null to undefined
          mask: accountData.mask!,
          type: accountData.type as string,
          subtype: accountData.subtype! as string,
          appwriteItemId: bank.$id,
          sharaebleId: bank.shareableId,
        };

        return account;
      })
    );

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    return createSuccessResponse({ 
      data: accounts, 
      totalBanks, 
      totalCurrentBalance 
    });
  } catch (error: any) {
    console.error("An error occurred while getting the accounts:", error);
    
    let errorCode = ErrorCodes.UNKNOWN_ERROR;
    let errorMessage = "Failed to retrieve accounts";
    
    if (error.message?.includes("Institution not found")) {
      errorCode = ErrorCodes.PLAID_ERROR;
      errorMessage = "Institution information could not be retrieved";
    } else if (error.response?.data?.error_code) {
      // Handle specific Plaid API errors
      errorCode = `PLAID_${error.response.data.error_code}`;
      errorMessage = error.response.data.error_message || "Plaid API error";
    }
    
    return createErrorResponse(
      errorCode,
      errorMessage,
      { originalError: error.message, userId }
    );
  }
}

// Get one bank account
export async function getAccount({ appwriteItemId }: getAccountProps): Promise<ApiResponse<SingleAccountResponse>> {
  try {
    // get bank from db
    const bank = await getBank({ documentId: appwriteItemId }) as unknown as Bank;

    if(!bank) {
      return createErrorResponse(
        ErrorCodes.DOCUMENT_NOT_FOUND,
        "Bank account not found",
        { appwriteItemId }
      );
    }

    // get account info from plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];

    // get transfer transactions from appwrite
    const transferTransactionsData = await getTransactionsByBankId({
      bankId: bank.$id,
    });

    if(!transferTransactionsData) {
      return createErrorResponse(
        ErrorCodes.DOCUMENT_NOT_FOUND,
        "Transfer transactions not found",
        { bankId: bank.$id }
      );
    }

    // Check if the response is successful before accessing data
    if(!transferTransactionsData.success) {
      return createErrorResponse(
        ErrorCodes.TRANSACTION_ERROR,
        "Failed to retrieve transfer transactions",
        { originalError: transferTransactionsData.error }
      );
    }

    const transferTransactions = transferTransactionsData.data.documents.map(
      (transferData: Models.Document) => ({
        id: transferData.$id,
        name: transferData.name!,
        amount: transferData.amount!,
        date: transferData.$createdAt,
        paymentChannel: transferData.channel,
        category: transferData.category,
        type: transferData.senderBankId === bank.$id ? "debit" : "credit",
      })
    );

    // get institution info from plaid
    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });
    
    if (!institution) {
      return createErrorResponse(
        ErrorCodes.PLAID_ERROR,
        "Institution information could not be retrieved",
        { institutionId: accountsResponse.data.item.institution_id }
      );
    }

    const transactions = await getTransactions({
      accessToken: bank?.accessToken,
    });
    
    if (!transactions) {
      return createErrorResponse(
        ErrorCodes.PLAID_ERROR,
        "Failed to retrieve transactions",
        { bankId: bank.$id }
      );
    }

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name || undefined, // Convert null to undefined
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
    };

    // sort transactions by date such that the most recent transaction is first
    const allTransactions = [...transactions, ...transferTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return createSuccessResponse({
      data: account,
      transactions: allTransactions,
    });
  } catch (error: any) {
    console.error("An error occurred while getting the account:", error);
    
    let errorCode = ErrorCodes.UNKNOWN_ERROR;
    let errorMessage = "Failed to retrieve account details";
    
    if (error.message?.includes("Bank not found")) {
      errorCode = ErrorCodes.DOCUMENT_NOT_FOUND;
      errorMessage = "Bank account not found";
    } else if (error.response?.data?.error_code) {
      // Handle specific Plaid API errors
      errorCode = `PLAID_${error.response.data.error_code}`;
      errorMessage = error.response.data.error_message || "Plaid API error";
    }
    
    return createErrorResponse(
      errorCode,
      errorMessage,
      { originalError: error.message, appwriteItemId }
    );
  }
}

// Get bank info
export async function getInstitution({ institutionId }: getInstitutionProps): Promise<any> {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as CountryCode[],
    });

    const institution = institutionResponse.data.institution;

    return institution;
  } catch (error: any) {
    console.error("An error occurred while getting the institution:", error);
    return null;
  }
}

// Get transactions
export async function getTransactions({ accessToken }: getTransactionsProps): Promise<any> {
  let hasMore = true;
  let transactions: any = [];

  try {
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;

      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      hasMore = data.has_more;
    }

    return transactions;
  } catch (error: any) {
    console.error("An error occurred while getting the transactions:", error);
    return null;
  }
}