<script setup lang="ts">
import FieldErrorsPart from "@/components/FieldErrorsPart.vue";
import { useAuthStore } from "@/stores";
import { i18nClient, validators } from "@/utils";
import { ApolloError } from "@apollo/client/core";
import useVuelidate from "@vuelidate/core";
import { computed, ref } from "vue";

const authStore = useAuthStore();

const data = ref({
    email: "",
    password: "",
    givenName: "",
    middleName: "",
    familyName: "",
    suffix: "",
    passwordConfirmation: ""
});

const rules = {
    email: {
        required: validators.required,
        email: validators.email,
        maxLength: validators.maxLength(50),
        emailNotExisting: validators.emailNotExisting
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
    suffix: { maxLength: validators.maxLength(20) },
    passwordConfirmation: {
        passwordConfirmation: validators.passwordConfirmation(
            computed(() => data.value.password)
        )
    }
};

const $v = useVuelidate(rules, data);

const submitting = ref(false);
async function submit() {
    submitting.value = true;
    if (await $v.value.$validate()) {
        const user = { ...data.value, passwordConfirmation: undefined };
        const res = await authStore.signUp(user);
        if (res instanceof ApolloError) alert(res.message);
        else if (typeof res !== "undefined") {
            if (!res.data) {
                const errs = [];
                for (const e of res.errors) {
                    errs.push(`${e.field}: ${e.messages.join(", ")}`);
                }
                alert(
                    errs.length
                        ? errs.join("\n")
                        : i18nClient.global.t("somethingWentWrong")
                );
            }
        }
    }
    submitting.value = false;
}
</script>

<template>
    <h1>{{ $t("signUp") }}</h1>
    <br />
    <form @submit.prevent="submit" novalidate>
        <div>
            <label for="given-name">{{ $t("givenName") }}</label>
            <br />
            <input
                id="given-name"
                name="givenName"
                type="text"
                :maxlength="rules.givenName.maxLength.$params.max"
                v-model="$v.givenName.$model"
            />
            <FieldErrorsPart
                class="min-h-6"
                :errors="$v.givenName.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <div>
            <label for="middle-name">{{ $t("middleName") }}</label>
            <br />
            <input
                id="middle-name"
                name="middleName"
                type="text"
                :maxlength="rules.middleName.maxLength.$params.max"
                v-model="$v.middleName.$model"
            />
            <FieldErrorsPart
                class="min-h-6"
                :errors="$v.middleName.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <div>
            <label for="family-name">{{ $t("familyName") }}</label>
            <br />
            <input
                id="family-name"
                name="familyName"
                type="text"
                :maxlength="rules.familyName.maxLength.$params.max"
                v-model="$v.familyName.$model"
            />
            <FieldErrorsPart
                class="min-h-6"
                :errors="$v.familyName.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <div>
            <label for="suffix">{{ $t("suffix") }}</label>
            <br />
            <input
                id="suffix"
                name="suffix"
                type="text"
                :maxlength="rules.suffix.maxLength.$params.max"
                v-model="$v.suffix.$model"
            />
            <FieldErrorsPart
                class="min-h-6"
                :errors="$v.suffix.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <div>
            <label for="email">{{ $t("email") }}</label>
            <br />
            <input
                id="email"
                name="email"
                type="email"
                :maxlength="rules.email.maxLength.$params.max"
                v-model="$v.email.$model"
            />
            <FieldErrorsPart
                class="min-h-6"
                :errors="$v.email.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <div>
            <label for="password">{{ $t("password") }}</label>
            <br />
            <input
                id="password"
                name="password"
                type="password"
                :minlength="rules.password.minLength.$params.min"
                :maxlength="rules.password.maxLength.$params.max"
                v-model="$v.password.$model"
            />
            <FieldErrorsPart
                class="min-h-6"
                :errors="$v.password.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <div>
            <label for="password-confirmation">{{
                $t("passwordConfirmation")
            }}</label>
            <br />
            <input
                id="password-confirmation"
                name="passwordConfirmation"
                type="password"
                v-model="$v.passwordConfirmation.$model"
            />
            <FieldErrorsPart
                class="min-h-6"
                :errors="$v.passwordConfirmation.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <br />
        <div>
            <button
                type="submit"
                :disabled="submitting || $v.$invalid || !$v.$anyDirty"
            >
                {{ $t("submit") }}
            </button>
        </div>
    </form>
</template>
