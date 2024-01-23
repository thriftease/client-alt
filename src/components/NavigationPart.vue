<script setup lang="ts"></script>

<template>
    <nav>
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

<style scoped>
nav > a {
    margin-right: 1em;
}
</style>
