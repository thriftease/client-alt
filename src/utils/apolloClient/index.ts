import i18nLink from "@/utils/apolloClient/i18nLink";
import {
    ApolloClient,
    createHttpLink,
    InMemoryCache
} from "@apollo/client/core";

// HTTP connection to the API
const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: import.meta.env.API_URL
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
const apolloClient = new ApolloClient({
    link: i18nLink.concat(httpLink),
    cache
});

export default apolloClient;
