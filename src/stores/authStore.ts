import {
    errorFragment,
    userFragment,
    type AuthSignInMutationPayload,
    type AuthVerifyMutationPayload,
    type CreateUserMutationInput,
    type CreateUserMutationPayload,
    type UserType
} from "@/gql";
import { apolloClient } from "@/utils";
import { ApolloError } from "@apollo/client/core";
import { gql } from "graphql-tag";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const useAuthStore = defineStore("authStore", () => {
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
        try {
            const result = await client.mutate<{
                authSignIn: AuthSignInMutationPayload;
            }>({
                mutation: gql`
                    ${userFragment}
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
            const data = result.data?.authSignIn;
            setToken(data?.token, rememberMe);
            _signedIn.value = data?.user;
            return data;
        } catch (err: any) {
            if (err instanceof ApolloError) return err;
        }
    }

    async function verify(token?: string | null) {
        if (!token) token = getToken();
        if (!token) return;
        try {
            const result = await client.mutate<{
                authVerify: AuthVerifyMutationPayload;
            }>({
                mutation: gql`
                    ${userFragment}
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
            const data = result.data?.authVerify;
            _signedIn.value = data?.user;
            return data;
        } catch (err: any) {
            if (err instanceof ApolloError) return err;
        }
    }

    async function signUp(user: CreateUserMutationInput) {
        try {
            const result = await client.mutate<{
                authSignUp: CreateUserMutationPayload;
            }>({
                mutation: gql`
                    ${errorFragment}
                    ${userFragment}
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
            const data = result.data?.authSignUp;
            return data;
        } catch (err: any) {
            if (err instanceof ApolloError) return err;
        }
    }

    function signOut() {
        setToken();
        _signedIn.value = undefined;
    }

    return {
        signIn,
        verify,
        signOut,
        signedIn,
        signUp
    };
});

export default useAuthStore;
