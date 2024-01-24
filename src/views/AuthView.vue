<script setup lang="ts">
import { defaultTitle } from "@/router/titleGuard";
import { BanknotesIcon } from "@heroicons/vue/24/solid";
</script>

<template>
    <div
        class="container mx-auto my-20 p-8 border-2 rounded-lg prose prose-sm"
        :class="$route.name !== 'auth-sign-up' ? 'max-w-md' : 'max-w-xl'"
    >
        <h1>
            <BanknotesIcon class="inline-block h-10 w-10" />&nbsp;{{
                defaultTitle
            }}
        </h1>
        <router-view></router-view>
    </div>
</template>
