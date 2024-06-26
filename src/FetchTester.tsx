import React from "react";
import { useFetchUserAttributes } from "./useFetchUserAttributes";
import { Flex, Text } from "@aws-amplify/ui-react";

// Example Usage
export const FetchTester = () => {
  console.log("Starting FetchTester...");
  const [{ isLoading, data, message }, handleFetch] = useFetchUserAttributes();
  // run on component mount
  React.useEffect(() => {
    handleFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //return and render error message
  if (message) {
    return <p>{message}</p>;
  }
  const attributes = Object.entries(data).map(([key, value], i) => (
    <Flex
      key={i}
      direction={{ base: "column" }}
      alignItems="left"
      justifyContent="flex-start"
    >
      <Text fontWeight="bold">
        {key}: {value || "unspecified"}
      </Text>
    </Flex>
  ));
  return isLoading ? <p>Loading...</p> : attributes;
};
