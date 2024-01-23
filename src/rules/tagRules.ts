import { validators } from "@/utils";

const tagRules = {
    name: {
        required: validators.required,
        maxLength: validators.maxLength(50)
    }
};

export default tagRules;
