import {
    AccountOrderQueryInput,
    type AccountFilterQueryInput,
    type CreateAccountMutationInput,
    type CreateAccountMutationPayload,
    type DeleteAccountMutationInput,
    type DeleteAccountMutationPayload,
    type GetAccountQueryInput,
    type GetAccountQueryPayload,
    type ListAccountsQueryPayload,
    type PaginatorQueryInput,
    type UpdateAccountMutationInput,
    type UpdateAccountMutationPayload
} from "@/gql";
import { apolloMutate, apolloQuery } from "@/utils";
import { gql } from "@apollo/client/core";
import { defineStore } from "pinia";

const useAccountStore = defineStore("accountStore", () => {
    async function create(account: CreateAccountMutationInput) {
        const re = await apolloMutate<
            { account: CreateAccountMutationInput },
            { result: CreateAccountMutationPayload }
        >(
            { account },
            gql`
                mutation CreateAccount($account: CreateAccountMutationInput!) {
                    result: createAccount(input: $account) {
                        data {
                            ...accountFragment
                        }
                        errors {
                            ...errorFragment
                        }
                    }
                }
            `
        );
        return re;
    }

    async function list(
        params: {
            filter?: AccountFilterQueryInput;
            order?: AccountOrderQueryInput[];
            paginator?: PaginatorQueryInput;
            options?: {};
        } = {}
    ) {
        const re = await apolloQuery<
            typeof params,
            { result: ListAccountsQueryPayload }
        >(
            params,
            gql`
                query ListAccounts(
                    $filter: AccountFilterQueryInput
                    $order: [AccountOrderQueryInput!]
                    $paginator: PaginatorQueryInput
                ) {
                    result: listAccounts(
                        filter: $filter
                        order: $order
                        paginator: $paginator
                    ) {
                        data {
                            ...accountFragment
                        }
                        paginator {
                            ...paginatorFragment
                        }
                    }
                }
            `,
            params.options
        );
        return re;
    }

    async function get(input: GetAccountQueryInput) {
        const re = await apolloQuery<
            { input: GetAccountQueryInput },
            { result: GetAccountQueryPayload }
        >(
            { input },
            gql`
                query GetAccount($input: GetAccountQueryInput!) {
                    result: getAccount(input: $input) {
                        data {
                            ...accountFragment
                        }
                    }
                }
            `
        );
        return re;
    }

    async function update(account: UpdateAccountMutationInput) {
        const re = await apolloMutate<
            { account: UpdateAccountMutationInput },
            { result: UpdateAccountMutationPayload }
        >(
            { account },
            gql`
                mutation UpdateAccount($account: UpdateAccountMutationInput!) {
                    result: updateAccount(input: $account) {
                        data {
                            ...accountFragment
                        }
                        errors {
                            ...errorFragment
                        }
                    }
                }
            `
        );
        return re;
    }

    async function del(input: DeleteAccountMutationInput) {
        const re = await apolloMutate<
            { input: DeleteAccountMutationInput },
            { result: DeleteAccountMutationPayload }
        >(
            { input },
            gql`
                mutation DeleteAccount($input: DeleteAccountMutationInput!) {
                    result: deleteAccount(input: $input) {
                        data {
                            ...accountFragment
                        }
                        errors {
                            ...errorFragment
                        }
                    }
                }
            `
        );
        return re;
    }

    async function existing(
        currency: string | number,
        name: string,
        options = {}
    ) {
        const re = await apolloQuery<
            { currency: string | number; name: string },
            { result: Boolean }
        >(
            { currency, name },
            gql`
                query AccountExisting($currency: ID!, $name: String!) {
                    result: accountExisting(currency: $currency, name: $name)
                }
            `,
            options
        );
        return re;
    }

    return {
        create,
        list,
        get,
        update,
        delete: del,
        existing
    };
});

export default useAccountStore;
