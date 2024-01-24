<script setup lang="ts">
import { Menu, MenuButton, MenuItems } from "@headlessui/vue";
</script>
<template>
    <Menu as="div" class="relative inline-block text-left">
        <div>
            <MenuButton
                class="inline-flex w-full justify-center rounded-md bg-stone-700/20 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
            >
                <slot name="title"></slot>
            </MenuButton>
        </div>

        <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
        >
            <MenuItems
                class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-stone-700/5 focus:outline-none"
            >
                <slot name="options"></slot>
            </MenuItems>
        </transition>
    </Menu>
</template>
