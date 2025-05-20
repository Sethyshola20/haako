"use server"

import { createAdminClient, createSessionClient } from '@/lib/appwrite';
//import { SuccessfulRegistration } from '@/types/api';
import { LoginFormDataType, loginSchema, RegisterFormDataType, registerSchema } from '@/types/auth';
import { extractCustomerIdFromUrl, parseStringify } from '@/utils';
import { cookies } from 'next/headers';
import { ID } from 'node-appwrite';
import { ZodError} from 'zod'
import { createDwollaCustomer } from './dwolla.actions';

 
 




// ... your initilization functions

export async function getLoggedInUserAction() {
    try {
      const { account } = await createSessionClient();
      return await account.get();
    } catch (error:unknown) {
    console.error(error);
      return null;
    }
  }
  
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
        process.env.DATABASE_ID!,
        process.env.USER_COLLECTION_ID!,
        ID.unique(),
        {
          ...registerFormData,
          userId: newUserAccount.$id,
          dwollaCustomerUrl,
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


