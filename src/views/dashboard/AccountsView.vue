<script setup lang="ts">
import FilterPart from "@/components/FilterPart.vue";
import OrderFieldPart from "@/components/OrderFieldPart.vue";
import PaginatorPart from "@/components/PaginatorPart.vue";
import {
    AccountOrderQueryInput,
    type AccountType,
    type PaginatorType
} from "@/gql";
import router from "@/router";
import { useAccountStore } from "@/stores";
import {
    getQueryOrder,
    handleError,
    i18nClient,
    toPrettyDecimal,
    useSelector
} from "@/utils";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const accountStore = useAccountStore();

const paginator = ref<InstanceType<typeof PaginatorPart>>();
const filter = ref<InstanceType<typeof FilterPart>>();
const order = ref(getQueryOrder<AccountOrderQueryInput>(route.query));

const accounts = ref<AccountType[]>([]);
const paginatorValue = ref<PaginatorType>();

const {
    items: selectorItems,
    selectedAll: selectorSelectedAll,
    ...selector
} = useSelector(accounts, (e) => e.id);

async function setup() {
    const res = await accountStore.list({
        paginator: paginator.value?.query,
        filter: filter.value?.record,
        order: order.value,
        options: { fetchPolicy: "network-only" }
    });
    if (res.payload.value) {
        accounts.value = res.payload.value.result.data as AccountType[];
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
        const res = await accountStore.delete({ id });

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
        selectorItems.value.map((e) => accountStore.delete({ id: e.id }))
    );
    await promise;
    router.go(0);
    deletingSelected.value = false;
}
</script>

<template>
    <h2>{{ $t("accounts") }}</h2>
    <br />
    <table>
        <thead>
            <tr>
                <td colspan="4">
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
                        :asc="AccountOrderQueryInput.NameAsc"
                        :desc="AccountOrderQueryInput.NameDesc"
                        @order="$event(order, true)"
                    ></OrderFieldPart>
                </th>
                <th>
                    <OrderFieldPart
                        :order="order"
                        :name="$t('balance')"
                        :asc="AccountOrderQueryInput.BalanceAsc"
                        :desc="AccountOrderQueryInput.BalanceDesc"
                        @order="$event(order, true)"
                    ></OrderFieldPart>
                </th>
                <th>{{ $t("actions") }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="account of accounts" :key="account.id">
                <td>
                    <input
                        type="checkbox"
                        @click="selector.toggle(account)"
                        :checked="selector.has(account)"
                    />
                </td>
                <td>{{ account.name }}</td>
                <td>
                    <sup>{{ account.currency.symbol }}</sup
                    >{{ toPrettyDecimal(account.balance) }}
                </td>
                <td>
                    <router-link
                        :to="{
                            name: 'dashboard-accounts-account',
                            params: { id: account.id }
                        }"
                    >
                        <button class="button">{{ $t("view") }}</button>
                    </router-link>
                    &nbsp;
                    <button
                        class="button"
                        @click="del(account.id)"
                        :disabled="deleting === account.id"
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
                <td>
                    <button
                        class="button"
                        @click.prevent="deleteSelected"
                        :disabled="!selectorItems.length || deletingSelected"
                    >
                        {{ $t("delete") }}
                    </button>
                </td>
                <td colspan="3">
                    <router-link
                        :to="{
                            name: 'dashboard-accounts-account',
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
    </table>
</template>
