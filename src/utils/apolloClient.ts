import i18nClient from "@/utils/i18nClient";
import {
    ApolloClient,
    ApolloLink,
    createHttpLink,
    InMemoryCache
} from "@apollo/client/core";

const i18nLink = new ApolloLink((operation, forward) => {
    // Modify headers as per your requirement
    const headers = operation.getContext().headers || {};

    operation.setContext({
        ...headers,
        "Accept-Language": i18nClient.global.locale
    });
    return forward(operation);
});

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
