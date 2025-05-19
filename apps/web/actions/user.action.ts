"use server"

import { createAdminClient, createSessionClient } from '@/lib/appwrite';
//import { SuccessfulRegistration } from '@/types/api';
import { LoginFormDataType, loginSchema, RegisterFormDataType, registerSchema } from '@/types/auth';
import { parseStringify } from '@/utils';
import { cookies } from 'next/headers';
import { ID } from 'node-appwrite';
import { ZodError} from 'zod'

 
 




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
    try {
        registerSchema.parse(registerFormData)
        const { firstName, lastName, email, password } = registerFormData;
        
        const { account } = await createAdminClient();
        const newAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
        
        const session = await account.createEmailPasswordSession(email, password);
        
        (await cookies()).set("session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });
        console.log("new account",parseStringify(newAccount));
        return parseStringify(newAccount)
    } catch (error:unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else if (error instanceof ZodError) {
            throw new Error(error.message);
        }
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


