import {
  ConfirmUserAttributeInput,
  confirmUserAttribute,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import React from "react";

// LOOK AT BELOW WHEN MAKING EXAMPLE APP V2 - will need for creating inputs

// function isEmail(userAttributeKey: UserAttributeKey): userAttributeKey is VerifiableUserAttributeKey {
//     return userAttributeKey === 'email';
// }
// function isPhoneNumber(userAttributeKey: UserAttributeKey): userAttributeKey is VerifiableUserAttributeKey {
//     return userAttributeKey === 'phone_number';
// }

// function outputToInput (input: UpdateUserAttributesOutput): ConfirmUserAttributeInput {
//     const output: ConfirmUserAttributeInput = {
//         userAttributeKey: '',
//         confirmationCode: ''
//     }
//     // loop through the input object
//     for (const [, info] of Object.entries(input)) {
//         if (info.isUpdated) { // if it was updated, we need to check if it's done/verified
//             // do nothing
//         } else {
//             if (info.nextStep.updateAttributeStep === "CONFIRM_ATTRIBUTE_WITH_CODE") {
//                 if (info.nextStep.codeDeliveryDetails?.attributeName) {
//                     alert(`Confirmation code for ${info.nextStep.codeDeliveryDetails.attributeName} change was sent to: ${info.nextStep.codeDeliveryDetails.destination} via ${info.nextStep.codeDeliveryDetails.deliveryMedium}`)
//                     const code = prompt("Enter your code from your email to confirm: ");
//                     if (code && (isEmail(info.nextStep.codeDeliveryDetails.attributeName) || isPhoneNumber(info.nextStep.codeDeliveryDetails.attributeName))) {
//                         const confirmResponse: ConfirmUserAttributeInput = {
//                                 userAttributeKey: info.nextStep.codeDeliveryDetails.attributeName,
//                                 confirmationCode: code
//                             }
//                             try {
//                                 await confirmUserAttribute(confirmResponse)
//                             } catch (error) {
//                                 console.log(error);
//                             }
//                         }

//                 }
//             }
//         }
//     }
//     return output;
// }

type HandleVerifyUserAttribute = (input: ConfirmUserAttributeInput) => void;

export const useVerifyUserAttribute = (): [
  handleVerifyUserAttributes: HandleVerifyUserAttribute
] => {
  const handleVerify = React.useCallback(
    async (toVerify: ConfirmUserAttributeInput) => {
      try {
        await confirmUserAttribute(toVerify);
        Hub.dispatch("ui", {
          event: "attributeVerified",
          message: "attribute successfully verified",
        });
      } catch (e) {
        const error = e as Error;
        console.log(error);
      }
    },
    []
  );

  return [handleVerify];
};
// logic for parsing UpdateUserAttributesOutput into ConfirmUserAttributeInput
