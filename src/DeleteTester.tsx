import { Button, Flex, Heading } from "@aws-amplify/ui-react";
import { DeleteUserAttributesInput, UserAttributeKey } from "aws-amplify/auth";
import { useDeleteUserAttributes } from "./useDeleteUserAttributes";

export const DeleteTester = () => {
    const [handleDelete] = useDeleteUserAttributes();
    // Select with form
    const onSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const attributes: UserAttributeKey[] = [];
        const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type=checkbox]:checked');

        for (let i = 0; i < checkboxes.length; i++) {
         attributes.push(checkboxes[i].value as UserAttributeKey);
        }

        const keys: DeleteUserAttributesInput = {
            userAttributeKeys: attributes as [UserAttributeKey, ...UserAttributeKey[]]
        };
        handleDelete(keys);
  };
    return (
       
        <Flex>   
             <Heading>Select Attributes to Delete:</Heading>
        <Flex>
            
        <form onSubmit={onSubmit}>
        <Flex>
        <input type="checkbox" name="name" value="name"/>
        <label>Name</label>
        </Flex>
        <Flex>
        <input type="checkbox" name="middle_name" value="middle_name"/>
        <label>Middle Name</label>
        </Flex>
        <Flex>
        <input type="checkbox" name="birthdate" value="birthdate" />
        <label>Birthdate</label>
        </Flex>
        <Flex>
        <input type="checkbox" name="nickname" value="nickname" />
        <label>Nickname</label>
        </Flex>
        <Flex>
        <input type="checkbox" name="username" value="preferred_username" />
        <label>Username</label>
        </Flex>
        <Flex>
        <input type="checkbox" name="family_name" value="family_name" />
        <label>Family Name</label>
        </Flex>
        <Flex>
        <input type="checkbox" name="locale" value="locale" />
        <label>Locale</label>
        </Flex>
        <Flex>
        <input type="checkbox" name="website" value="website" />
        <label>Website</label>
        </Flex>
        <Button type="submit">Submit</Button>
        </form>
        </Flex>
        </Flex>
    );
}