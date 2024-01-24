<script setup lang="ts">
import FieldErrorsPart from "@/components/FieldErrorsPart.vue";
import router from "@/router";
import { useAuthStore } from "@/stores";
import { handleError, validators } from "@/utils";
import useVuelidate from "@vuelidate/core";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const authStore = useAuthStore();

const data = ref({
    email: route.query.email ? (route.query.email as string) : "",
    password: "",
    rememberMe: false
});

const rules = {
    email: [validators.required, validators.email],
    password: [validators.required],
    rememberMe: []
};

const $v = useVuelidate(rules, data);

// validate pre-given values upon supply in query params
if (data.value.email) $v.value.email.$validate();

const submitting = ref(false);
async function submit() {
    submitting.value = true;
    if (await $v.value.$validate()) {
        const res = await authStore.signIn({
            email: data.value.email,
            password: data.value.password,
            rememberMe: data.value.rememberMe
        });
        const payload = handleError({
            data: res.payload.value?.result,
            error: res.error.value
        });
        if (payload) {
            router.replace({ name: "dashboard" });
        }
    }
    submitting.value = false;
}
</script>

<template>
    <h2>{{ $t("signIn") }}</h2>
    <br />
    <form @submit.prevent="submit" novalidate>
        <div class="field">
            <label for="email"
                >{{ $t("email") }}<span class="required">*</span></label
            >
            <br />
            <input
                id="email"
                name="email"
                type="email"
                v-model="$v.email.$model"
            />
            <FieldErrorsPart
                :errors="$v.email.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <div class="field">
            <label for="password"
                >{{ $t("password") }}<span class="required">*</span></label
            >
            <br />
            <input
                id="password"
                name="password"
                type="password"
                v-model="$v.password.$model"
            />
            <FieldErrorsPart
                :errors="$v.password.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <div class="field">
            <label for="remember-me">{{ $t("rememberMe") }}</label>
            <br />
            <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                v-model="data.rememberMe"
            />
        </div>
        <br />

        <div class="links">
            <router-link
                :to="{
                    name: 'auth-reset',
                    query: { email: data.email.trim() || undefined }
                }"
                >{{ $t("forgotPassword") }}</router-link
            >
            <br />
            <router-link
                :to="{
                    name: 'auth-sign-up',
                    query: { email: data.email.trim() || undefined }
                }"
                >{{ $t("signUp") }}</router-link
            >
        </div>
        <br />

        <div>
            <button
                class="button"
                type="submit"
                :disabled="submitting || $v.$invalid || !$v.$anyDirty"
            >
                {{ $t("submit") }}
            </button>
        </div>
    </form>
</template>

<style scoped lang="postcss">
h2 {
    @apply text-center;
}

input:not([type="checkbox"]) {
    @apply w-full;
}

button {
    @apply w-full;
}
</style>
