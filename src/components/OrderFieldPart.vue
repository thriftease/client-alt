<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
    order: {
        type: Array<string>,
        required: true
    },
    asc: {
        type: String,
        default: "asc",
        required: false
    },
    desc: {
        type: String,
        default: "desc",
        required: false
    },
    name: {
        type: String,
        required: true
    }
});

const emits = defineEmits<{
    (
        e: "order",
        orderBy: (arr: string[], reverse?: boolean, push?: boolean) => void
    ): void;
}>();

const selectedOrder = computed({
    get() {
        return props.order.includes(props.asc)
            ? props.asc
            : props.order.includes(props.desc)
              ? props.desc
              : null;
    },
    set(v) {
        _selectedOrder.value = v;
        selectOrder();
    }
});
const _selectedOrder = ref<string | null>(selectedOrder.value);

function getRoute(order: string[], props = {}) {
    const route = router.currentRoute.value;
    return {
        ...route,
        query: {
            ...route.query,
            order
        },
        ...props
    };
}

function orderBy(arr: string[], reverse = false, push = true) {
    const toRemove: string[] = [];
    if (_selectedOrder.value === null) {
        toRemove.push(props.asc, props.desc);
    } else {
        toRemove.push(
            _selectedOrder.value === props.asc ? props.desc : props.asc
        );
    }
    for (const r of toRemove)
        while (arr.includes(r)) arr.splice(arr.indexOf(r), 1);
    if (_selectedOrder.value !== null) {
        if (!reverse) arr.push(_selectedOrder.value);
        else arr.splice(0, 0, _selectedOrder.value);
    }
    if (push) router.push(getRoute(arr));
}

function selectOrder() {
    emits("order", orderBy);
}

function toggleOrder() {
    if (selectedOrder.value === null) {
        selectedOrder.value = props.asc;
        return;
    }
    selectedOrder.value =
        selectedOrder.value === props.asc ? props.desc : props.asc;
}
</script>

<template>
    <button @click.prevent="toggleOrder">
        {{ name }}
        <template v-if="selectedOrder !== null">
            &nbsp;{{ selectedOrder === asc ? "&uarr;" : "&darr;" }}
        </template>
    </button>
</template>

<style scoped lang="pcss">
button {
    @apply border px-4 rounded bg-stone-200 py-0;
}
</style>
