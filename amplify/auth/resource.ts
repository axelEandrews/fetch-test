import { defineAuth } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    // specify a "birthdate" attribute
    birthdate: {
      mutable: true,
      required: false,
    },
    phoneNumber: {
      mutable: true,
      required: true,
    },
    familyName: {
      mutable: true,
      required: false,
    },
    fullname: {
      mutable: true,
      required: false,
    },
    preferredUsername: {
      mutable: true,
      required: false,
    },
    nickname: {
      mutable: true,
      required: false,
    },
    middleName: {
      mutable: true,
      required: false,
    },
  },
});
