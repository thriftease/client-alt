import { validators } from "@/utils";

const accountRules = {
    currency: {
        required: validators.required
    },
    name: {
        required: validators.required,
        maxLength: validators.maxLength(50)
    }
};

export default accountRules;
