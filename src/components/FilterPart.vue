<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const props = defineProps({
    filters: {
        type: Array<[string, string]>,
        default: [],
        required: false
    }
});

const keys = computed(() => props.filters.map(([k]) => k));

const query = computed(() => {
    const rv = {
        search: "",
        filters: [] as string[]
    };
    if (route.query.search && typeof route.query.search === "string") {
        rv.search = route.query.search;
    }
    if (route.query.filters && route.query.filters instanceof Array) {
        rv.filters = route.query.filters.filter(
            (v) => v && keys.value.includes(v)
        ) as string[];
    }
    return rv;
});

const record = computed(() => {
    const rv: Record<string, any> = {};
    if (query.value.search) {
        for (const f of query.value.filters) {
            rv[f] = query.value.search;
        }
    }
    return rv;
});

defineExpose({ query, record });

const emits = defineEmits<{
    (event: "query", value: [typeof query.value, typeof record.value]): void;
}>();

watch(query, () => emits("query", [query.value, record.value]));

const searchValue = ref(query.value.search);
const selectedFilters = ref(
    query.value.filters.length ? query.value.filters : keys.value
);

function search() {
    router.push(getRoute(searchValue.value.trim(), selectedFilters.value));
}

function getRoute(search: string, filters: string[], props = {}) {
    return {
        ...route,
        query: {
            ...route.query,
            search,
            filters
        },
        ...props
    };
}
</script>

<template>
    <div>
        <input type="text" v-model="searchValue" @keyup.enter="search" />
        <select
            v-if="filters.length"
            v-model="selectedFilters"
            :size="filters.length > 1 ? 3 : 1"
            multiple
        >
            <option v-for="[key, val] of filters" :key="key" :value="key">
                {{ val }}
            </option>
        </select>
        <button @click.prevent="search">{{ $t("search") }}</button>
    </div>
</template>
