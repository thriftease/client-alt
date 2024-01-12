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
    token: route.query.token ? (route.query.token as string) : undefined,
    email: route.query.email ? (route.query.email as string) : "",
    password: "",
    passwordConfirmation: ""
});

const sendRules = {
    token: {},
    email: {
        required: validators.required,
        email: validators.email,
        emailExisting: validators.emailExisting
    },
    password: {},
    passwordConfirmation: {}
};

const applyRules = {
    token: { required: validators.required },
    email: {},
    password: {
        ...userRules.password
    },
    passwordConfirmation: {
        passwordConfirmation: validators.passwordConfirmation(
            computed(() => data.value.password)
        )
    }
};

const rules = computed(() => (!data.value.token ? sendRules : applyRules));

const $v = useVuelidate(rules, data);

// validate pre-given values upon supply in query params
if (data.value.token) $v.value.token.$validate();
if (data.value.email) $v.value.email.$validate();

async function setup() {
    if (data.value.token) {
        const res = await authStore.verifyReset(data.value.token);
        const payload = handleError(res);
        if (payload) {
            $v.value.email.$model = payload.email;
        } else {
            $v.value.token.$model = undefined;
            await router.replace({ name: "auth-reset" });
        }
    }
}
setup();

const submitting = ref(false);
async function submit() {
    submitting.value = true;
    if (await $v.value.$validate()) {
        if (!data.value.token) {
            const res = await authStore.sendReset(data.value.email);
            const payload = handleError(res);
            if (payload) {
                alert(`Sent password reset link!`);
            }
        } else {
            const res = await authStore.applyReset({
                token: data.value.token,
                password: data.value.password
            });
            const payload = handleError(res);
            if (payload) {
                alert(`Password has been updated!`);
                router.replace({ name: "auth-sign-in" });
            }
        }
    }
    submitting.value = false;
}
</script>

<template>
    <h1>{{ $t(!data.token ? "sendReset" : "applyReset") }}</h1>
    <br />
    <form @submit.prevent="submit" novalidate>
        <div>
            <label for="email">{{ $t("email") }}</label>
            <br />
            <input
                id="email"
                name="email"
                type="email"
                :readonly="!!data.token"
                v-model="$v.email.$model"
            />
            <FieldErrorsPart
                class="min-h-6"
                :errors="$v.email.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <div v-if="data.token">
            <label for="password">{{ $t("password") }}</label>
            <br />
            <input
                id="password"
                name="password"
                type="password"
                v-model="$v.password.$model"
            />
            <FieldErrorsPart
                class="min-h-6"
                :errors="$v.password.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <div v-if="data.token">
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
