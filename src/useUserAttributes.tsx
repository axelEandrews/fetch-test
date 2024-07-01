import {
  ConfirmUserAttributeInput,
  DeleteUserAttributesInput,
  SendUserAttributeVerificationCodeInput,
  UpdateUserAttributesInput,
  confirmUserAttribute,
  deleteUserAttributes,
  sendUserAttributeVerificationCode,
  updateUserAttributes,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useState, useCallback } from "react";
import { useDataState } from "./useDataState";

const deleteUserAttributesAction = async (
  _prev: Awaited<ReturnType<typeof deleteUserAttributes>>,
  input: DeleteUserAttributesInput
) => {
  const result = await deleteUserAttributes(input);

  return result;
};

const updateUserAttributesAction = async (
  _prev: Awaited<ReturnType<typeof updateUserAttributes>>,
  input: UpdateUserAttributesInput
) => {
  const result = await updateUserAttributes(input);

  return result;
};

const confirmUserAttributeAction = async (
  _prev: Awaited<ReturnType<typeof confirmUserAttribute>>,
  input: ConfirmUserAttributeInput
) => {
  const result = await confirmUserAttribute(input);

  return result;
};

const sendUserAttributeVerificationCodeAction = async (
  _prev: Awaited<ReturnType<typeof sendUserAttributeVerificationCode>>,
  input: SendUserAttributeVerificationCodeInput
) => {
  const result = await sendUserAttributeVerificationCode(input);

  return result;
};

//const useSomeHook = () => useDataState(deleteUserAttributesAction, undefined)

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
  delete: deleteUserAttributes,
  update: updateUserAttributes,
  confirm: confirmUserAttribute,
  sendVerificationCode: sendUserAttributeVerificationCode,
};

const handleActions: HandleActions = {
  delete: deleteUserAttributesAction,
  update: updateUserAttributesAction,
  confirm: confirmUserAttributeAction,
  sendVerificationCode: sendUserAttributeVerificationCodeAction,
};

interface HandleActions {
  confirm: typeof confirmUserAttributeAction;
  delete: typeof deleteUserAttributesAction;
  sendVerificationCode: typeof sendUserAttributeVerificationCodeAction;
  update: typeof updateUserAttributesAction;
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
  state: ActionState<Awaited<Actions[T]>>,
  handleAction: (input: Parameters<Actions[T]>[0]) => void
] => {
  // const [state, setState] = useDataState<Awaited<ReturnType<Actions[T]>>,Parameters<HandleActions[T]>[1]>(handleActions[type], {
  //   data: {} as Awaited<ReturnType<Actions[T]>>,
  //   isLoading: false,
  //   message: undefined,
  // });

  const [state, setState] = useState<ActionState<Awaited<Actions[T]>>>({
    data: {} as Awaited<ReturnType<Actions[T]>>,
    isLoading: false,
    message: undefined,
  });

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
        setState((prevState) => ({ ...prevState, isLoading: true }));

        const data = await (() => {
          switch (type) {
            case "delete":
              if (!isDeleteUserAttributesInput(input)) {
                throw new Error(
                  INVALID_INPUT_TO_HANDLE_ACTION + "DeleteUserAttributesInput"
                );
              }
              return actions.delete(input);
            case "update":
              if (!isUpdateUserAttributesInput(input)) {
                throw new Error(
                  INVALID_INPUT_TO_HANDLE_ACTION + "UpdateUserAttributesInput"
                );
              }
              return actions.update(input);
            // Add similar type checks for other action types
            case "confirm":
              if (!isConfirmUserAttributeInput(input)) {
                throw new Error(
                  INVALID_INPUT_TO_HANDLE_ACTION + "ConfirmUserAttributeInput"
                );
              }
              return actions.confirm(input);
            case "sendVerificationCode":
              if (!isSendUserAttributeVerificationCodeInput(input)) {
                throw new Error(
                  INVALID_INPUT_TO_HANDLE_ACTION +
                    "SendUserAttributeVerificationCodeInput"
                );
              }
              return actions.sendVerificationCode(input);
            default:
              throw new Error(`Unknown action type: ${type}`);
          }
        })();

        console.log("State after API call: " + state);
        console.log(state);

        setState({ data: data, isLoading: false, message: undefined });

        switch (type) {
          case "delete": {
            Hub.dispatch("ui", {
              event: "attributesChanged",
              data: data,
              message: "attributes deleted successfully",
            });
            break;
          }
          case "update": {
            Hub.dispatch("ui", {
              event: "attributesChanged",
              data: data,
              message: "attributes updated successfully",
            });
            break;
          }
          case "confirm": {
            Hub.dispatch("ui", {
              event: "attributeVerified",
              message: "attribute successfully verified",
              data: data,
            });
            break;
          }
          case "sendVerificationCode": {
            Hub.dispatch("ui", {
              event: "confirmationCodeSent",
              data: data,
              message: "send code to verify attribute",
            });
            break;
          }
        }
      } catch (error) {
        console.log(error);
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          message: (error as Error).message,
        }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type]
  );
  return [state, handleAction];
};

export { useUserAttributes };
