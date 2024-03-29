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

const givenCurrencyFragment = gql`
    fragment givenCurrencyFragment on GivenCurrencyType {
        abbreviation
        symbol
        name
    }
`;

const accountFragment = gql`
    fragment accountFragment on AccountType {
        id
        currency {
            ...currencyFragment
        }
        name
        balance
        futureBalance
    }
`;

const tagFragment = gql`
    fragment tagFragment on TagType {
        id
        name
    }
`;

const transactionFragment = gql`
    fragment transactionFragment on TransactionType {
        id
        account {
            ...accountFragment
        }
        amount
        datetime
        name
        description
        tagSet {
            ...tagFragment
        }
        oldAccountBalance
        newAccountBalance
        scheduled
        operation
    }
`;

export {
    accountFragment,
    currencyFragment,
    errorFragment,
    givenCurrencyFragment,
    pageFragment,
    paginatorFragment,
    tagFragment,
    transactionFragment,
    userFragment
};
