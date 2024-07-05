import { deleteUserAttributes } from "@aws-amplify/auth";
import { Hub } from "@aws-amplify/core";
import { deleteUserAttributesAction } from "../useUserAttributes";
import { DeleteUserAttributesInput, UserAttributeKey } from "aws-amplify/auth";

jest.mock("@aws-amplify/auth");
jest.mock("@aws-amplify/core");

describe("deleteUserAttributesAction", () => {
  const mockInput: DeleteUserAttributesInput = { userAttributeKeys: ["email"] };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete user attributes successfully", async () => {
    const mockResult = undefined;
    (
      deleteUserAttributes as jest.MockedFunction<
        (input: DeleteUserAttributesInput) => Promise<void>
      >
    ).mockResolvedValueOnce(mockResult);

    const result = await deleteUserAttributesAction(undefined, mockInput);

    expect(result).toEqual(mockResult);
    expect(deleteUserAttributes).toHaveBeenCalledWith(mockInput);
    expect(Hub.dispatch).toHaveBeenCalledWith("ui", {
      event: "attributesChanged",
      message: "attributes deleted successfully",
    });
  });

  it("should handle error when deleting user attributes", async () => {
    const mockError = new Error("Failed to delete attributes");
    (
      deleteUserAttributes as jest.MockedFunction<typeof deleteUserAttributes>
    ).mockRejectedValueOnce(mockError);

    await expect(
      deleteUserAttributesAction(undefined, mockInput)
    ).rejects.toThrow(mockError);
    expect(deleteUserAttributes).toHaveBeenCalledWith(mockInput);
    expect(Hub.dispatch).toHaveBeenCalledWith("ui", {
      event: "attributesUpdateFailure",
      message: mockError.message,
    });
  });

  it("should throw an error for invalid input", async () => {
    const invalidInput = {
      userAttributeKeys: "value" as unknown as [
        UserAttributeKey,
        ...UserAttributeKey[]
      ],
    } as DeleteUserAttributesInput;
    await expect(
      deleteUserAttributesAction(undefined, invalidInput)
    ).rejects.toThrowError(
      "This instance of handleAction requires input of type: DeleteUserAttributesInput"
    );
  });
});
