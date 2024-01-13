import {
    type AuthApplyResetMutationInput,
    type AuthApplyResetMutationPayload,
    type AuthSendResetMutationPayload,
    type AuthSignInMutationPayload,
    type AuthVerifyMutationPayload,
    type AuthVerifyResetMutationPayload,
    type CreateUserMutationInput,
    type CreateUserMutationPayload,
    type ErrorType,
    type UserType
} from "@/gql";
import { apolloClient } from "@/utils";
import { ApolloError } from "@apollo/client/core";
import { gql } from "graphql-tag";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const useAuthStore = defineStore("authStore", () => {
    const router = useRouter();

    const client = apolloClient;
    const token_key = "auth_token";

    const _signedIn = ref<UserType | null>();
    const signedIn = computed(() => _signedIn.value);

    function setToken(token?: string, rememberMe?: boolean) {
        if (!token) {
            sessionStorage.removeItem(token_key);
            localStorage.removeItem(token_key);
            return;
        }
        if (rememberMe) {
            localStorage.setItem(token_key, token);
            sessionStorage.removeItem(token_key);
        } else {
            sessionStorage.setItem(token_key, token);
            localStorage.removeItem(token_key);
        }
    }

    function getToken() {
        return (
            sessionStorage.getItem(token_key) ??
            localStorage.getItem(token_key)
        );
    }

    async function signIn(
        email: string,
        password: string,
        rememberMe?: boolean
    ) {
        const rv: {
            data?: AuthSignInMutationPayload;
            error?: ApolloError | true;
        } = {};
        try {
            const result = await client.mutate<{
                authSignIn: AuthSignInMutationPayload;
            }>({
                mutation: gql`
                    mutation AuthSignIn($email: String!, $password: String!) {
                        authSignIn(email: $email, password: $password) {
                            token
                            user {
                                ...userFragment
                            }
                        }
                    }
                `,
                variables: { email, password }
            });
            const data = result.data!.authSignIn;
            setToken(data.token, rememberMe);
            _signedIn.value = data.user;
            rv.data = data;
        } catch (err: any) {
            if (err instanceof ApolloError) rv.error = err;
            else rv.error = true;
        }
        return rv;
    }

    async function verify(token?: string | null) {
        const rv: {
            data?: AuthVerifyMutationPayload;
            error?: ApolloError | true;
        } = {};
        if (!token) token = getToken();
        if (!token) return;
        try {
            const result = await client.mutate<{
                authVerify: AuthVerifyMutationPayload;
            }>({
                mutation: gql`
                    mutation AuthVerify($token: String!) {
                        authVerify(token: $token) {
                            user {
                                ...userFragment
                            }
                        }
                    }
                `,
                variables: { token }
            });
            const data = result.data!.authVerify;
            _signedIn.value = data?.user;
            rv.data = data;
        } catch (err: any) {
            if (err instanceof ApolloError) rv.error = err;
            else rv.error = true;
        }
        return rv;
    }

    async function signUp(user: CreateUserMutationInput) {
        const rv: {
            data?: UserType;
            error?: ApolloError | ErrorType[] | true;
        } = {};
        try {
            const result = await client.mutate<{
                authSignUp: CreateUserMutationPayload;
            }>({
                mutation: gql`
                    mutation AuthSignUp($user: CreateUserMutationInput!) {
                        authSignUp(input: $user) {
                            data {
                                ...userFragment
                            }
                            errors {
                                ...errorFragment
                            }
                        }
                    }
                `,
                variables: { user }
            });
            const data = result.data!.authSignUp;
            if (!data.data) rv.error = data.errors;
            else rv.data = data.data;
        } catch (err: any) {
            if (err instanceof ApolloError) rv.error = err;
            else rv.error = true;
        }
        return rv;
    }

    function signOut() {
        setToken();
        _signedIn.value = undefined;
    }

    const resetUrl =
        window.location.origin +
        router.resolve({ name: "auth-reset" }).href +
        "?token={token}";

    async function sendReset(email: string) {
        const rv: {
            data?: boolean;
            error?: ApolloError | true;
        } = {};
        try {
            const result = await client.mutate<{
                authSendReset: AuthSendResetMutationPayload;
            }>({
                mutation: gql`
                    mutation AuthSendReset($email: String!, $url: String!) {
                        authSendReset(email: $email, url: $url) {
                            sent
                        }
                    }
                `,
                variables: { email, url: resetUrl }
            });
            const data = result.data!.authSendReset;
            rv.data = data.sent;
        } catch (err: any) {
            if (err instanceof ApolloError) rv.error = err;
            else rv.error = true;
        }
        return rv;
    }

    async function verifyReset(token: string) {
        const rv: {
            data?: UserType;
            error?: ApolloError | true;
        } = {};
        try {
            const result = await client.mutate<{
                authVerifyReset: AuthVerifyResetMutationPayload;
            }>({
                mutation: gql`
                    mutation AuthVerifyReset($token: String!) {
                        authVerifyReset(token: $token) {
                            user {
                                ...userFragment
                            }
                        }
                    }
                `,
                variables: { token }
            });
            const data = result.data!.authVerifyReset;
            if (data.user) rv.data = data.user;
        } catch (err: any) {
            if (err instanceof ApolloError) rv.error = err;
            else rv.error = true;
        }
        return rv;
    }

    async function applyReset(reset: AuthApplyResetMutationInput) {
        const rv: {
            data?: UserType;
            error?: ApolloError | ErrorType[] | true;
        } = {};
        try {
            const result = await client.mutate<{
                authApplyReset: AuthApplyResetMutationPayload;
            }>({
                mutation: gql`
                    mutation AuthVerifyResest(
                        $reset: AuthApplyResetMutationInput!
                    ) {
                        authApplyReset(input: $reset) {
                            data {
                                ...userFragment
                            }
                            errors {
                                ...errorFragment
                            }
                        }
                    }
                `,
                variables: { reset }
            });
            const data = result.data!.authApplyReset;
            if (!data.data) rv.error = data.errors;
            else rv.data = data.data;
        } catch (err: any) {
            if (err instanceof ApolloError) rv.error = err;
            else rv.error = true;
        }
        return rv;
    }

    return {
        signIn,
        verify,
        signOut,
        signedIn,
        signUp,
        sendReset,
        verifyReset,
        applyReset,
        setToken,
        getToken
    };
});

export default useAuthStore;
