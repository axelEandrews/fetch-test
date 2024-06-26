import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator, Divider, Flex, Heading } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { TestApp } from "./FullTester";
import { TestAppTwo } from "./FullTesterTwo";


const client = generateClient<Schema>();

function App() {
  const [, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, [])

  return (
    <Authenticator signUpAttributes={["birthdate","family_name","preferred_username","nickname","middle_name","phone_number"]}>
      {({ signOut, user }) => (
        <Flex>
    <main>
      <Heading fontSize={60}>Welcome to Attribute Manager!!</Heading>
      <Heading paddingBottom="small">
      <h2>{user?.signInDetails?.loginId}'s Attributes:</h2>
      <button onClick={signOut}>Sign Out</button>
      </Heading>
      <Divider size="large" style={{borderBottom:"10px solid navy", borderBlockStyle: "groove"}} />
      <TestApp />
      {/* <Flex fontWeight="bold" color="white" direction="row">
      <Divider size="small" orientation="vertical" style={{borderLeft:"10px solid navy", borderBlockStyle:"dotted"}}/>
        <DeleteTester />
        <Divider size="small" orientation="vertical" style={{borderLeft:"10px solid navy", borderBlockStyle:"dotted"}}/>
        <div>
      <UpdateTester />
      
      </div>
      <Divider size="small" orientation="vertical" style={{borderLeft:"10px solid navy", borderBlockStyle:"dotted"}}/>
      <div><Heading>User Attributes: </Heading><FetchTester /></div>
      <Divider size="small" orientation="vertical" style={{borderLeft:"10px solid navy", borderBlockStyle:"dotted"}}/>
      </Flex>
      <Divider size="large" style={{borderTop:"10px solid navy", borderBlockStyle: "groove"}} /> */}
    </main> 
    </Flex>)}

    </Authenticator>
  );
}

export default App;
