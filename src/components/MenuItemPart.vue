<script setup lang="ts">
import { MenuItem } from "@headlessui/vue";

defineProps({
    title: {
        type: String,
        default: "",
        required: false
    }
});

defineEmits<{
    (e: "click"): void;
}>();
</script>

<template>
    <MenuItem v-bind="$attrs" v-slot="slotProps">
        <button
            :class="[
                slotProps.active ? 'bg-stone-700 text-white' : 'text-gray-900',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm'
            ]"
            @click="$emit('click')"
        >
            <slot v-bind="slotProps"></slot>{{ title }}
        </button>
    </MenuItem>
</template>
