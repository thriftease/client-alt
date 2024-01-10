import { i18nClient } from "@/utils";
import { ApolloLink } from "@apollo/client/core";

const i18nLink = new ApolloLink((operation, forward) => {
    // Modify headers as per your requirement
    const headers = operation.getContext().headers || {};

    operation.setContext({
        ...headers,
        "Accept-Language": i18nClient.global.locale
    });
    return forward(operation);
});

export default i18nLink;
