import { validators } from "@/utils";

const userRules = {
    email: {
        required: validators.required,
        email: validators.email,
        maxLength: validators.maxLength(50)
    },
    password: {
        required: validators.required,
        hasLowercase: validators.hasLowercase,
        hasUppercase: validators.hasUppercase,
        hasDigit: validators.hasDigit,
        hasSpecialCharacter: validators.hasSpecialCharacter,
        minLength: validators.minLength(7),
        maxLength: validators.maxLength(128)
    },
    givenName: {
        required: validators.required,
        maxLength: validators.maxLength(50)
    },
    middleName: { maxLength: validators.maxLength(50) },
    familyName: {
        required: validators.required,
        maxLength: validators.maxLength(50)
    },
    suffix: { maxLength: validators.maxLength(20) }
};

export default userRules;
