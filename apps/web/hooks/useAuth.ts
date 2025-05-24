"use client";

import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import useQueryClient
import { toast } from "sonner"
import {  getLoggedInUserAction, loginUserAction, logoutUserAction, registerUserAction, updateUserAction } from '@/actions/user.action';
import { LoginFormDataType, RegisterFormDataType, UpdateUserFormDataType } from '@/types/auth';

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
            if (!register) {
                toast.error("Something went wrong")
            };
            return register;
        },
        onSuccess: () => { 
            queryClient.invalidateQueries({ queryKey: ['user'] }); // Invalidate the user query
        },
        onError: (error) => {
            console.log(error);
            toast.error("Something went wrong",{
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
            toast.error("Something went wrong",{
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
            toast.error("Something went wrong",{
                description: error.message,
            })
        }
    })

    const {mutate: updateUser} = useMutation({
        mutationFn: async (data: UpdateUserFormDataType) => {
            return await updateUserAction(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] }); // Invalidate the user query
        },
        onError: (error) => {
            console.log(error);
            toast.error("Something went wrong",{
                description: error.message,
            })
        }
    })


    return {
        register,
        login,
        logout,
        updateUser,
        user,
        isLoading,
        error,
        
    };
}