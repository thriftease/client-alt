<script setup lang="ts">
import FieldErrorPart from "./FieldErrorPart.vue";

defineProps({
    errors: {
        type: [Array<string>, String],
        required: false
    },
    hide: {
        type: Boolean,
        required: false
    }
});
</script>

<template>
    <ul
        v-if="errors instanceof Array && ((!hide && errors.length) || true)"
        v-bind="$attrs"
    >
        <li v-for="(error, i) in errors" :key="i">
            <FieldErrorPart>{{ error }}</FieldErrorPart>
        </li>
    </ul>
    <FieldErrorPart
        v-else-if="typeof errors === 'string' && ((!hide && errors) || true)"
        v-bind="$attrs"
    >
        {{ errors }}
    </FieldErrorPart>
</template>
