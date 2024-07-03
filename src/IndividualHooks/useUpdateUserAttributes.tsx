import {
  UpdateUserAttributesOutput,
  UpdateUserAttributesInput,
  updateUserAttributes,
} from "aws-amplify/auth";
import React from "react";
import { Hub } from "aws-amplify/utils";

interface UpdateUserAttributesState {
  /**
   * user attributes data
   */
  data: UpdateUserAttributesOutput | undefined;
  /**
   * indicates hook network activity
   */
  isLoading: boolean;
  /**
   * error message
   */
  message: string | undefined;
}

type HandleUpdateUserAttributes = (input: UpdateUserAttributesInput) => void;

export const useUpdateUserAttributes = (): [
  state: UpdateUserAttributesState,
  handleUpdateUserAttributes: HandleUpdateUserAttributes
] => {
  const [results, setResults] = React.useState<UpdateUserAttributesState>({
    data: undefined,
    isLoading: true,
    message: undefined,
  });

  const handleUpdate = async (toUpdate: UpdateUserAttributesInput) => {
    try {
      const output = await updateUserAttributes(toUpdate);
      setResults({
        data: output,
        isLoading: false,
        message: undefined,
      });

      Hub.dispatch("ui", {
        event: "attributesChanged",
        data: results,
        message: "attributes updated successfully",
      });
    } catch (e) {
      const error = e as Error;
      setResults({
        data: undefined,
        isLoading: false,
        message: error.message,
      });
    }
  };

  return [results, handleUpdate];
};

// import { UpdateUserAttributesOutput, UpdateUserAttributesInput, updateUserAttributes } from "aws-amplify/auth";
// import React, { useReducer, useCallback } from "react";
// import { Hub } from "aws-amplify/utils";

// interface UpdateUserAttributesState {
//   data: UpdateUserAttributesOutput | undefined;
//   isLoading: boolean;
//   error: string | undefined;
// }

// type UpdateUserAttributesAction =
//   | { type: "UPDATE_START" }
//   | { type: "UPDATE_SUCCESS"; data: UpdateUserAttributesOutput }
//   | { type: "UPDATE_FAILURE"; error: string };

// const updateUserAttributesReducer = (
//   state: UpdateUserAttributesState,
//   action: UpdateUserAttributesAction
// ): UpdateUserAttributesState => {
//   switch (action.type) {
//     case "UPDATE_START":
//       return { ...state, isLoading: true, error: undefined };
//     case "UPDATE_SUCCESS":
//       return { data: action.data, isLoading: false, error: undefined };
//     case "UPDATE_FAILURE":
//       return { ...state, isLoading: false, error: action.error };
//     default:
//       return state;
//   }
// };

// export const useUpdateUserAttributes = (): [
//   UpdateUserAttributesState,
//   (input: UpdateUserAttributesInput) => Promise<void>
// ] => {
//   const [state, dispatch] = useReducer(updateUserAttributesReducer, {
//     data: undefined,
//     isLoading: false,
//     error: undefined,
//   });

//   const handleUpdateUserAttributes = useCallback(
//     async (input: UpdateUserAttributesInput) => {
//       try {
//         dispatch({ type: "UPDATE_START" });
//         const output = await updateUserAttributes(input);
//         dispatch({ type: "UPDATE_SUCCESS", data: output });
//         Hub.dispatch("ui", {
//           event: "attributesChanged",
//           data: output,
//           message: "attributes updated successfully",
//         });
//       } catch (error) {
//         dispatch({ type: "UPDATE_FAILURE", error: error.message });
//       }
//     },
//     []
//   );

//   return [state, handleUpdateUserAttributes];
// };
