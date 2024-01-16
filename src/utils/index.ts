import type { ErrorType } from "@/gql";
import apolloClient from "@/utils/apolloClient";
import i18nClient from "@/utils/i18nClient";
import validators from "@/utils/validators";
import {
    provideApolloClient,
    useLazyQuery,
    useMutation
} from "@vue/apollo-composable";
import type { ErrorObject } from "@vuelidate/core";

import {
    ApolloError,
    type DocumentNode,
    type OperationVariables
} from "@apollo/client/core";
import { ref } from "vue";
import type { LocationQuery } from "vue-router";

function flattenErrors(errors: ErrorObject[]) {
    return errors.map((e) => e.$message as string);
}

function handleError<T>(
    response: {
        data?: T;
        error?: true | ApolloError | ErrorType[] | ErrorType | null;
    } = {}
) {
    const { data, error } = response;
    if (error === undefined || error === null) return data;
    if (error instanceof ApolloError) {
        alert(error.message);
    } else if (error instanceof Array) {
        const errs = [];
        for (const e of error) {
            errs.push(`${e.field}: ${e.messages.join(", ")}`);
        }
        alert(
            errs.length
                ? errs.join("\n")
                : i18nClient.global.t("somethingWentWrong")
        );
    } else if (error === true) {
        alert(i18nClient.global.t("somethingWentWrong"));
    } else {
        return handleError({ error: [error] });
    }
}

async function apolloQuery<
    TInput extends OperationVariables,
    TPayload extends { [key: string]: any }
>(input: TInput, document: DocumentNode, options?: { [key: string]: any }) {
    const apolloProvider = provideApolloClient(apolloClient);
    const { result: payload, ...rest } = apolloProvider(() =>
        useLazyQuery<TPayload>(document, input, options)
    );
    try {
        await rest.load();
    } catch {
        /* empty */
    }
    return { ...rest, payload };
}

async function apolloMutate<
    TInput extends OperationVariables,
    TPayload extends { [key: string]: any }
>(input: TInput, document: DocumentNode, options?: { [key: string]: any }) {
    const apolloProvider = provideApolloClient(apolloClient);
    const { mutate, ...rest } = apolloProvider(() =>
        useMutation<TPayload>(document, {
            ...(options ?? {}),
            variables: input
        })
    );
    const payload = ref<TPayload>();
    try {
        payload.value = (await mutate())?.data ?? undefined;
    } catch {
        /* empty */
    }
    return { ...rest, payload };
}

function getQueryOrder<T extends string>(query: LocationQuery) {
    if (query.order) {
        if (typeof query.order === "string") return [query.order as T];
        return query.order as T[];
    }
    return [] as T[];
}

export {
    apolloClient,
    apolloMutate,
    apolloQuery,
    flattenErrors,
    getQueryOrder,
    handleError,
    i18nClient,
    validators
};
