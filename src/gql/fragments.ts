import gql from "graphql-tag";

const errorFragment = gql`
    fragment errorFragment on ErrorType {
        field
        messages
    }
`;

const pageFragment = gql`
    fragment pageFragment on PageType {
        previous
        current
        next
    }
`;

const paginatorFragment = gql`
    fragment paginatorFragment on PaginatorType {
        perPage
        items
        pages
        page {
            ...pageFragment
        }
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

const currencyFragment = gql`
    fragment currencyFragment on CurrencyType {
        id
        abbreviation
        symbol
        name
    }
`;

export {
    currencyFragment,
    errorFragment,
    pageFragment,
    paginatorFragment,
    userFragment
};
