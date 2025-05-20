"use server"

import { createAdminClient, createSessionClient } from '@/lib/appwrite';
//import { SuccessfulRegistration } from '@/types/api';
import { LoginFormDataType, loginSchema, RegisterFormDataType, registerSchema } from '@/types/auth';
import { extractCustomerIdFromUrl, parseStringify } from '@/utils';
import { cookies } from 'next/headers';
import { AppwriteException, ID, Query } from 'node-appwrite';
import { ZodError} from 'zod'
import { createDwollaCustomer } from './dwolla.actions';

export async function getLoggedInUserAction() {
    try {
        const { account } = await createSessionClient();
        const result = await account.get();
        console.log("result",result);
        const user = await getUserInfo({ userId: result.$id });
        console.log("user info",user);
        return parseStringify(user);
      } catch (error) {
        
        return null;
      }
  }

  export async function getUserInfo({ userId }: getUserInfoProps)  {
    try {
      const { database } = await createAdminClient();
  
      const user = await database.listDocuments(
        process.env.APPWRITE_DATABASE_ID!,
        process.env. APPWRITE_USER_COLLECTION!,
        [Query.equal("userId", [userId])]
      );
  
      if (user.total !== 1) return null;
  
      return parseStringify(user.documents[0]);
    } catch (error) {
      console.error("Error", error);
      return null;
    }
  };
  
  
export async function registerUserAction(registerFormData: RegisterFormDataType){
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
  
      const dwollaCustomerUrl = await createDwollaCustomer({
        ...registerFormData,
        type: "personal",
      });
  
      if (!dwollaCustomerUrl) throw new Error("Error creating dwolla customer");
      const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
  
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
          dwollaCustomerURL: dwollaCustomerUrl,
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
  
      return parseStringify(newUser);
    } catch (error) {
      console.error("Error", error);
  
      // check if account has been created, if so, delete it
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
        return parseStringify(session);
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
        console.log("account",account);
        await account.deleteSession("current");
        (await cookies()).delete("session");
    } catch (error:unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
    }
}
export async function updateUserAction(){}
export async function deleteUserAction(){}


