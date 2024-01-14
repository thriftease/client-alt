import { validators } from "@/utils";

const currencyRules = {
    abbreviation: {
        required: validators.required,
        maxLength: validators.maxLength(15)
    },
    symbol: {
        required: validators.required,
        maxLength: validators.maxLength(15)
    },
    name: {
        required: validators.required,
        maxLength: validators.maxLength(50)
    }
};

export default currencyRules;
