"use client";

import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import useQueryClient
import { toast } from "sonner"
import {  getLoggedInUserAction, loginUserAction, logoutUserAction, registerUserAction } from '@/actions/user.action';
import { LoginFormDataType, RegisterFormDataType } from '@/types/auth';

export function useAuth() {
    const router = useRouter();
    const queryClient = useQueryClient(); // Get the query client instance

    const { data: user, isLoading,error } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            return await getLoggedInUserAction();
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    const { mutate: register } = useMutation({
        mutationFn: async (registerFormData: RegisterFormDataType) => {
            const register = await registerUserAction(registerFormData);
            console.log("register",register);
            if (!register) {
                toast("Something went wrong")
            };
            return register;
        },
        onSuccess: () => { 
            queryClient.invalidateQueries({ queryKey: ['user'] }); // Invalidate the user query
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
        error
    };
}