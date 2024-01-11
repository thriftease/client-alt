import type { ErrorType } from "@/gql";
import apolloClient from "@/utils/apolloClient";
import i18nClient from "@/utils/i18nClient";
import validators from "@/utils/validators";
import type { ErrorObject } from "@vuelidate/core";

import { ApolloError } from "@apollo/client/core";

function flattenErrors(errors: ErrorObject[]) {
    return errors.map((e) => e.$message as string);
}

function handleError<T>(
    response: {
        data?: T;
        error?: true | ApolloError | ErrorType[] | ErrorType;
    } = {}
) {
    const { data, error } = response;
    if (typeof error === "undefined") return data;
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

export { apolloClient, flattenErrors, handleError, i18nClient, validators };
