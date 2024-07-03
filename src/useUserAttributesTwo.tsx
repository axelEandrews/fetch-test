/*
 * This file has working versions of delete, update, confirm, and sendVerificationCode. Each state is declared independently to get around useDataState type predication.
 */

import {
  ConfirmUserAttributeInput,
  DeleteUserAttributesInput,
  SendUserAttributeVerificationCodeInput,
  SendUserAttributeVerificationCodeOutput,
  UpdateUserAttributesInput,
  UpdateUserAttributesOutput,
  confirmUserAttribute,
  deleteUserAttributes,
  sendUserAttributeVerificationCode,
  updateUserAttributes,
  //fetchUserAttributes,
  //FetchUserAttributesOutput
} from "@aws-amplify/auth";
import { Hub } from "@aws-amplify/core";
import { useCallback } from "react";
import { useDataState } from "./useDataState";
import {
  //     DefaultAttributes,
  //   UserAttributes,
  defaultSendUserAttributeVerificationCodeOutput,
  defaultUpdateUserAttributesOutput,
} from "./constants";
//import React from "react";

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

const updateUserAttributesAction = async (
  _prev: Awaited<ReturnType<typeof updateUserAttributes>>,
  input: UpdateUserAttributesInput
): Promise<UpdateUserAttributesOutput> => {
  try {
    const result = await updateUserAttributes(input);
    Hub.dispatch("ui", {
      event: "attributesChanged",
      message: "attributes updated successfully",
    });
    return result;
  } catch (error) {
    Hub.dispatch("ui", {
      event: "attributesUpdateFailure",
      message: error as string,
    });
    throw error; // Throw the error instead of returning undefined
  }
};
const confirmUserAttributeAction = async (
  _prev: Awaited<ReturnType<typeof confirmUserAttribute>>,
  input: ConfirmUserAttributeInput
): Promise<void> => {
  try {
    const result = await confirmUserAttribute(input);
    Hub.dispatch("ui", {
      event: "attributesChanged",
      message: "attributes confirmed successfully",
    });
    return result;
  } catch (error) {
    Hub.dispatch("ui", {
      event: "attributesUpdateFailure",
      message: error as string,
    });
  }
};

const sendUserAttributeVerificationCodeAction = async (
  _prev: Awaited<ReturnType<typeof sendUserAttributeVerificationCode>>,
  input: SendUserAttributeVerificationCodeInput
): Promise<SendUserAttributeVerificationCodeOutput> => {
  try {
    const result = await sendUserAttributeVerificationCode(input);
    Hub.dispatch("ui", {
      event: "attributesChanged",
      message: "attributes confirmed successfully",
    });
    return result;
  } catch (error) {
    Hub.dispatch("ui", {
      event: "attributesUpdateFailure",
      message: error as string,
    });
    throw error;
  }
};

// const fetchUserAttributesAction = async (
//     _prev: Awaited<ReturnType<typeof fetchUserAttributes>>,
//     input: null
// ): Promise<FetchUserAttributesOutput> => {
//     try {
//         const result = await fetchUserAttributes(input);
//         Hub.dispatch("ui", {
//             event: "attributesChanged",
//             message: "attributes confirmed successfully",
//         });
//         return result;
//     } catch (error) {
//         Hub.dispatch("ui", {
//             event: "attributesUpdateFailure",
//             message: error as string,
//         });
//         throw error;
//     }
// };

type ActionReturnTypes = {
  delete:
    | void
    | undefined
    | SendUserAttributeVerificationCodeOutput
    | UpdateUserAttributesOutput;
  confirm:
    | void
    | undefined
    | SendUserAttributeVerificationCodeOutput
    | UpdateUserAttributesOutput;
  update:
    | UpdateUserAttributesOutput
    | undefined
    | void
    | SendUserAttributeVerificationCodeOutput;
  sendVerificationCode:
    | SendUserAttributeVerificationCodeOutput
    | undefined
    | void;
};

// interface FetchUserAttributesState {
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
  sendVerificationCode: typeof sendUserAttributeVerificationCode;
  update: typeof updateUserAttributes;
}

export const INVALID_INPUT_TO_HANDLE_ACTION =
  "This instance of handleAction requires input of type: ";

