<script setup lang="ts">
import FieldErrorsPart from "@/components/FieldErrorsPart.vue";
import { useAuthStore } from "@/stores";
import { handleError, validators } from "@/utils";
import useVuelidate from "@vuelidate/core";
import { ref } from "vue";

const authStore = useAuthStore();

const data = ref({
    email: "",
    password: "",
    rememberMe: false
});

const rules = {
    email: [validators.required, validators.email, validators.emailExisting],
    password: [validators.required],
    rememberMe: []
};

const $v = useVuelidate(rules, data);

const submitting = ref(false);
async function submit() {
    submitting.value = true;
    if (await $v.value.$validate()) {
        const res = await authStore.signIn(
            data.value.email,
            data.value.password,
            data.value.rememberMe
        );
        const payload = handleError(res);
        if (payload) {
            alert(`Signed in user "${payload.user!.fullName}"!`);
        }
    }
    submitting.value = false;
}
</script>

<template>
    <h1>{{ $t("signIn") }}</h1>
    <br />
    <form @submit.prevent="submit" novalidate>
        <div>
            <label for="email">{{ $t("email") }}</label>
            <br />
            <input
                id="email"
                name="email"
                type="email"
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
                v-model="$v.password.$model"
            />
            <FieldErrorsPart
                class="min-h-6"
                :errors="$v.password.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <div>
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
