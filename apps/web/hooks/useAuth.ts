"use client";

import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from "sonner"
import {  getLoggedInUserAction, loginUserAction, logoutUserAction, registerUserAction } from '@/actions/user.action';
import { LoginFormDataType, RegisterFormDataType } from '@/types/auth';

export function useAuth() {
    const router = useRouter();

    const { data: user, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            return await getLoggedInUserAction();
        },
        retry: false,
        staleTime: 1000 * 60 * 5, 
    });

    const { mutate: register } = useMutation({
        mutationFn: async (registerFormData: RegisterFormDataType) => {
            return await registerUserAction(registerFormData);
        },
        onSuccess: () => {
            router.push('/dashboard');
        },
        onError: (error) => {
            console.log(error);
            toast("Something went wrong",{
                description: error.message,
            })
        }
    })

    const {mutate: login} = useMutation({
        mutationFn: async (loginFormData: LoginFormDataType) => {
            return await loginUserAction(loginFormData);
        },
        onSuccess: () => {
            router.push('/dashboard');
        },
        onError: (error) => {
            console.log(error);
            toast("Something went wrong",{
                description: error.message,
            })
        }
    })

    const {mutate: logout} = useMutation({
        mutationFn: async () => {
            return await logoutUserAction();
        },
        onSuccess: () => {
            router.push('/');
        },
        onError: (error) => {
            console.log(error);
            toast("Something went wrong",{
                description: error.message,
            })
        }
    })

   
    return {
        register,
        login,
        logout,
        user,
        isLoading,
    };
}