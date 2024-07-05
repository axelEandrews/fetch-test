import React from "react";
import { useUserAttributes } from "./useUserAttributes";
import {
  // FetchUserAttributesOutput,
  // SendUserAttributeVerificationCodeOutput,
  // UpdateUserAttributesOutput,
  UserAttributeKey,
} from "aws-amplify/auth";

export const SimpleProfilePage = () => {
  const [fetchState, handleFetch] = useUserAttributes("fetch");
  const [, handleDelete] = useUserAttributes("delete");
  const [, handleUpdate] = useUserAttributes("update");
  const [, handleConfirm] = useUserAttributes("confirm");
  //const [, handleResend] = useUserAttributes("sendVerificationCode");
  const [isEditMode, setIsEditMode] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const updateEmailRef = React.useRef<HTMLFormElement>(null);
  const verifyEmailRef = React.useRef<HTMLFormElement>(null);
  const [isConfirmMode, setIsConfirmMode] = React.useState(false);
  // const [isConfirmMode, setIsConfirmMode] = React.useState(false);

  const editableAttributes: UserAttributeKey[] = [
    "family_name",
    "gender",
    "given_name",
    "locale",
    "middle_name",
    "name",
    "nickname",
    "preferred_username",
  ];

  const handleEditClick = () => {
    setIsEditMode(true);
    editableAttributes.forEach((key) => {
      const input = document.createElement("input");
      input.type = "text";
      input.name = key;
      input.value = fetchState.data[key] || "";
      formRef.current?.appendChild(input);
    });
  };

  const handleAttributeDelete = (key: UserAttributeKey) => {
    handleDelete({
      userAttributeKeys: [key],
    });
    console.log(key + "deleted");
    const input = formRef.current?.querySelector(
      `input[name="${key}"]`
    ) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userAttributes = Object.fromEntries(formData.entries()) as Record<
      UserAttributeKey,
      string
    >;
    handleUpdate({ userAttributes });
    setIsConfirmMode(true);
    e.currentTarget.reset();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAttributes = Object.fromEntries(formData.entries()) as Record<
      UserAttributeKey,
      string
    >;
    handleUpdate({ userAttributes: newAttributes });
  };

  const handleVerifySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const confirmationCode = formData.get("confirmationCode") as string;
    handleConfirm({
      userAttributeKey: "email",
      confirmationCode,
    });
    setIsConfirmMode(false);
    e.currentTarget.reset();
  };

  React.useEffect(() => {
    handleFetch();
  }, []);

  if (fetchState.isLoading) {
    return <div>Loading...</div>;
  }

  if (fetchState.message) {
    return <div>Error: {fetchState.message}</div>;
  }

  if (typeof fetchState.data === "undefined") {
    return <div>No data</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      {!isEditMode ? (
        <>
          {Object.entries(fetchState.data || {}).map(([key, value]) => (
            <div key={key}>
              <span>{key}: </span>
              <span>{value}</span>
            </div>
          ))}
          <button onClick={handleEditClick}>Edit</button>
        </>
      ) : (
        <div>
          <form ref={formRef} onSubmit={handleSubmit}>
            {editableAttributes.map((key) => (
              <div key={key}>
                <span>{key}: </span>
                <input
                  type="text"
                  name={key}
                  defaultValue={fetchState.data[key] || ""}
                />
                <button
                  type="button"
                  onClick={() => handleAttributeDelete(key)}
                >
                  Delete
                </button>
              </div>
            ))}
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditMode(false)}>
              Done
            </button>
          </form>
          <form ref={updateEmailRef} onSubmit={handleUpdateSubmit}>
            <label>
              Email:
              <input type="email" name="email" />
            </label>
            <button type="submit">Update Email</button>
          </form>
          {isConfirmMode && (
            <form ref={verifyEmailRef} onSubmit={handleVerifySubmit}>
              <label>
                Verification Code:
                <input type="text" name="confirmationCode" />
              </label>
              <button type="submit">Verify Email</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
