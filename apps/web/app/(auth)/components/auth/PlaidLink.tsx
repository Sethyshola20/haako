"use client"

import { useCallback } from 'react';
import {
    PlaidLinkOptions,
    usePlaidLink,
  } from 'react-plaid-link';
import { Button } from '../../../../components/ui/button';

export default function PlaidLink() {
    const config: PlaidLinkOptions = {
        onSuccess: (public_token, metadata) => {console.log(public_token, metadata)},
        onExit: (err, metadata) => {console.log(err, metadata)},
        onEvent: (eventName, metadata) => {console.log(eventName, metadata)},
        token: 'GENERATED_LINK_TOKEN',
      };

    const { open, ready } = usePlaidLink(config);
    const handlePlaidLink = useCallback(() => {
    if (ready) {
        open();
    }
    }, [open, ready]);


  return (
    <Button variant={"ghost"} onClick={handlePlaidLink} className='w-full' type='button'>
      Link your bank account
    </Button>
  )
}