<script setup lang="ts">
import type { PaginatorQueryInput, PaginatorType } from "@/gql";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const paginatorInput = computed(() => {
    return {
        page: route.query.page ? +route.query.page : 1,
        perPage: route.query.perPage ? +route.query.perPage : 10
    } as PaginatorQueryInput;
});
const paginator = ref<PaginatorType>();

defineExpose({ input: paginatorInput, type: paginator });
const $emits = defineEmits(["input"]);

watch(paginatorInput, () => $emits("input"));
</script>

<template>
    <div v-if="paginator">
        <router-link
            v-if="paginator.page.previous"
            :to="{
                name: route.name!,
                query: {
                    page: paginator.page.previous,
                    perPage: paginator.perPage
                }
            }"
            >{{ $t("previous") }}</router-link
        >
        <span v-else>{{ $t("previous") }}</span>
        &nbsp;
        <span>{{ `${paginator.page.current} / ${paginator.pages}` }}</span>
        &nbsp;
        <router-link
            v-if="paginator.page.next"
            :to="{
                name: route.name!,
                query: {
                    page: paginator.page.next,
                    perPage: paginator.perPage
                }
            }"
            >{{ $t("next") }}</router-link
        >
        <span v-else>{{ $t("next") }}</span>
    </div>
</template>