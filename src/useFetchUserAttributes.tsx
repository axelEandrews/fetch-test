
//import { HubCallback } from '@aws-amplify/core';
import { fetchUserAttributes, UserAttributeKey } from 'aws-amplify/auth';
//import { Hub } from 'aws-amplify/utils';
import * as React from 'react'

type UserAttributes = Record<UserAttributeKey, string | undefined>;

interface FetchUserAttributesState {
  /**
   * user attributes data
   */
  data: UserAttributes;
  /**
   * indicates hook network activity
   */
  isPending: boolean;
  /**
   * error message
   */
  message: string | undefined;
}

type HandleFetchUserAttributes = () => void;

const DefaultAttributes: UserAttributes = {
        'email': undefined,
        'phone_number': undefined,
        'address': undefined,
        'birthdate': undefined,
        'email_verified': undefined,
        'family_name': undefined,
        'gender': undefined,
        'given_name': undefined,
        'locale': undefined,
        'middle_name': undefined,
        'name': undefined,
        'nickname': undefined,
        'phone_number_verified': undefined,
        'picture': undefined,
        'preferred_username': undefined,
        'profile': undefined,
        'sub': undefined,
        'updated_at': undefined,
        'website': undefined,
        'zoneinfo': undefined,
}


const useFetchUserAttributes = (): [
    state: FetchUserAttributesState,
    handleFetchUserAttributes: HandleFetchUserAttributes
] => { 
    const [results, setResults] = React.useState<FetchUserAttributesState>({
        data: DefaultAttributes,
        isPending: true,
        message: undefined,
    });

    const handleFetch = React.useCallback(async () => {
        setResults((results) => ({...results, isPending: true}));
        try {
            const userAttributes = await fetchUserAttributes();
            const completeAttributes: UserAttributes = {...DefaultAttributes, ...userAttributes}  
            setResults({data: completeAttributes, isPending: false, message: undefined})
        } catch (e) {
            const error = e as Error;
            //setResults({...results, message: error.message, isPending: false})
            setResults({...results, isPending: true, message: error.message})
        }
    },[results])

//     const updateFetch: HubCallback = React.useCallback(({ payload }) => {
        
//         switch (payload.event) {
//             case 'signedIn':
//             case 'signUp':
//             case 'autoSignIn':
//             case 'tokenRefresh': {
//                 handleFetch();
//                 break;
//             }
//             case 'signedOut': 
//             case 'tokenRefresh_failure': 
//             case 'signIn_failure': 
//             case 'autoSignIn_failure':{
//                 setResults({data: DefaultAttributes, message: payload.message, isPending: false})
//                 break;
//             }
//             default: {
//                 break;
//             }
//         }
//     }, [handleFetch]
// );

    // React.useEffect(() => {
    //     const unsubscribe = Hub.listen('auth',updateFetch,'useFetchUserAttributes');
    //     handleFetch();
    //     return unsubscribe;
    // }, [updateFetch, handleFetch]);

    return [results, handleFetch]
    }



// Example Usage
export const FetchTester = () => {
    console.log("Starting FetchTester...")
    const [{ isPending, data, message }, handleFetch] = useFetchUserAttributes();
    console.log("Made it through useFetch!")
    // run on component mount
    //React.useEffect(handleFetch, []);
    React.useEffect(() => {
        handleFetch();
    },[])
    console.log("Made it through mounting");
    
    //return and render error message
    if (message) {
      return <p>{message}</p>
    }
    console.log("No error message?")
    const attributes = Object.keys(data).map((key, i) => (
              <p key={i}>
                <span>{key}: {data[key]}</span>
              </p>
    ))
        
    console.log(attributes)
    return isPending ? <p>Loading...</p> : attributes;

  };
