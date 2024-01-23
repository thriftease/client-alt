<script setup lang="ts">
import FilterPart from "@/components/FilterPart.vue";
import OrderFieldPart from "@/components/OrderFieldPart.vue";
import PaginatorPart from "@/components/PaginatorPart.vue";
import { TagOrderQueryInput, type PaginatorType, type TagType } from "@/gql";
import router from "@/router";
import { useTagStore } from "@/stores";
import { getQueryOrder, handleError, i18nClient, useSelector } from "@/utils";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const tagStore = useTagStore();

const paginator = ref<InstanceType<typeof PaginatorPart>>();
const filter = ref<InstanceType<typeof FilterPart>>();
const order = ref(getQueryOrder<TagOrderQueryInput>(route.query));

const tags = ref<TagType[]>([]);
const paginatorValue = ref<PaginatorType>();

const {
    items: selectorItems,
    selectedAll: selectorSelectedAll,
    ...selector
} = useSelector(tags, (e) => e.id);

async function setup() {
    const res = await tagStore.list({
        paginator: paginator.value?.query,
        filter: filter.value?.record,
        order: order.value,
        options: { fetchPolicy: "network-only" }
    });
    if (res.payload.value) {
        tags.value = res.payload.value.result.data as TagType[];
        paginatorValue.value = res.payload.value.result.paginator!;
    }
    selectorSelectedAll.value = false;
}
// call onMounted here so that the subcomponent paginator will load first
// before doing the setup in here
onMounted(async () => {
    watch(() => route.query, setup);
    await setup();
});

const deleting = ref("");
async function del(id: string) {
    deleting.value = id;
    if (confirm(i18nClient.global.t("aboutToDelete"))) {
        const res = await tagStore.delete({ id });

        const payload = handleError({
            data: res.payload.value?.result,
            error: res.error.value
        });
        if (payload) {
            await setup();
        }
    }
    deleting.value = "";
}

const deletingSelected = ref(false);
async function deleteSelected() {
    deletingSelected.value = true;
    if (
        !confirm(
            i18nClient.global
                .t("aboutToDeleteSelected")
                .replace("$selected", selectorItems.value.length.toString())
        )
    ) {
        deletingSelected.value = false;
        return;
    }
    const promise = Promise.all(
        selectorItems.value.map((e) => tagStore.delete({ id: e.id }))
    );
    await promise;
    router.go(0);
    deletingSelected.value = false;
}
</script>

<template>
    <h2>{{ $t("tags") }}</h2>
    <br />
    <table>
        <thead>
            <tr>
                <td colspan="3">
                    <FilterPart
                        ref="filter"
                        :filters="[['name_Icontains', $t('name')]]"
                    ></FilterPart>
                </td>
            </tr>
            <tr>
                <th>
                    <input type="checkbox" v-model="selectorSelectedAll" />
                </th>
                <th>
                    <OrderFieldPart
                        :order="order"
                        :name="$t('name')"
                        :asc="TagOrderQueryInput.NameAsc"
                        :desc="TagOrderQueryInput.NameDesc"
                        @order="$event(order, true)"
                    ></OrderFieldPart>
                </th>
                <th>{{ $t("actions") }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="tag of tags" :key="tag.id">
                <td>
                    <input
                        type="checkbox"
                        @click="selector.toggle(tag)"
                        :checked="selector.has(tag)"
                    />
                </td>
                <td>{{ tag.name }}</td>
                <td>
                    <router-link
                        :to="{
                            name: 'dashboard-tags-tag',
                            params: { id: tag.id }
                        }"
                    >
                        <button>{{ $t("view") }}</button>
                    </router-link>
                    &nbsp;
                    <button
                        @click="del(tag.id)"
                        :disabled="deleting === tag.id"
                    >
                        {{ $t("delete") }}
                    </button>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3">
                    <PaginatorPart
                        ref="paginator"
                        :value="paginatorValue"
                    ></PaginatorPart>
                </td>
            </tr>
            <tr>
                <td>
                    <button
                        @click.prevent="deleteSelected"
                        :disabled="!selectorItems.length || deletingSelected"
                    >
                        {{ $t("delete") }}
                    </button>
                </td>
                <td colspan="3">
                    <router-link
                        :to="{
                            name: 'dashboard-tags-tag',
                            params: { id: 0 }
                        }"
                    >
                        <button style="width: 100%">{{ $t("add") }}</button>
                    </router-link>
                </td>
            </tr>
        </tfoot>
    </table>
</template>
