"use server"

import { createAdminClient, createSessionClient } from '@/lib/appwrite';
import { LoginFormDataType, loginSchema, RegisterFormDataType, UpdateUserFormDataType } from '@/types/auth';
import { extractCustomerIdFromUrl,  } from '@/utils';
import { cookies } from 'next/headers';
import {  ID, Query } from 'node-appwrite';
import { ZodError} from 'zod'
import { createDwollaCustomer } from './dwolla.actions';

export async function getLoggedInUserAction() {
    try {
        const { account } = await createSessionClient();
        const result = await account.get();
        const user = await getUserInfo({ userId: result.$id });
        return user;
      } catch (error) {
        return null;
      }
  }

export async function getUserInfo({ userId }: getUserInfoProps):Promise<User | null>  {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env. APPWRITE_USER_COLLECTION!,
      [Query.equal("userId", [userId])]
    );

    if (user.total !== 1) return null;

    return (user.documents[0]) as unknown as User;
  } catch (error) {
    console.error("Error", error);
    return null;
  }
};

export async function updateUserAction(data: UpdateUserFormDataType){
    try {
        const { database } = await createAdminClient();
        const { account } = await createSessionClient();
        const result = await account.get();
        if(!result.$id) return null;
        const user = await database.updateDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.APPWRITE_USER_COLLECTION!,
            result.$id,
            {
                firstName: data.firstName,
                lastName: data.lastName,
                address1: data.address1,
                city: data.city,
                state: data.state,
                postalCode: data.postalCode,
                dateOfBirth: data.dateOfBirth,
                ssn: data.ssn,
            }
        )
        return user;
    }catch (error) {
        console.error("Error", error);
        return null;
    }
}
  
  
export async function registerUserAction(registerFormData: RegisterFormDataType):Promise<User | null>{
    let newUserAccount;
  
    try {
      const { database, account } = await createAdminClient();
      newUserAccount = await account.create(
        ID.unique(),
        registerFormData.email,
        registerFormData.password,
        `${registerFormData.firstName} ${registerFormData.lastName}`
      );
  
      if (!newUserAccount) throw new Error("Error creating user");
  
      const dwollaCustomerURL = await createDwollaCustomer({
        ...registerFormData,
        type: "personal",
      });
  
      if (!dwollaCustomerURL) throw new Error("Error creating dwolla customer");
      const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerURL);
  
      const newUser = await database.createDocument(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_USER_COLLECTION!,
        ID.unique(),
        {
          firstName: registerFormData.firstName,
          lastName: registerFormData.lastName,
          email: registerFormData.email,
          address1: registerFormData.address1,
          city: registerFormData.city,
          state: registerFormData.state,
          postalCode: registerFormData.postalCode,
          dateOfBirth: registerFormData.dateOfBirth,
          ssn: registerFormData.ssn,
          userId: newUserAccount.$id,
          dwollaCustomerURL,
          dwollaCustomerId,
        }
      );
  
      const session = await account.createEmailPasswordSession(
        registerFormData.email,
        registerFormData.password
      );
  
      (await cookies()).set("session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });
  
      return newUser as unknown as User; 
    } catch (error) {
      console.error("Error", error);
      if (newUserAccount?.$id) {
        const { user } = await createAdminClient();
        await user.delete(newUserAccount?.$id);
      }
      return null;
    }
}

export async function loginUserAction(loginFormData: LoginFormDataType){
    try {
        loginSchema.parse(loginFormData)
        const { email, password } = loginFormData;

        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(email, password);
        (await cookies()).set("session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });
        const user = await getUserInfo({ userId: session.userId }) 
        return (user);
    } catch (error:unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else if (error instanceof ZodError) {
            throw new Error(error.message);
        }
    }

}

export async function logoutUserAction(){
    try {
        const { account } = await createSessionClient();
        await account.deleteSession("current");
        (await cookies()).delete("session");
    } catch (error:unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
    }
}
export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_BANK_COLLECTION!,
      [Query.equal('userId', [userId])]
    )

    return (banks.documents);
  } catch (error) {
    console.log(error)
  }
}

export async function getBank({ documentId }: getBankProps) {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_BANK_COLLECTION!,
      [Query.equal('$id', [documentId])]
    )

    return (bank.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

export async function getBankByAccountId({ accountId }: getBankByAccountIdProps) {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_BANK_COLLECTION!,
      [Query.equal('accountId', [accountId])]
    )

    if(bank.total !== 1) return null;

    return (bank.documents[0]);
  } catch (error) {
    console.log(error)
  }
}