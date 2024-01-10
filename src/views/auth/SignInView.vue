<script setup lang="ts">
import { useAuthStore } from "@/stores";
import { ref } from "vue";

const authStore = useAuthStore();

const data = ref({
    email: "",
    password: "",
    rememberMe: false
});

async function submit() {
    const res = await authStore.signIn(
        data.value.email,
        data.value.password,
        data.value.rememberMe
    );
    console.log(res);
}
</script>

<template>
    <h1>{{ $t("signIn") }}</h1>
    <br />
    <form @submit.prevent="submit" novalidate>
        <div>
            <label for="email">{{ $t("email") }}</label>
            <br />
            <input id="email" name="email" type="email" v-model="data.email" />
        </div>
        <div>
            <label for="password">{{ $t("password") }}</label>
            <br />
            <input
                id="password"
                name="password"
                type="password"
                v-model="data.password"
            />
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
            <button type="submit">
                {{ $t("submit") }}
            </button>
        </div>
    </form>
</template>
