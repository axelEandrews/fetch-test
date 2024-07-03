import {
  DeleteUserAttributesInput,
  deleteUserAttributes,
} from "aws-amplify/auth";
import React from "react";
import { Hub } from "aws-amplify/utils";
import { useDataState } from "../useDataState";
import { UserAttributes } from "../constants";

//

interface DeleteUserAttributesState {
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

type HandleDeleteUserAttributes = (input: DeleteUserAttributesInput) => void;

const deleteUserAttributesAction = async (
  _prev: Awaited<ReturnType<typeof deleteUserAttributes>>,
  input: DeleteUserAttributesInput
) => {
  try {
    const result = await deleteUserAttributes(input);
    Hub.dispatch("ui", {
      event: "attributesChanged",
      message: "attributes deleted successfully",
    });
    return result;
  } catch (error) {
    Hub.dispatch("ui", {
      event: "attributesUpdateFailure",
      message: error as string,
    });
  }
};

export const useDeleteUserAttributes = (): [
  state: DeleteUserAttributesState,
  handleDeleteUserAttributes: HandleDeleteUserAttributes
] => {
  const [state, setState] = useDataState(deleteUserAttributesAction, undefined);

  const handleDelete = React.useCallback(
    async (toDelete: DeleteUserAttributesInput) => {
      try {
        if (typeof setState === "function") {
          setState(toDelete);
        }
        Hub.dispatch("ui", {
          event: "attributesChanged",
          message: "attributes deleted successfully",
        });
      } catch (e) {
        const error = e as Error;
        console.log(error);
      }
    },
    []
  );
  return [state, handleDelete];
};
