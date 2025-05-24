"use client"

import { useCallback } from 'react';
import {
  PlaidLinkOnSuccess,
    PlaidLinkOptions,
    usePlaidLink,
  } from 'react-plaid-link';
import { Button } from '../../../../components/ui/button';
import { useRouter } from 'next/navigation';
import { usePlaid } from '@/hooks/usePlaid';
import { exchangePublicToken } from '@/actions/plaid.action';
import { Loader2 } from 'lucide-react';

export default function PlaidLink({ user }:{ user: User }) {
  const router = useRouter()
  const { token, isLoading, error } = usePlaid()

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token:string)=>{
    await exchangePublicToken({ publicToken:public_token, user })
    router.push('/dashboard')
  },[user])
  
  
  if(isLoading){
    return(
      <Button variant="default" disabled={true} onClick={()=>open()} className='w-full cursor-pointer' type='button'>
        Link your bank account<Loader2/>
      </Button>
    )
  
  }else if(error || !token){
    return <div>Error: {}</div>
  }
  const config: PlaidLinkOptions = {
    onSuccess,
    token,
  };

  const { open, ready } = usePlaidLink(config)
  return (
    <Button variant="default" disabled={!ready} onClick={()=>open()} className='w-full cursor-pointer' type='button'>
      Link your bank account
    </Button>
  )
}