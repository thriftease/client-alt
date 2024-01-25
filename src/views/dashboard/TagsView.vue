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
                <th colspan="3">
                    <FilterPart
                        ref="filter"
                        class="inline-block"
                        :filters="[
                            ['account_Name_Icontains', $t('account')],
                            [
                                'account_Currency_Name_Icontains',
                                $t('currency')
                            ],
                            ['name_Icontains', $t('name')],
                            ['description_Icontains', $t('description')],
                            ['tag_Name_Icontains', $t('tags')]
                        ]"
                    ></FilterPart>

                    &nbsp; &nbsp;
                    <PaginatorPart
                        ref="paginator"
                        class="inline-block"
                        :value="paginatorValue"
                    ></PaginatorPart>
                    &nbsp; &nbsp;

                    <button
                        class="button"
                        @click.prevent="deleteSelected"
                        :disabled="!selectorItems.length || deletingSelected"
                    >
                        {{ $t("delete") }}
                    </button>
                    &nbsp;
                    <router-link
                        :to="{
                            name: 'dashboard-tags-tag',
                            params: { id: 0 }
                        }"
                    >
                        <button class="button w-1/5">
                            {{ $t("add") }}
                        </button>
                    </router-link>
                </th>
            </tr>
            <tr>
                <th class="w-1">
                    <input type="checkbox" v-model="selectorSelectedAll" />
                </th>
                <th class="w-9/12">
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
                        <button class="button">{{ $t("view") }}</button>
                    </router-link>
                    &nbsp;
                    <button
                        class="button"
                        @click="del(tag.id)"
                        :disabled="deleting === tag.id"
                    >
                        {{ $t("delete") }}
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped lang="pcss">
h2 {
    @apply mt-0;
}

table > thead > tr:first-child > th {
    @apply pb-5 text-center;
}
</style>
