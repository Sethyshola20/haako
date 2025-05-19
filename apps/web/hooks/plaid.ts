import { useCallback } from 'react';
import {
  PlaidLinkError,
  PlaidLinkOnEvent,
  PlaidLinkOnEventMetadata,
  PlaidLinkOnExit,
    PlaidLinkOnExitMetadata,
    PlaidLinkOnSuccess,
    PlaidLinkOnSuccessMetadata,
    PlaidLinkOptions,
    PlaidLinkStableEvent,
    usePlaidLink,
  } from 'react-plaid-link';

  // The usePlaidLink hook manages Plaid Link creation
// It does not return a destroy function;
// instead, on unmount it automatically destroys the Link instance
const config: PlaidLinkOptions = {
  onSuccess: (public_token, metadata) => {},
  onExit: (err, metadata) => {},
  onEvent: (eventName, metadata) => {},
  token: 'GENERATED_LINK_TOKEN',
};

const { open, exit, ready } = usePlaidLink(config);

export default function usePlaid() {
    const onSuccess = useCallback<PlaidLinkOnSuccess>(
      (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
        console.log('public token', public_token);
        console.log('metadata', metadata);
      },
      [],
    );
    const onExit = useCallback<PlaidLinkOnExit>(
      (error: PlaidLinkError, metadata: PlaidLinkOnExitMetadata) => {
        // log and save error and metadata
        // handle invalid link token
        if (error != null && error.error_code === 'INVALID_LINK_TOKEN') {
          // generate new link token
        }
        // to handle other error codes, see https://plaid.com/docs/errors/
      },
      [],
    );
    const onEvent = useCallback<PlaidLinkOnEvent>(
      (
        eventName: PlaidLinkStableEvent | string,
        metadata: PlaidLinkOnEventMetadata,
      ) => {
        // log eventName and metadata
      },
      [],
    );
    
    
    return {
      onSuccess,
      onExit,
      onEvent,

    };
  }