"use server"

import { plaidClient } from "@/lib/plaid";
import { CountryCode, Products } from "plaid";

export async function createLinkToken (){
    try {
        const tokenParams = {
            user: {
                client_user_id: 'user-id',
            },
            client_name: 'Plaid Test App',
            products: ['auth'] as Products[],
            country_codes: ['US'] as CountryCode[],
            language: 'en'  ,
        }
        await plaidClient.linkTokenCreate(tokenParams)
    } catch (error:unknown) {
        console.log(error);
    }
}

export async function getPlaidToken() {
  const response = await fetch('/api/plaid/create_link_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data.link_token;
}

export async function getPlaidTransactions(public_token: string) {
  const response = await fetch('/api/plaid/exchange_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      public_token,
    }),
  });
  const data = await response.json();
  return data;  
}

export async function getPlaidAccounts(access_token: string) {
  const response = await fetch('/api/plaid/get_accounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token,
    }),
  });
  const data = await response.json();
  return data;
}