"use client";

import { useQuery, useMutation } from '@tanstack/react-query';

import { createLinkToken } from '@/actions/plaid.action';
import { useAuth } from './useAuth';


export function usePlaid() {
    const { user } = useAuth();
    // Keep the mutation for calling the server action
    const { mutateAsync: fetchLinkToken } = useMutation({
        mutationFn: async (user:User) => {
            // createLinkToken returns a stringified object { linkToken: '...' }
            return await createLinkToken(user);
        },
        onSuccess: () => {

        },
        onError: (error:any) => {
            console.log(error);
        }
    });

    // Use useQuery to manage the state of the fetched token
    const { data, isLoading, error } = useQuery({
        queryKey: ['plaidLinkToken', user?.$id], // Unique key for the query
        queryFn: async () => {
            // Call the mutation function to fetch the token
            const stringifiedData = await fetchLinkToken(user!);
            const parsedData = JSON.parse(stringifiedData);
            return parsedData.linkToken as string;
        },
        enabled: !!user?.$id, // Only run the query if user and user.$id exist
        staleTime: Infinity, // Token usually doesn't change for a session
        refetchOnWindowFocus: false, // No need to refetch on focus
    });

    const token = data;

    return {
        token, 
        isLoading,
        error,
    };
}