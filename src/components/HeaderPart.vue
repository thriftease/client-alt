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
    <header v-bind="$attrs">
        <div>
            <router-link to="/"
                ><h1>{{ defaultTitle }}</h1></router-link
            >
        </div>
        <div>
            <select v-model="selectedMenu" @change="selectMenu">
                <option
                    v-for="(fn, key) in menus"
                    :value="key"
                    :key="key"
                    :hidden="fn === undefined"
                >
                    {{
                        fn === undefined
                            ? authStore.signedIn!.fullName
                            : $t(key)
                    }}
                </option>
            </select>
        </div>
    </header>
</template>

<style scoped lang="postcss">
header {
    @apply flex flex-row flex-wrap;
    @apply p-4;
    @apply bg-gray-950;
}

header > div:first-child {
    @apply basis-3/4;
    @apply text-white !important;
}

header > div:first-child h1 {
    @apply text-white !important;
}

header > div:last-child {
    @apply basis-1/4;
}

header > div:last-child > select {
    @apply ml-auto;
}
</style>
