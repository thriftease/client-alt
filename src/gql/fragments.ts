import gql from "graphql-tag";

const errorFragment = gql`
    fragment errorFragment on ErrorType {
        field
        messages
    }
`;

const userFragment = gql`
    fragment userFragment on UserType {
        id
        email
        givenName
        middleName
        familyName
        suffix
        fullName
    }
`;

export { errorFragment, userFragment };
