/*
 *  This version of useUserAttributes is functional, but there are several type errors relating to the handleActions. Also, the handleActions are hardcoded.
 */

import {
  confirmUserAttribute,
  ConfirmUserAttributeInput,
  deleteUserAttributes,
  DeleteUserAttributesInput,
  fetchUserAttributes,
  FetchUserAttributesOutput,
  sendUserAttributeVerificationCode,
  SendUserAttributeVerificationCodeInput,
  SendUserAttributeVerificationCodeOutput,
  updateUserAttributes,
  UpdateUserAttributesInput,
  UpdateUserAttributesOutput,
} from "@aws-amplify/auth";

import { Hub, HubCallback } from "@aws-amplify/core";

import { useDataState } from "./useDataState";
import {
  DefaultAttributes,
  defaultSendUserAttributeVerificationCodeOutput,
  defaultUpdateUserAttributesOutput,
} from "./constants";
import React from "react";

const INVALID_INPUT_TO_HANDLE_ACTION =
  "This instance of handleAction requires input of type: ";

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


interface HandlerInputs {
  confirm: ConfirmUserAttributeInput;
  delete: DeleteUserAttributesInput;
  fetch: undefined; // no input for fetch
  sendVerificationCode: SendUserAttributeVerificationCodeInput;
  update: UpdateUserAttributesInput;
}

interface StateDataTypes {
  confirm: undefined | void
  delete: undefined | void
  fetch: FetchUserAttributesOutput | undefined | void
  sendVerificationCode: SendUserAttributeVerificationCodeOutput | undefined | void
  update: UpdateUserAttributesOutput | undefined | void
}

// interface Actions {
//   confirm: typeof confirmUserAttributeAction;
//   delete: typeof deleteUserAttributesAction;
//   sendVerificationCode: typeof sendUserAttributeVerificationCodeAction;
//   update: typeof updateUserAttributesAction;
//   fetch: typeof fetchUserAttributesAction;
// }

interface Actions { 
  confirm: typeof confirmUserAttribute;
  delete: typeof deleteUserAttributes;
  sendVerificationCode: typeof sendUserAttributeVerificationCode;
  update: typeof updateUserAttributes;
  fetch: typeof fetchUserAttributes;
}

type AttributeManagementInputs =
  | ConfirmUserAttributeInput
  | DeleteUserAttributesInput
  | SendUserAttributeVerificationCodeInput
  | UpdateUserAttributesInput
  | null;

const deleteUserAttributesAction = async (
  _prev: Awaited<ReturnType<typeof deleteUserAttributes>>,
  input: DeleteUserAttributesInput
) => {
  if (!isDeleteUserAttributesInput(input)) {
    throw new Error(
      INVALID_INPUT_TO_HANDLE_ACTION + "DeleteUserAttributesInput"
    );
  } else {
    try {
      const result = await deleteUserAttributes(input);
      Hub.dispatch("ui", {
        event: "FETCH_ATTRIBUTES",
        message: "attributes deleted successfully",
      });
      return result;
    } catch (error) {
      Hub.dispatch("ui", {
        event: "attributesUpdateFailure",
        message: error as string,
      });
    }
  }
};

const updateUserAttributesAction = async (
  _prev: Awaited<ReturnType<typeof updateUserAttributes>>,
  input: UpdateUserAttributesInput
): Promise<UpdateUserAttributesOutput> => {
  if (!isUpdateUserAttributesInput(input)) {
    throw new Error(
      INVALID_INPUT_TO_HANDLE_ACTION + "UpdateUserAttributesInput"
    );
  } else {
    try {
      const result = await updateUserAttributes(input);
      Hub.dispatch("ui", {
        event: "FETCH_ATTRIBUTES",
        message: "attributes updated successfully",
      });
      return result;
    } catch (error) {
      Hub.dispatch("ui", {
        event: "attributesUpdateFailure",
        message: error as string,
      });
      throw error;
    }
  }
};
const confirmUserAttributeAction = async (
  _prev: Awaited<ReturnType<typeof confirmUserAttribute>>,
  input: ConfirmUserAttributeInput
): Promise<void> => {
  if (!isConfirmUserAttributeInput(input)) {
    throw new Error(
      INVALID_INPUT_TO_HANDLE_ACTION + "ConfirmUserAttributeInput"
    );
  } else {
    try {
      const result = await confirmUserAttribute(input);
      Hub.dispatch("ui", {
        event: "FETCH_ATTRIBUTES",
        message: "attributes confirmed successfully",
      });
      return result;
    } catch (error) {
      Hub.dispatch("ui", {
        event: "attributesUpdateFailure",
        message: error as string,
      });
    }
  }
};

