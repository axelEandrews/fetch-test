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

interface Actions {
  confirm: typeof confirmUserAttribute;
  delete: typeof deleteUserAttributes;
  sendVerificationCode: typeof sendUserAttributeVerificationCode;
  update: typeof updateUserAttributes;
}

const useUserAttributes = <T extends keyof Actions>(
  type: T
): [
  state: ActionState<Awaited<Actions[T]>>,
  handleAction: (input: Parameters<Actions[T]>[0]) => void
] => {
  const [state, setState] = useState<ActionState<Awaited<Actions[T]>>>({
    data: {} as Awaited<ReturnType<Actions[T]>>,
    isLoading: false,
    message: undefined,
  });

  function isDeleteUserAttributesInput(
    input: Parameters<Actions[T]>[0]
  ): input is DeleteUserAttributesInput {
    console.log(input);
    return typeof input === "object" && input !== null;
  }
  function isUpdateUserAttributesInput(
    input: Parameters<Actions[T]>[0]
  ): input is UpdateUserAttributesInput {
    console.log(input);
    return (
      typeof input === "object" && input !== null && "userAttributes" in input
    );
  }

  function isConfirmUserAttributeInput(
    input: Parameters<Actions[T]>[0]
  ): input is ConfirmUserAttributeInput {
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
                throw new Error("Invalid input type for delete action");
              }
              return actions.delete(input);
            case "update":
              if (!isUpdateUserAttributesInput(input)) {
                throw new Error("Invalid input type for update action");
              }
              return actions.update(input);
            // Add similar type checks for other action types
            case "confirm":
              if (!isConfirmUserAttributeInput(input)) {
                throw new Error("Invalid input type for confirm action");
              }
              return actions.confirm(input);
            case "sendVerificationCode":
              if (!isSendUserAttributeVerificationCodeInput(input)) {
                throw new Error(
                  "Invalid input type for sendVerificationCode action"
                );
              }
              return actions.sendVerificationCode(input);
            default:
              throw new Error(`Unknown action type: ${type}`);
          }
        })();

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
