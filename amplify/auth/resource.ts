import { defineAuth } from '@aws-amplify/backend';

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
    address: {
      mutable: true,
      required: false,
    },
    timezone: {
      mutable: true,
      required: false,
    },
    gender: {
      mutable: true,
      required: false,
    },
    fullname: {
      mutable: true,
      required: false
    }
  },
});
