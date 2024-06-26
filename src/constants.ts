import { UserAttributeKey } from "aws-amplify/auth";

export type UserAttributes = Record<UserAttributeKey, string | undefined>;

export const DefaultAttributes: UserAttributes = {
    'email': undefined,
    'phone_number': undefined,
    'address': undefined,
    'birthdate': undefined,
    'email_verified': undefined,
    'family_name': undefined,
    'gender': undefined,
    'given_name': undefined,
    'locale': undefined,
    'middle_name': undefined,
    'name': undefined,
    'nickname': undefined,
    'phone_number_verified': undefined,
    'picture': undefined,
    'preferred_username': undefined,
    'profile': undefined,
    'sub': undefined,
    'updated_at': undefined,
    'website': undefined,
    'zoneinfo': undefined,
}