const sendUserAttributeVerificationCodeAction = async (
  _prev: Awaited<ReturnType<typeof sendUserAttributeVerificationCode>>,
  input: SendUserAttributeVerificationCodeInput
): Promise<SendUserAttributeVerificationCodeOutput> => {
  if (!isSendUserAttributeVerificationCodeInput(input)) {
    throw new Error(
      INVALID_INPUT_TO_HANDLE_ACTION + "SendUserAttributeVerificationCodeInput"
    );
  } else {
    try {
      const result = await sendUserAttributeVerificationCode(input);
      Hub.dispatch("ui", {
        event: "FETCH_ATTRIBUTES",
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
  }
};

const fetchUserAttributesAction = async (
  _prev: Awaited<ReturnType<typeof fetchUserAttributes>>,
  input: null
): Promise<FetchUserAttributesOutput> => {
  // if (!isFetchUserAttributesInput(input)) {
  //     throw new Error(
  //         INVALID_INPUT_TO_HANDLE_ACTION + "FetchUserAttributesInput"
  //     );
  // } else {
  console.log(input); // to avoid unused vars
  try {
    const result = await fetchUserAttributes();
    return result;
  } catch (error) {
    Hub.dispatch("ui", {
      event: "attributesUpdateFailure",
      message: error as string,
    });
    throw error;
    // }
  }
};

function isDeleteUserAttributesInput(
  input: AttributeManagementInputs
): input is DeleteUserAttributesInput {
  return typeof input === "object" && input !== null;
}
function isUpdateUserAttributesInput(
  input: AttributeManagementInputs
): input is UpdateUserAttributesInput {
  return (
    typeof input === "object" && input !== null && "userAttributes" in input
  );
}

function isConfirmUserAttributeInput(
  input: AttributeManagementInputs
): input is ConfirmUserAttributeInput {
  return (
    typeof input === "object" &&
    input !== null &&
    "userAttributeKey" in input &&
    "confirmationCode" in input
  );
}
function isSendUserAttributeVerificationCodeInput(
  input: AttributeManagementInputs
): input is SendUserAttributeVerificationCodeInput {
  return (
    typeof input === "object" && input !== null && "userAttributeKey" in input
  );
}






const useUserAttributes = <T extends keyof Actions>(
  action: T
): [
  state: ActionState<StateDataTypes[T]>,
  handleAction: (...input: HandlerInputs[T][]) => void
] => {
  const [deleteState, handleDelete] = useDataState(
    deleteUserAttributesAction,
    undefined
  );
  const [updateState, handleUpdate] = useDataState(
    updateUserAttributesAction,
    defaultUpdateUserAttributesOutput
  );
  const [confirmState, handleConfirm] = useDataState(
    confirmUserAttributeAction,
    undefined
  );
  const [sendVerificationCodeState, handleSendVerificationCode] = useDataState(
    sendUserAttributeVerificationCodeAction,
    defaultSendUserAttributeVerificationCodeOutput
  );
  const [fetchState, handleFetch] = useDataState(
    fetchUserAttributesAction,
    DefaultAttributes
  );

  const fetchHub: HubCallback = React.useCallback(
    ({ payload }) => {
      switch (payload.event) {
        // success events
        case "FETCH_ATTRIBUTES": {
          handleFetch();
          break;
        }
        default: {
          break;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // FIX THIS TOO
  );
  // Hub subscriptions
  // Declare both subscriptions in same useEffect
  // signOut 'auth', FETCH_ATTRIBUTES 'ui'

  // I DON"T KNOW IF WE REALLY NEED TO LISTEN TO AUTH ON TOP OF UI, COULD JUST FOCUS ON OUR EVENTS
  // React.useEffect(() => {
  //   const unsubscribeAuth = Hub.listen("auth", fetchHub);
  //   handleFetch();
  //   return unsubscribeAuth;
  // }, [fetchHub, handleFetch]);

  React.useEffect(() => {
    const unsubscribe = Hub.listen("ui", fetchHub);
    handleFetch();
    return unsubscribe;
  }, [fetchHub, handleFetch]);

  switch (action) {
    case "delete":
      return [deleteState, handleDelete];
    case "confirm":
      return [confirmState, handleConfirm];
    case "sendVerificationCode":
      return [sendVerificationCodeState, handleSendVerificationCode];
    case "update":
      return [updateState, handleUpdate];
    case "fetch":
      return [fetchState, handleFetch];
    default:
      throw new Error(`Invalid action: ${action}`);
  }
};

export { useUserAttributes, deleteUserAttributesAction };
