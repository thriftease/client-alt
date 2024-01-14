import {
    type AuthApplyResetMutationInput,
    type AuthApplyResetMutationPayload,
    type AuthSendResetMutationPayload,
    type AuthSignInMutationPayload,
    type AuthVerifyMutationPayload,
    type AuthVerifyResetMutationPayload,
    type CreateUserMutationInput,
    type CreateUserMutationPayload,
    type UserType
} from "@/gql";
import { apolloMutate } from "@/utils";
import { gql } from "graphql-tag";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

type SignInAltVariables = { email: string; password: string };

const useAuthStore = defineStore("authStore", () => {
    const router = useRouter();
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
        vars: SignInAltVariables & { rememberMe?: boolean }
    ) {
        const { data, error, loading } = await apolloMutate<
            SignInAltVariables,
            { result: AuthSignInMutationPayload }
        >(
            { email: vars.email, password: vars.password },
            gql`
                mutation AuthSignIn($email: String!, $password: String!) {
                    result: authSignIn(email: $email, password: $password) {
                        token
                        user {
                            ...userFragment
                        }
                    }
                }
            `
        );
        if (data.value) {
            setToken(data.value.result.token, vars.rememberMe);
            _signedIn.value = data.value.result.user;
        }
        return { data, error, loading };
    }

    async function verify(token?: string | null) {
        if (!token) token = getToken();
        if (!token) return;

        const { data, error, loading } = await apolloMutate<
            { token: string },
            { result: AuthVerifyMutationPayload }
        >(
            { token },
            gql`
                mutation AuthVerify($token: String!) {
                    result: authVerify(token: $token) {
                        user {
                            ...userFragment
                        }
                    }
                }
            `
        );
        if (data.value) {
            _signedIn.value = data.value.result.user;
        }
        return { data, error, loading };
    }

    async function signUp(user: CreateUserMutationInput) {
        const { data, error, loading } = await apolloMutate<
            { user: CreateUserMutationInput },
            { result: CreateUserMutationPayload }
        >(
            { user },
            gql`
                mutation AuthSignUp($user: CreateUserMutationInput!) {
                    result: authSignUp(input: $user) {
                        data {
                            ...userFragment
                        }
                        errors {
                            ...errorFragment
                        }
                    }
                }
            `
        );
        return { data, error, loading };
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
        const { data, error, loading } = await apolloMutate<
            { email: string; url: string },
            { result: AuthSendResetMutationPayload }
        >(
            { email, url: resetUrl },
            gql`
                mutation AuthSendReset($email: String!, $url: String!) {
                    result: authSendReset(email: $email, url: $url) {
                        sent
                    }
                }
            `
        );
        return { data, error, loading };
    }

    async function verifyReset(token: string) {
        const { data, error, loading } = await apolloMutate<
            { token: string },
            { result: AuthVerifyResetMutationPayload }
        >(
            { token },
            gql`
                mutation AuthVerifyReset($token: String!) {
                    result: authVerifyReset(token: $token) {
                        user {
                            ...userFragment
                        }
                    }
                }
            `
        );
        return { data, error, loading };
    }

    async function applyReset(reset: AuthApplyResetMutationInput) {
        const { data, error, loading } = await apolloMutate<
            { reset: AuthApplyResetMutationInput },
            { result: AuthApplyResetMutationPayload }
        >(
            { reset: reset },
            gql`
                mutation AuthVerifyResest(
                    $reset: AuthApplyResetMutationInput!
                ) {
                    result: authApplyReset(input: $reset) {
                        data {
                            ...userFragment
                        }
                        errors {
                            ...errorFragment
                        }
                    }
                }
            `
        );
        return { data, error, loading };
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
