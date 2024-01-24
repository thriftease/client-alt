<script setup lang="ts">
import {
    CurrencyDollarIcon,
    DocumentTextIcon,
    TagIcon,
    WalletIcon
} from "@heroicons/vue/24/solid";
import { useRoute } from "vue-router";

const route = useRoute();

const activeLinks: Record<string, string[]> = {
    currencies: ["dashboard-currencies-currency"],
    accounts: ["dashboard-accounts-account"],
    transactions: ["dashboard-transactions-transaction"],
    tags: ["dashboard-tags-tag"]
};

function getActiveClass(name: string) {
    const names = activeLinks[name];
    if (names) return names.includes(route.name as string) ? "active" : "";
    return "";
}
</script>

<template>
    <nav v-bind="$attrs">
        <router-link
            :to="{ name: 'dashboard-currencies' }"
            active-class="active"
            :class="getActiveClass('currencies')"
            ><CurrencyDollarIcon class="inline-block h-6 w-6" />&nbsp;{{
                $t("currencies")
            }}</router-link
        >
        <router-link
            :to="{ name: 'dashboard-accounts' }"
            active-class="active"
            :class="getActiveClass('accounts')"
            ><WalletIcon class="inline-block h-6 w-6" />&nbsp;{{
                $t("accounts")
            }}</router-link
        >
        <router-link
            :to="{ name: 'dashboard-transactions' }"
            active-class="active"
            :class="getActiveClass('transactions')"
            ><DocumentTextIcon class="inline-block h-6 w-6" />&nbsp;{{
                $t("transactions")
            }}</router-link
        >
        <router-link
            :to="{ name: 'dashboard-tags' }"
            active-class="active"
            :class="getActiveClass('tags')"
            ><TagIcon class="inline-block h-6 w-6" />&nbsp;{{
                $t("tags")
            }}</router-link
        >
    </nav>
</template>

<style scoped lang="postcss">
nav {
    @apply flex flex-col flex-wrap bg-stone-100;
}

nav > a {
    @apply border-y border-y-stone-300 px-4 py-2 mb-1 no-underline;
}

nav > a:hover,
nav > a.active {
    @apply text-white;
}

nav > a.active {
    @apply bg-stone-900;
}

nav > a:hover {
    @apply bg-stone-700;
}

nav > a:first-child {
    @apply mt-1;
}
</style>
