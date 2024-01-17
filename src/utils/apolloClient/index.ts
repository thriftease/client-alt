import {
    accountFragment,
    currencyFragment,
    errorFragment,
    pageFragment,
    paginatorFragment,
    tagFragment,
    transactionFragment,
    userFragment
} from "@/gql";
import authLink from "@/utils/apolloClient/authLink";
import i18nLink from "@/utils/apolloClient/i18nLink";
import { createFragmentRegistry } from "@apollo/client/cache";
import {
    ApolloClient,
    InMemoryCache,
    createHttpLink
} from "@apollo/client/core";

// HTTP connection to the API
const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: import.meta.env.API_URL
});

// Cache implementation
const cache = new InMemoryCache({
    fragments: createFragmentRegistry(
        errorFragment,
        userFragment,
        pageFragment,
        paginatorFragment,
        currencyFragment,
        accountFragment,
        tagFragment,
        transactionFragment
    )
});

// Create the apollo client
const apolloClient = new ApolloClient({
    link: i18nLink.concat(authLink).concat(httpLink),
    cache
});

export default apolloClient;
