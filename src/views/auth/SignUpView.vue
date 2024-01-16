<script setup lang="ts">
import FieldErrorsPart from "@/components/FieldErrorsPart.vue";
import { userRules } from "@/rules";
import { useAuthStore } from "@/stores";
import { handleError, validators } from "@/utils";
import useVuelidate from "@vuelidate/core";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const data = ref({
    email: route.query.email ? (route.query.email as string) : "",
    password: "",
    givenName: "",
    middleName: "",
    familyName: "",
    suffix: "",
    passwordConfirmation: ""
});

const rules = {
    ...userRules,
    email: {
        ...userRules.email,
        emailNotExisting: validators.emailNotExisting
    },
    passwordConfirmation: {
        passwordConfirmation: validators.passwordConfirmation(
            computed(() => data.value.password)
        )
    }
};

const $v = useVuelidate(rules, data);

// validate pre-given values upon supply in query params
if (data.value.email) $v.value.email.$validate();

const submitting = ref(false);
async function submit() {
    submitting.value = true;
    if (await $v.value.$validate()) {
        const user = { ...data.value, passwordConfirmation: undefined };
        const res = await authStore.signUp(user);
        const payload = handleError({
            data: res.payload.value?.result,
            error: res.error.value
        });
        if (payload) {
            alert(`Signed up user "${payload.data!.fullName}"!`);
            router.push({ name: "auth-sign-in" });
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
                :errors="$v.passwordConfirmation.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <br />
        <div>
            <router-link
                :to="{
                    name: 'auth-sign-in',
                    query: { email: data.email.trim() || undefined }
                }"
                >{{ $t("signIn") }}</router-link
            >
            <br />
            <button
                type="submit"
                :disabled="submitting || $v.$invalid || !$v.$anyDirty"
            >
                {{ $t("submit") }}
            </button>
        </div>
    </form>
</template>
