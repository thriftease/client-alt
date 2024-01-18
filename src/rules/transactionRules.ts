import { validators } from "@/utils";
import { decimal } from "@vuelidate/validators";

const transactionRules = {
    account: {
        required: validators.required
    },
    datetime: {
        required: validators.required
    },
    amount: {
        required: validators.required,
        decimal: decimal
    },
    name: {
        maxLength: validators.maxLength(50)
    },
    description: {
        maxLength: validators.maxLength(250)
    }
};

export default transactionRules;
