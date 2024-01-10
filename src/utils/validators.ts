import apolloClient from "@/utils/apolloClient";
import i18nClient from "@/utils/i18nClient";
import {
    email,
    helpers,
    required,
    type MessageProps
} from "@vuelidate/validators";
import gql from "graphql-tag";

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
        str = str.replace(k, p[k]);
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

const emailNotExisting = withAsync(isEmailExisting);
const emailExisting = withAsync(
    async (v: string) => !(await isEmailExisting(v))
);

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
    )
};
