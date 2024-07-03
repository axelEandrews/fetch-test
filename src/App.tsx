import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator, Divider, Heading } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { SimpleProfilePage } from "./SimpleTester";

const client = generateClient<Schema>();

function App() {
  const [, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  return (
    <Authenticator
      signUpAttributes={[
        "birthdate",
        "family_name",
        "preferred_username",
        "nickname",
        "middle_name",
        "phone_number",
      ]}
    >
      {({ signOut }) => (
        <main>
          <div>
            <Heading fontSize={60}>Welcome to Attribute Manager!!</Heading>
            <Heading paddingBottom="small">
              <button onClick={signOut}>Sign Out</button>
            </Heading>
          </div>
          <Divider
            size="large"
            style={{
              borderBottom: "10px solid navy",
              borderBlockStyle: "groove",
            }}
          />
          <SimpleProfilePage />
        </main>
      )}
    </Authenticator>
  );
}

export default App;
