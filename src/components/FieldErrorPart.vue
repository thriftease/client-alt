<script setup lang="ts">
import { type ErrorObject } from "@vuelidate/core";
defineProps({
    error: {
        type: [Object as () => ErrorObject, String],
        required: false
    },
    hidden: {
        type: Boolean,
        default: true,
        required: false
    }
});
</script>

<template>
    <div v-if="hidden ? error : true" v-bind="$attrs">
        {{ typeof error === "string" ? error : error?.$message }}
    </div>
</template>

<style scoped lang="postcss">
div {
    @apply text-red-500 text-xs;
}
</style>
