// import React from 'react';
import {
  Button,
  CheckboxField,
  Flex,
  Heading,
  Input,
  Label,
} from "@aws-amplify/ui-react";
import { useDeleteUserAttributes } from "./useDeleteUserAttributes";
import { useFetchUserAttributes } from "./useFetchUserAttributes";
import { useUpdateUserAttributes } from "./useUpdateUserAttributes";
import { useVerifyUserAttribute } from "./useVerifyUserAttribute";
import React from "react";
import { useSendConfirmationCode } from "./useSendConfirmationCode";

export const TestApp = () => {
  const [fetchState, handleFetch] = useFetchUserAttributes();
  const [handleDelete] = useDeleteUserAttributes();
  const [updateState, handleUpdate] = useUpdateUserAttributes();
  const [handleVerify] = useVerifyUserAttribute();
  const [handleSendConfirmation] = useSendConfirmationCode();

  const [attributesToDelete, setAttributesToDelete] = React.useState<string[]>(
    []
  );
  const [updatedAttributes, setUpdatedAttributes] = React.useState<
    Record<string, string>
  >({});

  const [emailVerificationCode, setEmailVerificationCode] = React.useState("");
  const [phoneVerificationCode, setPhoneVerificationCode] = React.useState("");

  const [isEmailVerified, setIsEmailVerified] = React.useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = React.useState(false);

  const handleDeleteSubmit = () => {
    handleDelete({
      userAttributeKeys: attributesToDelete as [string, ...string[]],
    });
  };

  const handleUpdateSubmit = async () => {
    handleUpdate({ userAttributes: updatedAttributes });
    // setUpdatedAttributes((prevState) => {
    //     const { email, phone_number } = prevState;
    //     return { email, phone_number };
    //   });
  };

  const handleEmailVerify = () => {
    handleVerify({
      userAttributeKey: "email",
      confirmationCode: emailVerificationCode,
    });
    setEmailVerificationCode("");
    setIsEmailVerified(true);
    setUpdatedAttributes((prevState) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, ...rest } = prevState;
      return rest;
    });
  };

  const handlePhoneVerify = () => {
    handleVerify({
      userAttributeKey: "phone_number",
      confirmationCode: phoneVerificationCode,
    });
    setPhoneVerificationCode("");
    setIsPhoneVerified(true);
  };

  const handleResendEmailConfirmation = () => {
    handleSendConfirmation({ userAttributeKey: "email" });
  };

  const handleResendPhoneConfirmation = () => {
    handleSendConfirmation({ userAttributeKey: "phone_number" });
  };

  React.useEffect(() => {
    handleFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (fetchState.isLoading) {
    return <div>Loading...</div>;
  }

  if (fetchState.message) {
    return <div>Error: {fetchState.message}</div>;
  }

  return (
    <Flex direction="column" gap="medium">
      <Flex direction="column" gap="small">
        <Heading>User Attributes</Heading>
        {Object.entries(fetchState.data || {}).map(([key, value]) => (
          <Flex key={key} gap="small">
            <Label>{key}:</Label>
            <Flex gap="small">
              <div>{value || "unspecified"}</div>
              <Input
                value={updatedAttributes[key] || ""}
                onChange={(e) =>
                  setUpdatedAttributes({
                    ...updatedAttributes,
                    [key]: e.target.value,
                  })
                }
              />
            </Flex>
            <CheckboxField
              name={key}
              label="Delete"
              checked={attributesToDelete.includes(key)}
              onChange={(e) => {
                if (e.target.checked) {
                  setAttributesToDelete([...attributesToDelete, key]);
                } else {
                  setAttributesToDelete(
                    attributesToDelete.filter((attr) => attr !== key)
                  );
                }
              }}
            />
          </Flex>
        ))}
      </Flex>

      <Flex direction="column" gap="small">
        <Heading>Verify Email</Heading>
        <Flex gap="small">
          <Input
            value={emailVerificationCode}
            onChange={(e) => setEmailVerificationCode(e.target.value)}
          />
          <Button onClick={handleEmailVerify}>Verify</Button>
          <Button onClick={handleResendEmailConfirmation}>Resend Code</Button>
          {!isEmailVerified && updateState.data?.email && (
            <Label>
              Please check your email at {updatedAttributes.email} for the
              confirmation code.
            </Label>
          )}
        </Flex>
      </Flex>

      <Flex direction="column" gap="small">
        <Heading>Verify Phone Number</Heading>
        <Flex gap="small">
          <Input
            value={phoneVerificationCode}
            onChange={(e) => setPhoneVerificationCode(e.target.value)}
          />
          <Button onClick={handlePhoneVerify}>Verify</Button>
          <Button onClick={handleResendPhoneConfirmation}>Resend Code</Button>
          {!isPhoneVerified && updateState.data?.phone_number && (
            <Label>
              Please check your phone at {updatedAttributes.phone_number} for
              the confirmation code.
            </Label>
          )}
        </Flex>
      </Flex>

      <Flex gap="small">
        <Button onClick={handleDeleteSubmit}>Delete Selected</Button>
        <Button onClick={handleUpdateSubmit}>Update Attributes</Button>
      </Flex>
    </Flex>
  );
};
