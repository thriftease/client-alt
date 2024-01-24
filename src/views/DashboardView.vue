<script setup lang="ts">
import HeaderPart from "@/components/HeaderPart.vue";
import NavigationPart from "@/components/NavigationPart.vue";
</script>

<template>
    <div id="dashboard" class="prose prose-sm max-w-none">
        <HeaderPart id="header"></HeaderPart>
        <NavigationPart id="navigation"></NavigationPart>
        <div id="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<style scoped lang="pcss">
#dashboard {
    @apply flex flex-row flex-wrap;
}

#header {
    @apply basis-full;
}

#navigation {
    @apply basis-1/4;
}

#content {
    @apply basis-3/4 min-h-screen p-4;
}

@media screen(lg) {
    #navigation {
        @apply basis-1/5;
    }

    #content {
        @apply basis-4/5;
    }
}
</style>
