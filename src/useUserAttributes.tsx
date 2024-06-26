import { confirmUserAttribute, deleteUserAttributes, fetchUserAttributes, sendUserAttributeVerificationCode, updateUserAttributes } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useState, useCallback, useEffect } from 'react';
import { DefaultAttributes, UserAttributes } from "./constants";
import React from "react";
import { HubCallback } from '@aws-amplify/core';

interface ActionState<T> {
  /**
   * action data
   */
  data: T;
  /**
   * indicates whether action is running
   */
  isLoading: boolean;
  /**
   * error message
   */
  message: string | undefined;
}

const actions: Actions = {
  fetch: fetchUserAttributes,
  delete: deleteUserAttributes,
  update: updateUserAttributes,
  confirm: confirmUserAttribute,
  sendVerificationCode: sendUserAttributeVerificationCode,
}

interface Actions {
    confirm: typeof confirmUserAttribute;
    delete: typeof deleteUserAttributes;
    fetch: typeof fetchUserAttributes;
    sendVerificationCode: typeof sendUserAttributeVerificationCode;
    update: typeof updateUserAttributes;
}

const useUserAttributes = <T extends keyof Actions>(
  type: T
): [
  state: ActionState<Awaited<Actions[T]>>,
  handleAction: (input: Parameters<Actions[T]>) => void,
] => {
    const [state, setState] = useState<ActionState<T>>({
        data: {} as T,
        isLoading: false,
        message: undefined,
      });

  //const [allAttributes, setAllAttributes] = useState<UserAttributes>(DefaultAttributes);

  const handleAction = useCallback(

    async (input: Parameters<Actions[T]>[0]) => {
      try {
        setState((prevState) => ({ ...prevState, isLoading: true }));

        const data = await actions[type](input);

        switch(type) {
            case 'fetch': {
                const data = await actions['fetch']();
                const completeAttributes: UserAttributes = {...DefaultAttributes, ...data}
                setState({data: completeAttributes, isLoading: false, message: undefined})
                Hub.dispatch('ui', { event: 'fetch', data: completeAttributes });
                break;
            }
            case 'delete': {
                const data = await actions['delete'](input);
                setState({data: void, isLoading: false, message: undefined})
                Hub.dispatch('ui', {
                    event: 'attributesChanged',
                    message: "attributes deleted successfully"
                    })
                break;
            }
            case 'update': {
                const data = await actions['update'](input);
                setState({
                    data: data,
                    isLoading: false,
                    message: undefined,})
                Hub.dispatch('ui', {
                    event: 'attributesChanged',
                    data: data,
                    message: "attributes updated successfully"})
                 break;
            }
            case 'confirm': {
                setState({data: void, isLoading: false, message: undefined})
                Hub.dispatch('ui', {
                    event: 'attributeVerified',
                    message: "attribute successfully verified",
                    data: data
                    })
                break;
            }
            case 'sendVerificationCode': {
                setState({data: void, isLoading: false, message: undefined})
                Hub.dispatch('ui', {
                    event: 'confirmationCodeSent',
                    message: "send code to verify attribute"
                })
                break;
            }
        }

      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          message: (error as Error).message,
        }));
      }
    },
    [type]
  );

//   useEffect(() => {
//     if (type === 'fetch') {
//       handleAction(undefined);
//     }
//   }, [handleAction, type]);

//   useEffect(() => {
//     const unsubscribe = Hub.listen('ui', ({ event, data }) => {
//       if (event === 'fetch') {
//         setAllAttributes(data);
//       } else if (event === 'delete') {
//         setAllAttributes((prevAttributes) => {
//           const { [data]: _, ...rest } = prevAttributes;
//           return rest;
//         });
//       } else if (event === 'update') {
//         setAllAttributes((prevAttributes) => ({
//           ...prevAttributes,
//           ...data,
//         }));
//       }
//     });

//     return unsubscribe;
//   }, []);
  ///////////////
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
                handleAction();
                break
            }
            case 'signedOut':
            case 'tokenRefresh_failure':
            case 'signIn_failure': 
            case 'autoSignIn_failure': 
            {
                setState({data: DefaultAttributes, isLoading: false, message: "Signed Out"});
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
        handleAction(undefined);
        return unsubscribe
    }, [fetchHub, handleAction])

    React.useEffect(() => {
        const unsubscribe = Hub.listen('ui', fetchHub);
        handleAction(undefined);
        return unsubscribe
    }, [fetchHub, handleAction])



  switch (type) {
    case 'fetch':
      return [state, handleAction]
    case 'delete':
      return [state, handleAction]
    case 'update':
      return [state, handleAction]
    case 'confirm':
      return [state, handleAction]
    case 'sendVerificationCode':
      return [state, handleAction]
    default:
      throw new Error(`Invalid action type: ${type}`);
  }
};

export { useUserAttributes };
