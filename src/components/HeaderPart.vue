<script setup lang="ts">
import { defaultTitle } from "@/router/titleGuard";
import { useAuthStore } from "@/stores";
import { i18nClient } from "@/utils";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

function signOut() {
    if (confirm(i18nClient.global.t("aboutToSignOut"))) {
        authStore.signOut();
        router.go(0);
    } else selectedMenu.value = "menu";
}
const menus = {
    menu: undefined,
    signOut
};
const selectedMenu = ref<keyof typeof menus>("menu");
function selectMenu() {
    const v = selectedMenu.value;
    if (v !== undefined) {
        const fn = menus[v];
        if (fn !== undefined) {
            fn();
        }
    }
}
</script>

<template>
    <header>
        <h1>
            <router-link to="/">{{ defaultTitle }}</router-link>
        </h1>
        <select v-model="selectedMenu" @change="selectMenu">
            <option
                v-for="(fn, key) in menus"
                :value="key"
                :key="key"
                :hidden="fn === undefined"
            >
                {{ fn === undefined ? authStore.signedIn!.fullName : $t(key) }}
            </option>
        </select>
    </header>
</template>

<style scoped>
header > h1 {
    display: inline-block;
    margin-right: 1em;
}
</style>
