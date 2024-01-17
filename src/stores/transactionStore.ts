import {
    TransactionOrderQueryInput,
    type CreateTransactionMutationInput,
    type CreateTransactionMutationPayload,
    type DeleteTransactionMutationInput,
    type DeleteTransactionMutationPayload,
    type GetTransactionQueryInput,
    type GetTransactionQueryPayload,
    type ListTransactionsQueryPayload,
    type PaginatorQueryInput,
    type TransactionFilterQueryInput,
    type UpdateTransactionMutationInput,
    type UpdateTransactionMutationPayload
} from "@/gql";
import { apolloMutate, apolloQuery } from "@/utils";
import { gql } from "@apollo/client/core";
import { defineStore } from "pinia";

const useTransactionStore = defineStore("transactionStore", () => {
    async function create(transaction: CreateTransactionMutationInput) {
        const re = await apolloMutate<
            { transaction: CreateTransactionMutationInput },
            { result: CreateTransactionMutationPayload }
        >(
            { transaction },
            gql`
                mutation CreateTransaction(
                    $transaction: CreateTransactionMutationInput!
                ) {
                    result: createTransaction(input: $transaction) {
                        data {
                            ...transactionFragment
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
            filter?: TransactionFilterQueryInput;
            order?: TransactionOrderQueryInput[];
            paginator?: PaginatorQueryInput;
            options?: {};
        } = {}
    ) {
        const re = await apolloQuery<
            typeof params,
            { result: ListTransactionsQueryPayload }
        >(
            params,
            gql`
                query ListTransactions(
                    $filter: TransactionFilterQueryInput
                    $order: [TransactionOrderQueryInput!]
                    $paginator: PaginatorQueryInput
                ) {
                    result: listTransactions(
                        filter: $filter
                        order: $order
                        paginator: $paginator
                    ) {
                        data {
                            ...transactionFragment
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

    async function get(input: GetTransactionQueryInput) {
        const re = await apolloQuery<
            { input: GetTransactionQueryInput },
            { result: GetTransactionQueryPayload }
        >(
            { input },
            gql`
                query GetTransaction($input: GetTransactionQueryInput!) {
                    result: getTransaction(input: $input) {
                        data {
                            ...transactionFragment
                        }
                    }
                }
            `
        );
        return re;
    }

    async function update(transaction: UpdateTransactionMutationInput) {
        const re = await apolloMutate<
            { transaction: UpdateTransactionMutationInput },
            { result: UpdateTransactionMutationPayload }
        >(
            { transaction },
            gql`
                mutation UpdateTransaction(
                    $transaction: UpdateTransactionMutationInput!
                ) {
                    result: updateTransaction(input: $transaction) {
                        data {
                            ...transactionFragment
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

    async function del(input: DeleteTransactionMutationInput) {
        const re = await apolloMutate<
            { input: DeleteTransactionMutationInput },
            { result: DeleteTransactionMutationPayload }
        >(
            { input },
            gql`
                mutation DeleteTransaction(
                    $input: DeleteTransactionMutationInput!
                ) {
                    result: deleteTransaction(input: $input) {
                        data {
                            ...transactionFragment
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

    return {
        create,
        list,
        get,
        update,
        delete: del
    };
});

export default useTransactionStore;
