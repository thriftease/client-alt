<script setup lang="ts">
import FilterPart from "@/components/FilterPart.vue";
import PaginatorPart from "@/components/PaginatorPart.vue";
import {
    CurrencyOrderQueryInput,
    type CurrencyType,
    type PaginatorType
} from "@/gql";
import router from "@/router";
import { useCurrencyStore } from "@/stores";
import { getQueryOrder, handleError, i18nClient, useSelector } from "@/utils";
import { PlusCircleIcon } from "@heroicons/vue/24/solid";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const currencyStore = useCurrencyStore();

const paginator = ref<InstanceType<typeof PaginatorPart>>();
const filter = ref<InstanceType<typeof FilterPart>>();
const order = ref(getQueryOrder<CurrencyOrderQueryInput>(route.query));

const currencies = ref<CurrencyType[]>([]);
const paginatorValue = ref<PaginatorType>();

const {
    items: selectorItems,
    selectedAll: selectorSelectedAll,
    ...selector
} = useSelector(currencies, (e) => e.abbreviation);

async function setup() {
    const res = await currencyStore.list({
        paginator: paginator.value?.query,
        filter: filter.value?.record,
        order: order.value,
        options: { fetchPolicy: "network-only" }
    });
    if (res.payload.value) {
        currencies.value = res.payload.value.result.data as CurrencyType[];
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
        const res = await currencyStore.delete({ id });

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
        selectorItems.value.map((e) => currencyStore.delete({ id: e.id }))
    );
    await promise;
    router.go(0);
    deletingSelected.value = false;
}
</script>

<template>
    <h2 class="mt-0">{{ $t("currencies") }}</h2>
    <br />

    <PaginatorPart
        id="paginator"
        ref="paginator"
        :value="paginatorValue"
    ></PaginatorPart>
    <br />

    <div class="grid grid-cols-4 gap-4">
        <button
            :title="$t('add')"
            @click.prevent="
                $router.push({
                    name: 'dashboard-currencies-currency',
                    params: { id: 0 }
                })
            "
        >
            <PlusCircleIcon
                class="inline-block w-full h-full text-stone-500"
            ></PlusCircleIcon>
        </button>
        <button
            v-for="currency of currencies"
            :key="currency.id"
            :title="currency.name"
            @click.prevent="
                $router.push({
                    name: 'dashboard-currencies-currency',
                    params: { id: currency.id }
                })
            "
        >
            <div>
                <small :title="$t('abbreviation')">{{
                    currency.abbreviation.toUpperCase()
                }}</small
                >&nbsp;&centerdot;&nbsp;
                <small :title="$t('symbol')">{{
                    currency.symbol.toUpperCase()
                }}</small>
            </div>
            <strong :title="$t('name')">{{ currency.name }}</strong>
        </button>
    </div>

    <!-- <table>
        <thead>
            <tr>
                <td colspan="5">
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
                <th>
                    <input type="checkbox" v-model="selectorSelectedAll" />
                </th>
                <th>
                    <OrderFieldPart
                        :order="order"
                        :name="$t('abbreviation')"
                        :asc="CurrencyOrderQueryInput.AbbreviationAsc"
                        :desc="CurrencyOrderQueryInput.AbbreviationDesc"
                        @order="$event(order, true)"
                    ></OrderFieldPart>
                </th>
                <th>
                    <OrderFieldPart
                        :order="order"
                        :name="$t('name')"
                        :asc="CurrencyOrderQueryInput.NameAsc"
                        :desc="CurrencyOrderQueryInput.NameDesc"
                        @order="$event(order, true)"
                    ></OrderFieldPart>
                </th>
                <th>
                    <OrderFieldPart
                        :order="order"
                        :name="$t('symbol')"
                        :asc="CurrencyOrderQueryInput.SymbolAsc"
                        :desc="CurrencyOrderQueryInput.SymbolDesc"
                        @order="$event(order, true)"
                    ></OrderFieldPart>
                </th>
                <th>{{ $t("actions") }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="currency of currencies" :key="currency.id">
                <td>
                    <input
                        type="checkbox"
                        @click="selector.toggle(currency)"
                        :checked="selector.has(currency)"
                    />
                </td>
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
                        <button class="button">{{ $t("view") }}</button>
                    </router-link>
                    &nbsp;
                    <button
                        class="button"
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
                <td colspan="5">
                    <PaginatorPart
                        ref="paginator"
                        :value="paginatorValue"
                    ></PaginatorPart>
                </td>
            </tr>
            <tr>
                <td>
                    <button
                        class="button"
                        @click.prevent="deleteSelected"
                        :disabled="!selectorItems.length || deletingSelected"
                    >
                        {{ $t("delete") }}
                    </button>
                </td>
                <td colspan="4">
                    <router-link
                        :to="{
                            name: 'dashboard-currencies-currency',
                            params: { id: 0 }
                        }"
                    >
                        <button class="button" style="width: 100%">
                            {{ $t("add") }}
                        </button>
                    </router-link>
                </td>
            </tr>
        </tfoot>
    </table> -->
</template>

<style scoped lang="pcss">
.grid > div,
.grid > button {
    @apply border rounded h-20 p-2 bg-stone-700;
}

.grid > button:first-child {
    @apply bg-stone-300;
}

.grid > button:not(:first-child) > * {
    @apply text-white;
}
.grid > button:not(:first-child) > strong {
    @apply text-lg;
}

#paginator {
    @apply text-center;
}
</style>