const useUserAttributes = <T extends keyof Actions>(
  type: T
): [
  state: ActionState<ActionReturnTypes[T]>,
  handleAction: (...input: Parameters<Actions[T]>) => void
] => {
  const [deleteState, setDelete] = useDataState(
    deleteUserAttributesAction,
    undefined
  );
  const [updateState, setUpdate] = useDataState(
    updateUserAttributesAction,
    defaultUpdateUserAttributesOutput
  );
  const [confirmState, setConfirm] = useDataState(
    confirmUserAttributeAction,
    undefined
  );
  const [sendVerificationCodeState, setSendVerificationCode] = useDataState(
    sendUserAttributeVerificationCodeAction,
    defaultSendUserAttributeVerificationCodeOutput
  );

  //   const [fetchState, setFetch] = React.useState<FetchUserAttributesState>({
  //     data: DefaultAttributes,
  //     isLoading: true,
  //     message: undefined,
  //   });

  function isDeleteUserAttributesInput(
    input: Parameters<Actions[T]>[0]
  ): input is DeleteUserAttributesInput {
    console.log("input to Delete: " + input);
    console.log(input);
    return typeof input === "object" && input !== null;
  }
  function isUpdateUserAttributesInput(
    input: Parameters<Actions[T]>[0]
  ): input is UpdateUserAttributesInput {
    console.log("Input to Update: " + input);
    console.log(input);
    return (
      typeof input === "object" && input !== null && "userAttributes" in input
    );
  }

  function isConfirmUserAttributeInput(
    input: Parameters<Actions[T]>[0]
  ): input is ConfirmUserAttributeInput {
    console.log("Input to Confirm: " + input);
    console.log(input);
    return (
      typeof input === "object" &&
      input !== null &&
      "userAttributeKey" in input &&
      "confirmationCode" in input
    );
  }
  function isSendUserAttributeVerificationCodeInput(
    input: Parameters<Actions[T]>[0]
  ): input is SendUserAttributeVerificationCodeInput {
    console.log("Input to Send Verification Code: " + input);
    console.log(input);
    return (
      typeof input === "object" && input !== null && "userAttributeKey" in input
    );
  }

  const handleAction = useCallback(
    async (input: Parameters<Actions[T]>[0]) => {
      try {
        switch (type) {
          case "delete":
            if (!isDeleteUserAttributesInput(input)) {
              throw new Error(
                INVALID_INPUT_TO_HANDLE_ACTION + "DeleteUserAttributesInput"
              );
            }
            setDelete(input);
            console.log(deleteState);
            return deleteState;
          case "update":
            if (!isUpdateUserAttributesInput(input)) {
              throw new Error(
                INVALID_INPUT_TO_HANDLE_ACTION + "UpdateUserAttributesInput"
              );
            }
            setUpdate(input);
            console.log(updateState);
            return updateState;
          // Add similar type checks for other action types
          case "confirm":
            if (!isConfirmUserAttributeInput(input)) {
              throw new Error(
                INVALID_INPUT_TO_HANDLE_ACTION + "ConfirmUserAttributeInput"
              );
            }
            setConfirm(input);
            console.log(confirmState);
            return confirmState;
          case "sendVerificationCode":
            if (!isSendUserAttributeVerificationCodeInput(input)) {
              throw new Error(
                INVALID_INPUT_TO_HANDLE_ACTION +
                  "SendUserAttributeVerificationCodeInput"
              );
            }
            setSendVerificationCode(input);
            console.log(sendVerificationCodeState);
            return sendVerificationCodeState;
          default:
            throw new Error(`Unknown action type: ${type}`);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type]
  );

  //   const handleFetch = React.useCallback(async () => {
  //     setFetch((fetchState) => ({ ...fetchState, isLoading: true }));
  //     try {
  //       const userAttributes = await fetchUserAttributes();
  //       const completeAttributes: UserAttributes = {
  //         ...DefaultAttributes,
  //         ...userAttributes,
  //       };
  //       setFetch({
  //         data: completeAttributes,
  //         isLoading: false,
  //         message: undefined,
  //       });
  //     } catch (e) {
  //       const error = e as Error;
  //       setFetch({ ...fetchState, isLoading: true, message: error.message });
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []); // PLEASE FIX THIS SOMEHOW

  switch (type) {
    case "delete":
      return [deleteState, handleAction];
    case "update":
      return [updateState, handleAction];
    case "confirm":
      return [confirmState, handleAction];
    case "sendVerificationCode":
      return [sendVerificationCodeState, handleAction];
    // case "fetch":
    //   return [fetchState, handleFetch];
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

export { useUserAttributes };
