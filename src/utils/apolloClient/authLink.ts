import { useAuthStore } from "@/stores";
import { ApolloLink } from "@apollo/client/core";

const authLink = new ApolloLink((operation, forward) => {
    // Modify headers as per your requirement
    const authStore = useAuthStore();
    const token = authStore.getToken();

    if (token) {
        const context = operation.getContext();
        operation.setContext({
            ...context,
            headers: {
                ...context.headers,
                Authorization: `JWT ${token}`
            }
        });
    }
    return forward(operation);
});

export default authLink;
