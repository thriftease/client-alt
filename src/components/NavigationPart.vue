<script setup lang="ts"></script>

<template>
    <nav>
        <router-link :to="{ name: 'dashboard-currencies' }">{{
            $t("currencies")
        }}</router-link>
    </nav>
</template>

<style scoped>
nav > a {
    margin-right: 1em;
}
</style>
