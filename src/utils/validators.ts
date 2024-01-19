import apolloClient from "@/utils/apolloClient";
import i18nClient from "@/utils/i18nClient";
import {
    and,
    decimal,
    email,
    helpers,
    maxLength,
    minLength,
    required,
    sameAs,
    type MessageProps
} from "@vuelidate/validators";
import gql from "graphql-tag";
import type { Ref } from "vue";

const $t = i18nClient.global.t;
const { withMessage, withAsync } = helpers;

const keys = [
    "$invalid",
    "$model",
    "$params",
    "$pending",
    "$property",
    "$propertyPath",
    "$response",
    "$validator"
];

function replace(str: string, props: MessageProps, include?: string[]) {
    const inc = typeof include === "undefined" ? keys : include;
    const p: Record<string, any> = { ...props };
    for (const k of keys) {
        if (k in inc) continue;
        if (k === "$params") {
            const sp = p[k];
            for (const sk in sp) {
                str = str.replace(`${k}.${sk}`, sp[sk]);
            }
        } else str = str.replace(k, p[k]);
    }
    return str;
}

function treplace(str: string, props: MessageProps, include?: string[]) {
    return replace($t(str), props, include);
}

function getMessage(str: string, include?: string[]) {
    return (p: MessageProps) => treplace(str, p, include);
}

async function isEmailExisting(email: string) {
    try {
        const res = await apolloClient.query<{
            authExisting: boolean;
        }>({
            query: gql`
                query AuthExisting($email: String!) {
                    authExisting(email: $email)
                }
            `,
            variables: { email }
        });
        return res.data.authExisting;
    } catch (err: any) {
        /* empty */
    }
    return false;
}

const emailExisting = withAsync(isEmailExisting);
const emailNotExisting = withAsync(
    async (v: string) => !(await isEmailExisting(v))
);

function minLength_(min: number | Ref<number>) {
    const validator = minLength(min);
    return withMessage(
        getMessage("validations.minLength"),
        validator
    ) as typeof validator;
}

function maxLength_(max: number | Ref<number>) {
    const validator = maxLength(max);
    return withMessage(
        getMessage("validations.maxLength"),
        validator
    ) as typeof validator;
}

const lowercaseRegex = /[a-z]/;
const uppercaseRegex = /[A-Z]/;
const digitRegex = /[0-9]/;
const specialCharacterRegex = /[!@#$%^&*()_+=\-[\]{};:'",.<>/?]/;

const hasLowercase = withMessage(
    getMessage("validations.hasLowercase"),
    (v: string) => lowercaseRegex.test(v)
);

const hasUppercase = withMessage(
    getMessage("validations.hasUppercase"),
    (v: string) => uppercaseRegex.test(v)
);

const hasDigit = withMessage(getMessage("validations.hasDigit"), (v: string) =>
    digitRegex.test(v)
);

const hasSpecialCharacter = withMessage(
    getMessage("validations.hasSpecialCharacter"),
    (v: string) => specialCharacterRegex.test(v)
);

function passwordConfirmation(against: any) {
    return withMessage(
        getMessage("validations.passwordConfirmation"),
        sameAs(against)
    );
}

export default {
    utils: { replace, treplace, getMessage },
    required: withMessage(getMessage("validations.required"), required),
    email: withMessage(getMessage("validations.email"), email),
    emailExisting: withMessage(
        getMessage("validations.emailExisting"),
        emailExisting
    ),
    emailNotExisting: withMessage(
        getMessage("validations.emailNotExisting"),
        emailNotExisting
    ),
    minLength: minLength_,
    maxLength: maxLength_,
    hasLowercase,
    hasUppercase,
    hasDigit,
    hasSpecialCharacter,
    password: withMessage(
        getMessage("validations.password"),
        and(hasLowercase, hasUppercase, hasDigit, hasSpecialCharacter)
    ),
    passwordConfirmation,
    decimal: withMessage(getMessage("validations.decimal"), decimal)
};
