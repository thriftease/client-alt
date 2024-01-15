<script setup lang="ts">
import type { PaginatorType } from "@/gql";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps<{
    value?: PaginatorType;
}>();

const route = useRoute();
const router = useRouter();

const query = computed(() => {
    const rv = {
        page: 1,
        perPage: 10
    };
    if (route.query.page && !isNaN(+route.query.page)) {
        rv.page = Math.max(+route.query.page, 1);
    }
    if (route.query.perPage && !isNaN(+route.query.perPage)) {
        rv.perPage = Math.max(+route.query.perPage, 1);
    }
    return rv;
});

defineExpose({ query });

const emits = defineEmits(["query"]);

watch(query, () => emits("query"));

const _perPage = ref(query.value.perPage);
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
    if (!props.value) return;
    router.push(getRoute(props.value.page.current, perPage.value));
}
</script>

<template>
    <div v-if="value">
        <label for="perPage">{{ $t("itemsPerPage") }}</label>
        <input
            id="perPage"
            type="number"
            min="1"
            @keyup.enter="setPerPage"
            v-model="perPage"
        />
        <router-link
            v-if="value.page.previous"
            :to="getRoute(value.page.previous, value.perPage)"
            >{{ $t("previous") }}</router-link
        >
        <span v-else>{{ $t("previous") }}</span>
        &nbsp;
        <span>{{ `${value.page.current} / ${value.pages}` }}</span>
        &nbsp;
        <router-link
            v-if="value.page.next"
            :to="getRoute(value.page.next, value.perPage)"
            >{{ $t("next") }}</router-link
        >
        <span v-else>{{ $t("next") }}</span>
    </div>
</template>
