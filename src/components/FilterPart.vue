<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const props = defineProps({
    fields: {
        type: Array<[string, string]>,
        default: [],
        required: false
    }
});

const filterInput = computed(() => {
    return {
        search: (route.query.search || "") as string,
        fields: (route.query.fields instanceof Array
            ? route.query.fields
            : [route.query.fields]) as string[]
    };
});

defineExpose({
    input: computed(() => {
        const rv: Record<string, string> = {};
        for (const field of filterInput.value.fields) {
            rv[field] = filterInput.value.search;
        }
        return rv;
    })
});

const emits = defineEmits<{
    (e: "input", input: typeof filterInput.value): void;
}>();

watch(filterInput, () => {
    emits("input", filterInput.value);
});
onMounted(() => emits("input", filterInput.value));

const searchValue = ref("");
// const filters = ref<string[]>([
//     ...(filterInput.value.fields.length
//         ? filterInput.value.fields
//         : props.fields.map((e) => e[0]))
// ]);
const filter = ref(
    filterInput.value.fields.length
        ? filterInput.value.fields[0]
        : props.fields.length
          ? props.fields[0][0]
          : ""
);

function search() {
    router.push({
        ...route,
        query: {
            ...route.query,
            search: searchValue.value,
            fields: [filter.value]
        },
        force: true
    });
}
</script>

<template>
    <div>
        <input type="text" v-model="searchValue" @keyup.enter="search" />
        <select v-if="fields.length" v-model="filter">
            <option v-for="[key, val] of fields" :key="key" :value="key">
                {{ val }}
            </option>
        </select>
        <button @click.prevent="search">{{ $t("search") }}</button>
    </div>
</template>
