<script setup lang="ts">
import HeaderPart from "@/components/HeaderPart.vue";
import NavigationPart from "@/components/NavigationPart.vue";
</script>

<template>
    <HeaderPart></HeaderPart>
    <NavigationPart></NavigationPart>
    <hr />
    <router-view></router-view>
</template>
