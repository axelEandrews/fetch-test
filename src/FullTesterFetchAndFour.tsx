import React from "react";
import { useUserAttributes } from "./useUserAttributes";
import { UserAttributeKey } from "aws-amplify/auth";
import { useFetchUserAttributes } from "./useFetchUserAttributes";
import {
  Button,
  CheckboxField,
  Flex,
  Heading,
  Input,
  Label,
  Loader,
} from "@aws-amplify/ui-react";

export const TestAppThree = () => {
  const [fetchState, handleFetch] = useFetchUserAttributes();
  const [deleteState, handleDelete] = useUserAttributes("delete");
  const [updateState, handleUpdate] = useUserAttributes("update");
  const [confirmState, handleConfirm] = useUserAttributes("confirm");
  const [sendConfirmationState, handleSendConfirmation] = useUserAttributes(
    "sendVerificationCode"
  );

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

  const [emailToVerify, setEmailToVerify] = React.useState<string | undefined>(
    undefined
  );
  const [phoneToVerify, setPhoneToVerify] = React.useState<string | undefined>(
    undefined
  );

  const handleDeleteSubmit = () => {
    handleDelete({
      userAttributeKeys: attributesToDelete as [
        UserAttributeKey,
        ...UserAttributeKey[]
      ],
    });
    setAttributesToDelete([]);
  };

  const handleUpdateSubmit = async () => {
    handleUpdate({ userAttributes: updatedAttributes });
    if (updatedAttributes.email) {
      setEmailToVerify(updatedAttributes.email);
    }
    if (updatedAttributes.phone_number) {
      setPhoneToVerify(updatedAttributes.phone_number);
    }
    setUpdatedAttributes({});
  };

  const handleEmailVerify = () => {
    handleConfirm({
      userAttributeKey: "email",
      confirmationCode: emailVerificationCode,
    });
    setEmailVerificationCode("");
    setIsEmailVerified(true);
    setEmailToVerify(undefined);
    setUpdatedAttributes((prevState) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, ...rest } = prevState;
      return rest;
    });
  };

  const handlePhoneVerify = () => {
    handleConfirm({
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

  return (
    <Flex direction="column" gap="medium">
      {(fetchState.isLoading ||
        deleteState.isLoading ||
        updateState.isLoading ||
        confirmState.isLoading ||
        sendConfirmationState.isLoading) && (
        <Flex alignContent="center">
          <Loader />
          <span>Loading...</span>
        </Flex>
      )}
      <Flex direction="column" gap="small">
        <div>
          <Heading>User Attributes</Heading>
        </div>
        {Object.entries(fetchState.data || {}).map(([key, value]) => (
          <Flex key={key} direction="row" alignItems="center" gap="small">
            <Label>{key}:</Label>
            <Flex direction="row" alignItems="center" gap="small" grow={1}>
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
        <div>
          <Heading>Verify Email</Heading>
        </div>
        <Flex gap="small">
          <Input
            value={emailVerificationCode}
            onChange={(e) => setEmailVerificationCode(e.target.value)}
          />
          <Button onClick={handleEmailVerify}>Verify</Button>
          <Button onClick={handleResendEmailConfirmation}>Resend Code</Button>
          {!isEmailVerified && emailToVerify && (
            <Label>
              Please check your email at {emailToVerify} for the confirmation
              code.
            </Label>
          )}
        </Flex>
      </Flex>

      <Flex direction="column" gap="small">
        <div>
          <Heading>Verify Phone Number</Heading>
        </div>
        <Flex gap="small">
          <Input
            value={phoneVerificationCode}
            onChange={(e) => setPhoneVerificationCode(e.target.value)}
          />
          <Button onClick={handlePhoneVerify}>Verify</Button>
          <Button onClick={handleResendPhoneConfirmation}>Resend Code</Button>
          {!isPhoneVerified && phoneToVerify && (
            <Label>
              Please check your phone at {phoneToVerify} for the confirmation
              code.
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
