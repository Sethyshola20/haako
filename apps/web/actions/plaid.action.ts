"use server"

import { plaidClient } from "@/lib/plaid";
import { encryptId,  } from "@/utils";
import { revalidatePath } from "next/cache";
import { ID } from "node-appwrite";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { addFundingSource } from "./dwolla.actions";
import { createAdminClient } from "@/lib/appwrite";
import { ApiResponse, createErrorResponse, createSuccessResponse, ErrorCodes } from "@/utils/error-handler";


export async function createLinkToken (user:User){
    try {
        const tokenParams = {
            user: {
                client_user_id: user.$id,
            },
            client_name: user.firstName + ' ' + user.lastName,
            products: ['auth'] as Products[],
            country_codes: ['US','FR'] as CountryCode[],
            language: 'en'  ,
        }
       const response= await plaidClient.linkTokenCreate(tokenParams)
      return ({ linkToken: response.data.link_token })
    } catch (error:unknown) {
        console.log(error);
    }
}

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps): Promise<ApiResponse<any>> => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse =
      await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;
    
    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId:user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });
    console.log("fundingSourceUrl",fundingSourceUrl)
    console.log("user",user)
    console.log("accountData",accountData)
    console.log("itemId",itemId)
    console.log("processorToken",processorToken)
    console.log("accessToken",accessToken)
    // If the funding source URL is not created, throw a specific error
    if (!fundingSourceUrl) {
      throw new Error("Failed to create funding source URL");
    }

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and sharable ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/dashboard");

    // Return a success message
    return createSuccessResponse({
      publicTokenExchange: "complete",
    });
  } catch (error: any) {
    console.error("An error occurred while exchanging token:", error);
    
    let errorCode = ErrorCodes.PLAID_ERROR;
    let errorMessage = "Failed to exchange public token";
    
    // Determine specific error types
    if (error.message?.includes("funding source")) {
      errorCode = ErrorCodes.DWOLLA_ERROR;
      errorMessage = "Failed to create funding source";
    } else if (error.response?.data?.error_code) {
      // Handle specific Plaid API errors
      const plaidError = error.response.data;
      errorCode = `PLAID_${plaidError.error_code}`;
      errorMessage = plaidError.error_message || "Plaid API error";
    }
    
    return createErrorResponse(
      errorCode,
      errorMessage,
      { originalError: error.message }
    );
  }
};

export async function createBankAccount({
    userId,
    bankId,
    accountId,
    accessToken,
    fundingSourceUrl,
    sharableId,
  }: {
    userId: string;
    bankId: string;
    accountId: string;
    accessToken: string;
    fundingSourceUrl: string;
    sharableId: string;
  }
){
  try {
    const { database } = await createAdminClient();
    const bankAccount = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_BANK_ACCOUNTS_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        sharableId,
      }
    )
  return (bankAccount)
  } catch (error:unknown) {
    console.log(error)
  }
}