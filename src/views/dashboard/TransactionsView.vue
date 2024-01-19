<script setup lang="ts">
import FilterPart from "@/components/FilterPart.vue";
import PaginatorPart from "@/components/PaginatorPart.vue";
import {
    TransactionOperation,
    TransactionOrderQueryInput,
    type PaginatorType,
    type TransactionType
} from "@/gql";
import router from "@/router";
import { useTransactionStore } from "@/stores";
import {
    handleError,
    i18nClient,
    toPrettyDatetime,
    useSelector
} from "@/utils";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const transactionStore = useTransactionStore();

const paginator = ref<InstanceType<typeof PaginatorPart>>();
const filter = ref<InstanceType<typeof FilterPart>>();
// const order = ref(getQueryOrder<TransactionOrderQueryInput>(route.query));

const transactions = ref<TransactionType[]>([]);
const paginatorValue = ref<PaginatorType>();

const {
    items: selectorItems,
    selectedAll: selectorSelectedAll,
    ...selector
} = useSelector(transactions, (e) => e.id);

async function setup() {
    const res = await transactionStore.list({
        paginator: paginator.value?.query,
        filter: filter.value?.record,
        order: [
            TransactionOrderQueryInput.DatetimeDesc,
            TransactionOrderQueryInput.IdDesc
        ],
        options: { fetchPolicy: "network-only" }
    });
    if (res.payload.value) {
        transactions.value = res.payload.value.result
            .data as TransactionType[];
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
        const res = await transactionStore.delete({ id });

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
        selectorItems.value.map((e) => transactionStore.delete({ id: e.id }))
    );
    await promise;
    router.go(0);
    deletingSelected.value = false;
}
</script>

<template>
    <h2>{{ $t("transactions") }}</h2>
    <br />
    <table>
        <thead>
            <!-- <tr>
                <td colspan="7">
                    <FilterPart
                        ref="filter"
                        :filters="[['name_Icontains', $t('name')]]"
                    ></FilterPart>
                </td>
            </tr> -->
            <tr>
                <th>
                    <input type="checkbox" v-model="selectorSelectedAll" />
                </th>
                <th>{{ $t("account") }}</th>
                <th>{{ $t("datetime") }}</th>
                <th>{{ $t("amount") }}</th>
                <th>{{ $t("accountBalance") }}</th>
                <th>{{ $t("details") }}</th>
                <th>{{ $t("tags") }}</th>
                <th>{{ $t("actions") }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="transaction of transactions" :key="transaction.id">
                <td>
                    <input
                        type="checkbox"
                        @click="selector.toggle(transaction)"
                        :checked="selector.has(transaction)"
                    />
                </td>
                <td>{{ transaction.account.name }}</td>
                <td>
                    <small>{{ toPrettyDatetime(transaction.datetime) }}</small>
                </td>
                <td
                    :style="{
                        color: transaction.scheduled
                            ? 'gray'
                            : transaction.operation ===
                                TransactionOperation.Debit
                              ? 'red'
                              : 'green'
                    }"
                >
                    <sup>{{ transaction.account.currency.symbol }}</sup
                    >{{ transaction.amount }}
                </td>
                <td>
                    <sup>{{ transaction.account.currency.symbol }}</sup
                    >{{
                        transaction.oldAccountBalance
                    }}&nbsp;&rarr;&nbsp;<sup>{{
                        transaction.account.currency.symbol
                    }}</sup
                    >{{ transaction.newAccountBalance }}
                </td>
                <td>
                    <strong v-if="transaction.name">{{
                        transaction.name
                    }}</strong>
                    <div v-if="transaction.description">
                        <em>
                            {{ transaction.description }}
                        </em>
                    </div>
                </td>
                <td>
                    {{ transaction.tagSet.map((e) => e.name).join(", ") }}
                </td>
                <td>
                    <router-link
                        :to="{
                            name: 'dashboard-transactions-transaction',
                            params: { id: transaction.id }
                        }"
                    >
                        <button>{{ $t("view") }}</button>
                    </router-link>
                    &nbsp;
                    <button
                        @click="del(transaction.id)"
                        :disabled="deleting === transaction.id"
                    >
                        {{ $t("delete") }}
                    </button>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="7">
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
                <td colspan="7">
                    <router-link
                        :to="{
                            name: 'dashboard-transactions-transaction',
                            params: { id: 0 },
                            query: { type: 'transfer' }
                        }"
                    >
                        <button style="width: 25%">
                            {{ $t("transfer") }}
                        </button>
                    </router-link>
                    <router-link
                        :to="{
                            name: 'dashboard-transactions-transaction',
                            params: { id: 0 }
                        }"
                    >
                        <button style="width: 75%">{{ $t("add") }}</button>
                    </router-link>
                </td>
            </tr>
        </tfoot>
    </table>
</template>
