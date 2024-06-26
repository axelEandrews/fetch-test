import { ConfirmUserAttributeInput, UpdateUserAttributesInput, UserAttributeKey } from "aws-amplify/auth";
import { useUpdateUserAttributes } from "./useUpdateUserAttributes";
import { useVerifyUserAttribute } from "./useVerifyUserAttribute";
import { Button, Flex, Heading, Input, Label } from "@aws-amplify/ui-react";

export const UpdateTester = () => {
    const [results, handleUpdate] = useUpdateUserAttributes();
    const [handleVerify] = useVerifyUserAttribute();


    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
  
      // Get the form data
      const formData = new FormData(event.currentTarget);
    
    
    // Create the input object, but only include non-empty fields
    const input: UpdateUserAttributesInput = {
      userAttributes: Object.fromEntries(
        Array.from(formData.entries()).filter(([, value]) => value !== '')
      ) as Record<UserAttributeKey, string>,
    };
  
      // Only call handleUpdate if there are non-empty fields
    if (Object.keys(input.userAttributes).length > 0) {
        // throw error if invalid email
        if (input.userAttributes.email && !input.userAttributes.email.includes('@')) {
          alert('Please enter a valid email address.');
        } else {
            handleUpdate(input);
            event.currentTarget.reset();
        }
    } else {
        alert('Please fill in at least one field before submitting.');
    }
    if (results?.data?.email.nextStep.codeDeliveryDetails) {
        const code = prompt("Enter your code from email: ")
        if (code) {
        const verifyInput: ConfirmUserAttributeInput = {
            userAttributeKey: "email",
            confirmationCode: code
        }
        // eslint-disable-next-line react-hooks/rules-of-hooks
        handleVerify(verifyInput)
    }
    }
}
  
    return (
      <form onSubmit={onSubmit}>
        <Flex direction="column">
          <Heading>Update Attributes: </Heading>
          <Flex gap="small">
            <Label htmlFor="nickname">Nickname</Label>
            <Input id="nickname" size="small" width="50%" name="nickname" placeholder="Nickname"/>
          </Flex>
  
          <Flex gap="small">
            <Label htmlFor="middle_name">Middle Name</Label>
            <Input id="middle_name" width="50%" name="middle_name" placeholder="Middle Name" />
          </Flex>
  
          <Flex gap="small">
            <Label htmlFor="name">Name</Label>
            <Input id="name" size="large" width="50%" name="name" placeholder="Name"/>
          </Flex>
          <Flex gap="small">
            <Label htmlFor="username">Username</Label>
            <Input id="username" size="large" width="50%" name="preferred_username" placeholder="Username"/>
          </Flex>
          <Flex gap="small">
            <Label htmlFor="email">Email</Label>
            <Input id="email" size="large" width="100%" name="email" placeholder="email"/>
          </Flex>
          <Flex gap="small">
            <Label htmlFor="family_name">Family Name</Label>
            <Input id="family_name" size="large" width="50%" name="family_name" placeholder="Last Name"/>
          </Flex>
          <Flex gap="small">
            <Label htmlFor="locale">Locale</Label>
            <Input id="locale" size="large" width="50%" name="locale" placeholder="Location"/>
          </Flex>
          <Flex gap="small">
            <Label htmlFor="website">Website</Label>
            <Input id="website" size="large" width="50%" name="website" placeholder="URL" />
          </Flex>
          <Button type="submit">Submit</Button>
        </Flex>
      </form>
    );
  };
