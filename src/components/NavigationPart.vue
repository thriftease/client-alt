<script setup lang="ts"></script>

<template>
    <nav v-bind="$attrs">
        <router-link :to="{ name: 'dashboard-currencies' }">{{
            $t("currencies")
        }}</router-link>
        <router-link :to="{ name: 'dashboard-accounts' }">{{
            $t("accounts")
        }}</router-link>
        <router-link :to="{ name: 'dashboard-transactions' }">{{
            $t("transactions")
        }}</router-link>
        <router-link :to="{ name: 'dashboard-tags' }">{{
            $t("tags")
        }}</router-link>
    </nav>
</template>

<style scoped lang="postcss">
nav {
    @apply flex flex-col flex-wrap;
}

/* nav > a {
    margin-right: 1em;
} */
</style>
