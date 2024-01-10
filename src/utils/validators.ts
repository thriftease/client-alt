import { i18nClient } from "@/utils";
import {
    email,
    helpers,
    required,
    type MessageProps
} from "@vuelidate/validators";

const $t = i18nClient.global.t;
const { withMessage } = helpers;

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

export default {
    utils: { replace, treplace, getMessage },
    required: withMessage(getMessage("validations.required"), required),
    email: withMessage(getMessage("validations.email"), email)
};
