<script setup lang="ts">
import FilterPart from "@/components/FilterPart.vue";
import PaginatorPart from "@/components/PaginatorPart.vue";
import { type CurrencyType, type PaginatorType } from "@/gql";
import { useCurrencyStore } from "@/stores";
import { handleError, i18nClient } from "@/utils";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const currencyStore = useCurrencyStore();

const paginator = ref<InstanceType<typeof PaginatorPart>>();
const filter = ref<InstanceType<typeof FilterPart>>();

const currencies = ref<CurrencyType[]>([]);
const paginatorValue = ref<PaginatorType>();
async function setup() {
    const res = await currencyStore.list({
        paginator: paginator.value?.query,
        filter: filter.value?.record,
        options: { fetchPolicy: "network-only" }
    });
    currencies.value = res.data.value?.result.data as CurrencyType[];
    paginatorValue.value = res.data.value?.result.paginator!;
}
// call onMounted here so that the subcomponent paginator will load first
// before doing the setup in here
onMounted(() => {
    watch(() => route.query, setup);
    setup();
});

const deleting = ref("");
async function del(id: string) {
    deleting.value = id;
    if (confirm(i18nClient.global.t("aboutToDelete"))) {
        const res = await currencyStore.delete({ id });

        const payload = handleError({
            data: res.data.value,
            error: res.error.value
        });
        if (payload) {
            await setup();
        }
    }
    deleting.value = "";
}
</script>

<template>
    <h2>{{ $t("currencies") }}</h2>
    <br />
    <table>
        <thead>
            <tr>
                <td colspan="4">
                    <FilterPart
                        ref="filter"
                        :filters="[
                            ['abbreviation_Icontains', $t('abbreviation')],
                            ['name_Icontains', $t('name')],
                            ['symbol_Icontains', $t('symbol')]
                        ]"
                    ></FilterPart>
                </td>
            </tr>
            <tr>
                <th>{{ $t("abbreviation") }}</th>
                <th>{{ $t("name") }}</th>
                <th>{{ $t("symbol") }}</th>
                <th>{{ $t("actions") }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="currency of currencies" :key="currency.id">
                <td>{{ currency.abbreviation.toUpperCase() }}</td>
                <td>{{ currency.name }}</td>
                <td>{{ currency.symbol }}</td>
                <td>
                    <router-link
                        :to="{
                            name: 'dashboard-currencies-currency',
                            params: { id: currency.id }
                        }"
                    >
                        <button>{{ $t("view") }}</button>
                    </router-link>
                    &nbsp;
                    <button
                        @click="del(currency.id)"
                        :disabled="deleting === currency.id"
                    >
                        {{ $t("delete") }}
                    </button>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4">
                    <PaginatorPart
                        ref="paginator"
                        :value="paginatorValue"
                    ></PaginatorPart>
                </td>
            </tr>
            <tr>
                <td colspan="4">
                    <router-link
                        :to="{
                            name: 'dashboard-currencies-currency',
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
