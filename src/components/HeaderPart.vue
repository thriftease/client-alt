<script setup lang="ts">
import MenuItemPart from "@/components/MenuItemPart.vue";
import MenuPart from "@/components/MenuPart.vue";
import { defaultTitle } from "@/router/titleGuard";
import { useAuthStore } from "@/stores";
import { i18nClient } from "@/utils";
import {
    ArrowLeftEndOnRectangleIcon,
    BanknotesIcon,
    UserCircleIcon
} from "@heroicons/vue/24/solid";
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
const menus: Record<string, undefined | (() => void)> = {
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
const customMenus: { title: string; click: () => void }[] = [];
for (const menu in menus) {
    const act = menus[menu];
    if (act !== undefined)
        customMenus.push({
            title: i18nClient.global.t(menu),
            click: act
        });
}
</script>

<template>
    <header v-bind="$attrs">
        <div>
            <router-link to="/"
                ><h1>
                    <BanknotesIcon class="inline-block h-10 w-10" />&nbsp;{{
                        defaultTitle
                    }}
                </h1></router-link
            >
        </div>
        <div>
            <!-- <select v-model="selectedMenu" @change="selectMenu">
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
            </select> -->
            <MenuPart>
                <template v-slot:title
                    >{{
                        authStore.signedIn!.fullName?.toString()
                    }}&nbsp;<UserCircleIcon class="inline-block h-6 w-6"
                /></template>
                <template v-slot:options>
                    <div class="px-1 py-1">
                        <MenuItemPart
                            v-for="(opt, idx) of customMenus"
                            :key="idx"
                            @click="opt.click"
                        >
                            <ArrowLeftEndOnRectangleIcon
                                class="inline-block h-6 w-6"
                            />&nbsp;{{ opt.title }}
                        </MenuItemPart>
                    </div>
                </template>
            </MenuPart>
        </div>
    </header>
</template>

<style scoped lang="postcss">
header {
    @apply grid grid-cols-2;
    @apply p-4;
    @apply bg-stone-900;
}

header > div:first-child {
    /* @apply basis-3/4; */
    @apply text-white !important;
}

header > div:first-child h1 {
    @apply text-white !important;
}

header > div:last-child {
    /* @apply basis-1/4; */
    @apply justify-self-end;
}
</style>
