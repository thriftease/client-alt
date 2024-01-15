<script setup lang="ts">
import type { PaginatorQueryInput, PaginatorType } from "@/gql";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const paginatorInput = computed(() => {
    return {
        page: route.query.page ? +route.query.page : 1,
        perPage: route.query.perPage ? +route.query.perPage || 1 : 10
    } as PaginatorQueryInput;
});
const paginator = ref<PaginatorType>();

defineExpose({ input: paginatorInput, type: paginator });
const emits = defineEmits(["input"]);

watch(paginatorInput, () => emits("input"));

const _perPage = ref(paginatorInput.value.perPage!);
const perPage = computed({
    get() {
        return _perPage.value;
    },
    set(v) {
        _perPage.value = Math.max(v, 1);
    }
});

function getRoute(page: number, perPage: number, props = {}) {
    return {
        ...route,
        query: {
            ...route.query,
            page,
            perPage
        },
        ...props
    };
}

function setPerPage() {
    router.push(getRoute(paginator.value!.page.current, perPage.value));
}
</script>

<template>
    <div v-if="paginator">
        <label for="perPage">{{ $t("itemsPerPage") }}</label>
        <input
            id="perPage"
            type="number"
            min="1"
            @keyup.enter="setPerPage"
            v-model="perPage"
        />
        <router-link
            v-if="paginator.page.previous"
            :to="getRoute(paginator.page.previous, paginator.perPage)"
            >{{ $t("previous") }}</router-link
        >
        <span v-else>{{ $t("previous") }}</span>
        &nbsp;
        <span>{{ `${paginator.page.current} / ${paginator.pages}` }}</span>
        &nbsp;
        <router-link
            v-if="paginator.page.next"
            :to="getRoute(paginator.page.next, paginator.perPage)"
            >{{ $t("next") }}</router-link
        >
        <span v-else>{{ $t("next") }}</span>
    </div>
</template>
