import type { ErrorType } from "@/gql";
import apolloClient from "@/utils/apolloClient";
import Dec from "@/utils/dec";
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
import {
    computed,
    ref,
    type ComputedRef,
    type Ref,
    type WritableComputedRef
} from "vue";
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

function useSelector<T1, T2>(
    reference: Ref<T2[]> | ComputedRef<T2[]> | WritableComputedRef<T2[]>,
    value: (e: T2) => T1
) {
    const _items = ref<T1[]>([]) as Ref<T1[]>;
    const selectedAll = computed({
        get: (): boolean =>
            !!reference.value.length && reference.value.every((e) => has(e)),
        set: (val) => {
            _items.value.splice(0, _items.value.length);
            if (val) {
                reference.value.forEach((e) => select(e));
            }
        }
    });
    const itemValues = computed(() => _items.value);
    const items = computed(() => {
        const rv: T2[] = [];
        for (const item of _items.value) {
            const found = reference.value.find((e) => value(e) === item);
            if (found) rv.push(found);
        }
        return rv;
    });

    function has(item: T2) {
        return _items.value.includes(value(item));
    }

    function select(item: T2) {
        if (has(item)) return;
        _items.value.push(value(item));
    }

    function deselect(item: T2) {
        if (has(item))
            _items.value.splice(_items.value.indexOf(value(item)), 1);
    }

    function toggle(item: T2) {
        if (has(item)) deselect(item);
        else select(item);
    }

    return {
        items,
        itemValues,
        selectedAll,
        has,
        select,
        toggle
    };
}

function toPrettyDatetime(datetime: string, locale: string = "en-US") {
    // Create a Date object from the date string
    const date = new Date(datetime);

    // Format the date using Intl.DateTimeFormat
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    };

    const formattedDate = new Intl.DateTimeFormat(locale, options).format(
        date
    );

    return formattedDate;
}

function toJsDatetime(date: Date) {
    // Adjust for the local time zone offset
    const offsetMinutes = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offsetMinutes);

    // Format the date and time as a string suitable for the datetime-local input
    return date.toISOString().slice(0, 16);
}

function toDbDatetime(date: Date) {
    // Adjust for the local time zone offset
    const offsetMinutes = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() + offsetMinutes);

    // Format the date and time as a string suitable for the database
    return date.toISOString();
}

export {
    Dec,
    apolloClient,
    apolloMutate,
    apolloQuery,
    flattenErrors,
    getQueryOrder,
    handleError,
    i18nClient,
    toDbDatetime,
    toJsDatetime,
    toPrettyDatetime,
    useSelector,
    validators
};
