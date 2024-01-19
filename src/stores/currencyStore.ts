import {
    CurrencyOrderQueryInput,
    type CreateCurrencyMutationInput,
    type CreateCurrencyMutationPayload,
    type CurrencyFilterQueryInput,
    type DeleteCurrencyMutationInput,
    type DeleteCurrencyMutationPayload,
    type GetCurrencyQueryInput,
    type GetCurrencyQueryPayload,
    type GivenCurrencyType,
    type ListCurrenciesQueryPayload,
    type PaginatorQueryInput,
    type UpdateCurrencyMutationInput,
    type UpdateCurrencyMutationPayload
} from "@/gql";
import { Dec, apolloMutate, apolloQuery } from "@/utils";
import { gql } from "@apollo/client/core";
import axios from "axios";
import type Decimal from "decimal.js";
import { defineStore } from "pinia";

let givenCurrencies: { [key: string]: string } | undefined = undefined;

const useCurrencyStore = defineStore("currencyStore", () => {
    async function listGiven() {
        const arr: CreateCurrencyMutationInput[] = [];
        let fetched: { [key: string]: string } = {};
        if (givenCurrencies === undefined) {
            try {
                const res = await axios.get<{ [key: string]: string }>(
                    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.min.json"
                );
                fetched = res.data;
                givenCurrencies = fetched;
            } catch (err: any) {
                /* empty */
            }
        } else fetched = givenCurrencies;
        for (const k in fetched) {
            arr.push({
                abbreviation: k,
                name: fetched[k] || k,
                symbol: k.toUpperCase()
            });
        }
        arr.sort((a, b) => {
            const [x, y] = [
                a.abbreviation.toLowerCase(),
                b.abbreviation.toLowerCase()
            ];
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });
        return arr;
    }

    async function listGivenAlt() {
        const re = await apolloQuery<{}, { result: GivenCurrencyType[] }>(
            {},
            gql`
                query ListGivenCurrencies {
                    result: listGivenCurrencies {
                        ...givenCurrencyFragment
                    }
                }
            `
        );
        return re;
    }

    async function create(currency: CreateCurrencyMutationInput) {
        const re = await apolloMutate<
            { currency: CreateCurrencyMutationInput },
            { result: CreateCurrencyMutationPayload }
        >(
            { currency },
            gql`
                mutation CreateCurrency(
                    $currency: CreateCurrencyMutationInput!
                ) {
                    result: createCurrency(input: $currency) {
                        data {
                            ...currencyFragment
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
            filter?: CurrencyFilterQueryInput;
            order?: CurrencyOrderQueryInput[];
            paginator?: PaginatorQueryInput;
            options?: {};
        } = {}
    ) {
        const re = await apolloQuery<
            typeof params,
            { result: ListCurrenciesQueryPayload }
        >(
            params,
            gql`
                query ListCurrencies(
                    $filter: CurrencyFilterQueryInput
                    $order: [CurrencyOrderQueryInput!]
                    $paginator: PaginatorQueryInput
                ) {
                    result: listCurrencies(
                        filter: $filter
                        order: $order
                        paginator: $paginator
                    ) {
                        data {
                            ...currencyFragment
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

    async function get(input: GetCurrencyQueryInput) {
        const re = await apolloQuery<
            { input: GetCurrencyQueryInput },
            { result: GetCurrencyQueryPayload }
        >(
            { input },
            gql`
                query GetCurrency($input: GetCurrencyQueryInput!) {
                    result: getCurrency(input: $input) {
                        data {
                            ...currencyFragment
                        }
                    }
                }
            `
        );
        return re;
    }

    async function update(currency: UpdateCurrencyMutationInput) {
        const re = await apolloMutate<
            { currency: UpdateCurrencyMutationInput },
            { result: UpdateCurrencyMutationPayload }
        >(
            { currency },
            gql`
                mutation UpdateCurrency(
                    $currency: UpdateCurrencyMutationInput!
                ) {
                    result: updateCurrency(input: $currency) {
                        data {
                            ...currencyFragment
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

    async function del(input: DeleteCurrencyMutationInput) {
        const re = await apolloMutate<
            { input: DeleteCurrencyMutationInput },
            { result: DeleteCurrencyMutationPayload }
        >(
            { input },
            gql`
                mutation DeleteCurrency($input: DeleteCurrencyMutationInput!) {
                    result: deleteCurrency(input: $input) {
                        data {
                            ...currencyFragment
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

    async function getRate(from: string, to: string) {
        try {
            const res = await axios.get<number>(
                `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from.toLowerCase()}/${to.toLowerCase()}.json`
            );
            return res.data;
        } catch (err: any) {
            return undefined;
        }
    }

    async function convert<T extends number | string | Decimal>(
        value: T,
        from: string,
        to: string
    ) {
        const rate = await getRate(from, to);
        if (rate === undefined) return value;
        const dec = new Dec(value);
        return dec.mul(rate).toFixed();
    }

    return {
        listGiven,
        listGivenAlt,
        create,
        list,
        get,
        update,
        delete: del,
        getRate,
        convert
    };
});

export default useCurrencyStore;
