"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../lib/appwrite";
import { ApiResponse, ErrorCodes, createErrorResponse, createSuccessResponse } from "../utils/error-handler";
import { TransactionsResponse } from "@/types/api";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_TRANSACTION_COLLECTION: TRANSACTION_COLLECTION_ID,
} = process.env;

export const createTransaction = async (
  transaction: CreateTransactionProps
): Promise<ApiResponse<any>> => {
  try {
    const { database } = await createAdminClient();

    const newTransaction = await database.createDocument(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      ID.unique(),
      {
        channel: 'online',
        category: 'Transfer',
        ...transaction
      }
    );

    return createSuccessResponse(newTransaction);
  } catch (error: any) {
    console.error("Transaction creation error:", error);
    
    // Determine the appropriate error code based on the error
    let errorCode = ErrorCodes.TRANSACTION_ERROR;
    let errorMessage = "Failed to create transaction";
    
    if (error.code === 404) {
      errorCode = ErrorCodes.DOCUMENT_NOT_FOUND;
      errorMessage = "Database or collection not found";
    } else if (error.code === 401 || error.code === 403) {
      errorCode = ErrorCodes.UNAUTHORIZED;
      errorMessage = "Not authorized to create transactions";
    }
    
    return createErrorResponse(
      errorCode,
      errorMessage,
      { originalError: error.message }
    );
  }
};

export const getTransactionsByBankId = async ({
  bankId
}: getTransactionsByBankIdProps): Promise<ApiResponse<TransactionsResponse>>=> {
  try {
    const { database } = await createAdminClient();
    const senderTransactions = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal('senderBankId', bankId)],
    );
    const receiverTransactions = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal('receiverBankId', bankId)],
    );

    const transactions = {
      total: senderTransactions.total + receiverTransactions.total,
      documents: [
        ...senderTransactions.documents, 
        ...receiverTransactions.documents,
      ]
    };

    return createSuccessResponse(transactions);
  } catch (error: any) {
    console.error("Error fetching transactions:", error);
    
    let errorCode = ErrorCodes.TRANSACTION_ERROR;
    let errorMessage = "Failed to fetch transactions";
    
    if (error.code === 404) {
      errorCode = ErrorCodes.DOCUMENT_NOT_FOUND;
      errorMessage = "Database or collection not found";
    } else if (error.code === 401 || error.code === 403) {
      errorCode = ErrorCodes.UNAUTHORIZED;
      errorMessage = "Not authorized to access transactions";
    }
    
    return createErrorResponse(
      errorCode,
      errorMessage,
      { originalError: error.message, bankId }
    );
  }
};