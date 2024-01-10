import apolloClient from "@/utils/apolloClient";
import i18nClient from "@/utils/i18nClient";
import validators from "@/utils/validators";
import type { ErrorObject } from "@vuelidate/core";

function flattenErrors(errors: ErrorObject[]) {
    return errors.map((e) => e.$message as string);
}

export { apolloClient, flattenErrors, i18nClient, validators };
