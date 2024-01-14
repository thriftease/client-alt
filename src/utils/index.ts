import type { ErrorType } from "@/gql";
import apolloClient from "@/utils/apolloClient";
import i18nClient from "@/utils/i18nClient";
import validators from "@/utils/validators";
import type { ErrorObject } from "@vuelidate/core";

import {
    ApolloError,
    type DocumentNode,
    type OperationVariables
} from "@apollo/client/core";
import { ref } from "vue";

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

async function apolloRun<
    TInput extends OperationVariables,
    TPayload extends { [key: string]: any }
>(type: "mutation" | "query", input: TInput, document: DocumentNode) {
    const rv = {
        data: ref<TPayload>(),
        error: ref<ApolloError>(),
        loading: ref(false)
    };
    rv.loading.value = true;
    try {
        if (type === "mutation") {
            const result = await apolloClient.mutate<TPayload>({
                mutation: document,
                variables: input
            });
            rv.data.value = result.data!;
        } else {
            const result = await apolloClient.query<TPayload>({
                query: document,
                variables: input
            });
            rv.data.value = result.data!;
        }
    } catch (err: any) {
        rv.error.value = err as ApolloError;
    }
    rv.loading.value = false;
    return rv;
}

async function apolloQuery<
    TInput extends OperationVariables,
    TPayload extends { [key: string]: any }
>(input: TInput, document: DocumentNode) {
    return apolloRun<TInput, TPayload>("query", input, document);
}

async function apolloMutate<
    TInput extends OperationVariables,
    TPayload extends { [key: string]: any }
>(input: TInput, document: DocumentNode) {
    return apolloRun<TInput, TPayload>("mutation", input, document);
}

export {
    apolloClient,
    apolloMutate,
    apolloQuery,
    apolloRun,
    flattenErrors,
    handleError,
    i18nClient,
    validators
};
