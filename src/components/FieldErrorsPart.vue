<script setup lang="ts">
import { type ErrorObject } from "@vuelidate/core";
import FieldErrorPart from "./FieldErrorPart.vue";

defineProps({
    errors: {
        type: [
            Array<ErrorObject | string>,
            Object as () => ErrorObject,
            String
        ],
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
    <ul
        v-if="errors instanceof Array && (hidden ? errors.length > 1 : true)"
        v-bind="$attrs"
    >
        <li
            v-for="(error, i) in errors"
            :key="typeof error === 'string' ? i : error.$uid"
        >
            <FieldErrorPart :error="error"></FieldErrorPart>
        </li>
    </ul>
    <FieldErrorPart
        v-else
        :error="errors instanceof Array ? errors[0] : errors"
        :hidden="hidden"
        v-bind="$attrs"
    >
    </FieldErrorPart>
</template>
