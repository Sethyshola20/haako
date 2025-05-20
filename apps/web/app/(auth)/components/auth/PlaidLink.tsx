"use client"

import { useCallback, useState } from 'react';
import {
  PlaidLinkOnSuccess,
    PlaidLinkOptions,
    usePlaidLink,
  } from 'react-plaid-link';
import { Button } from '../../../../components/ui/button';
import { Models } from 'node-appwrite';
import { useRouter } from 'next/navigation';
import { usePlaid } from '@/hooks/usePlaid';
import { exchangePublicToken } from '@/actions/plaid.action';

export default function PlaidLink({user}:{user: Models.User<Models.Preferences> | null | undefined}) {
  const router = useRouter()
  const { token, isLoading, error } = usePlaid()
    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token:string)=>{
      await exchangePublicToken({publicToken:public_token,user })
      router.push('/dashboard')
    },[user])
    
    const config: PlaidLinkOptions = {
        onSuccess,
        //onExit: (err, metadata) => {console.log(err, metadata)},
        //onEvent: (eventName, metadata) => {console.log(eventName, metadata)},
        token,
      };
//fetch token with reactquery
 const {open, ready} = usePlaidLink(config)
    


  return (
    <Button variant={"ghost"} disabled={!ready} onClick={()=>open()} className='w-full' type='button'>
      Link your bank account
    </Button>
  )
}