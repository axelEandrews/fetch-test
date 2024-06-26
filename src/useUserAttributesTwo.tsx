import { ConfirmUserAttributeInput, SendUserAttributeVerificationCodeInput, UpdateUserAttributesInput, confirmUserAttribute, deleteUserAttributes, fetchUserAttributes, sendUserAttributeVerificationCode, updateUserAttributes } from "aws-amplify/auth";
import { useCallback, useState } from "react";
import { useVerifyUserAttribute } from "./useVerifyUserAttribute";
import React from "react";
import { Hub } from "aws-amplify/utils";


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
    state: ActionState<Awaited<ReturnType<Actions[T]>>>,
    handleAction: (...input: Parameters<Actions[T]>) => Promise<void>,
  ] => {
    const handleVerify  = React.useCallback(async (toVerify: ConfirmUserAttributeInput) => {
        try {
            await confirmUserAttribute(toVerify)
            Hub.dispatch('ui', {
            event: 'attributeVerified',
            message: "attribute successfully verified"
            })
        } catch (e) {
            const error = e as Error;
            console.log(error)
        }
    },[]);
    
    const handleSendConfirmation  = React.useCallback(async (toVerify: SendUserAttributeVerificationCodeInput) => {
        try {
            await sendUserAttributeVerificationCode(toVerify)
            Hub.dispatch('ui', {
            event: 'confirmationCodeSent',
            message: "send code to verify attribute"
            })
        } catch (e) {
            const error = e as Error;
            console.log(error)
        }
    },[])

    const [results, setResults] = React.useState<UpdateUserAttributesState>({
        data: undefined,
        isLoading: true,
        message: undefined,
    });

    const handleUpdate = React.useCallback(async (toUpdate: UpdateUserAttributesInput) => {
        try {
            const output = await updateUserAttributes(toUpdate)
            setResults({
                data: output,
                isLoading: false,
                message: undefined,
            })
        
            Hub.dispatch('ui', {
                event: 'attributesChanged',
                data: results,
                message: "attributes updated successfully"
            })
        } catch (error) {
            console.log("error updating user attributes", error)
        }

    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


    switch(type) {
        case 'confirm':
            return [state,handleVerify]
        case 'delete':
            return [deleteState,handleDelete]
        case 'fetch':
            return [fetchState,handleFetch]
        case 'sendVerificationCode':
            return [state,handleSendConfirmation]
        case 'update':
            return [updateState,handleUpdate]
        default:
            throw new Error(`Invalid action type: ${type}`);
    }



  }