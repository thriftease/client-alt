import { validators } from "@/utils";

const transactionRules = {
    account: {
        required: validators.required
    },
    datetime: {
        required: validators.required
    },
    amount: {
        required: validators.required,
        decimal: validators.decimal
    },
    name: {
        maxLength: validators.maxLength(50)
    },
    description: {
        maxLength: validators.maxLength(250)
    }
};

export default transactionRules;
