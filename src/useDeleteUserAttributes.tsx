import { DeleteUserAttributesInput, deleteUserAttributes } from "aws-amplify/auth";
import React from "react";
import { Hub } from "aws-amplify/utils";

// 

// interface DeleteUserAttributesState {
//     /**
//      * user attributes data
//      */
//     data: UserAttributes;
//     /**
//      * indicates hook network activity
//      */
//     isLoading: boolean;
//     /**
//      * error message
//      */
//     message: string | undefined;
//   }
  

type HandleDeleteUserAttributes = (input: DeleteUserAttributesInput) => void;

export const useDeleteUserAttributes = (): [
    handleDeleteUserAttributes: HandleDeleteUserAttributes
] => { 

const handleDelete  = React.useCallback(async (toDelete: DeleteUserAttributesInput) => {
    try {
        await deleteUserAttributes(toDelete)
        Hub.dispatch('ui', {
        event: 'attributesChanged',
        message: "attributes deleted successfully"
        })
    } catch (e) {
        const error = e as Error;
        console.log(error)
    }
},[])

return [handleDelete]
}
