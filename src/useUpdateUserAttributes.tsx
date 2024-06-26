import { UpdateUserAttributesOutput, UpdateUserAttributesInput, updateUserAttributes } from "aws-amplify/auth";  
import React from "react";
import { Hub } from "aws-amplify/utils";

interface UpdateUserAttributesState {
    /**
     * user attributes data
     */
    data: UpdateUserAttributesOutput | undefined;
    /**
     * indicates hook network activity
     */
    isLoading: boolean;
    /**
     * error message
     */
    message: string | undefined;
  }

type HandleUpdateUserAttributes = (input: UpdateUserAttributesInput) => void;

export const useUpdateUserAttributes = (): [
    state: UpdateUserAttributesState,
    handleUpdateUserAttributes: HandleUpdateUserAttributes
] => {

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
    

    return [results, handleUpdate]
}
