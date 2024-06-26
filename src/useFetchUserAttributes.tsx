import { HubCallback } from '@aws-amplify/core';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import * as React from 'react'
import { DefaultAttributes, UserAttributes } from './constants';


interface FetchUserAttributesState {
  /**
   * user attributes data
   */
  data: UserAttributes;
  /**
   * indicates hook network activity
   */
  isLoading: boolean;
  /**
   * error message
   */
  message: string | undefined;
}

type HandleFetchUserAttributes = () => void;


// eslint-disable-next-line react-refresh/only-export-components
export const useFetchUserAttributes = (): [
    state: FetchUserAttributesState,
    handleFetchUserAttributes: HandleFetchUserAttributes
] => { 
    const [results, setResults] = React.useState<FetchUserAttributesState>({
        data: DefaultAttributes,
        isLoading: true,
        message: undefined,
    });

    const handleFetch = React.useCallback(async () => {
        setResults((results) => ({...results, isLoading: true}));
        try {
            const userAttributes = await fetchUserAttributes();
            const completeAttributes: UserAttributes = {...DefaultAttributes, ...userAttributes}  
            setResults({data: completeAttributes, isLoading: false, message: undefined})
        } catch (e) {
            const error = e as Error;
            setResults({...results, isLoading: true, message: error.message})
        }

    },[]) // PLEASE FIX THIS SOMEHOW
    

    const fetchHub: HubCallback = React.useCallback(
    ({ payload }) => {
        switch (payload.event) {
            // success events
            case 'signedIn':
            case 'signUp':
            case 'autoSignIn': 
            case 'tokenRefresh':
            case 'attributesChanged':
            case 'attributeVerified': {
                handleFetch();
                break
            }
            case 'signedOut':
            case 'tokenRefresh_failure':
            case 'signIn_failure': 
            case 'autoSignIn_failure': 
            {
                setResults({data: DefaultAttributes, isLoading: false, message: "Signed Out"});
                break;
            }
            default: {
                break;
            }
        }
    
    }, [] // FIX THIS TOO
    )
    // Hub subscriptions
    React.useEffect(() => {
        const unsubscribe = Hub.listen('auth', fetchHub);
        handleFetch();
        return unsubscribe
    }, [fetchHub, handleFetch])

    React.useEffect(() => {
        const unsubscribe = Hub.listen('ui', fetchHub);
        handleFetch();
        return unsubscribe
    }, [fetchHub, handleFetch])



    return [results, handleFetch]
    }
