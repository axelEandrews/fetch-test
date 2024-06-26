import {
  SendUserAttributeVerificationCodeInput,
  sendUserAttributeVerificationCode,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import React from "react";

type HandleSendConfirmationCode = (
  input: SendUserAttributeVerificationCodeInput
) => void;

export const useSendConfirmationCode = (): [
  handleSendConfirmation: HandleSendConfirmationCode
] => {
  const handleSendConfirmation = React.useCallback(
    async (toVerify: SendUserAttributeVerificationCodeInput) => {
      try {
        await sendUserAttributeVerificationCode(toVerify);
        Hub.dispatch("ui", {
          event: "confirmationCodeSent",
          message: "send code to verify attribute",
        });
      } catch (e) {
        const error = e as Error;
        console.log(error);
      }
    },
    []
  );

  return [handleSendConfirmation];
};
