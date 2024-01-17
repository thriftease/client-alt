<script setup lang="ts">
import FieldErrorsPart from "@/components/FieldErrorsPart.vue";
import { accountRules } from "@/rules";
import { useAccountStore, useCurrencyStore } from "@/stores";
import { handleError, i18nClient } from "@/utils";
import useVuelidate from "@vuelidate/core";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const currencyStore = useCurrencyStore();
const accountStore = useAccountStore();

const id = computed(() => +route.params.id);

const data = ref({
    currency: "",
    name: ""
});

const createRules = {
    ...accountRules
};

const updateRules = {
    ...accountRules
};

const rules = id.value > 0 ? updateRules : createRules;

const $v = useVuelidate(rules, data);

const accountTitle = i18nClient.global.t("account").toLowerCase();
const addAccountTitle = i18nClient.global.t("add") + " " + accountTitle;
const viewAccountTitle = ref(i18nClient.global.t("account"));
const title = computed(() =>
    id.value === 0 ? addAccountTitle : viewAccountTitle.value
);
async function setup() {
    const res = await currencyStore.list({
        options: { fetchPolicy: "network-only" }
    });
    if (res.payload.value) {
        currencies.value = res.payload.value.result.data as CurrencyType[];
        paginatorValue.value = res.payload.value.result.paginator!;
    }

    if (id.value !== 0) {
        const res = await accountStore.get({ id: route.params.id as string });
        const payload = res.payload.value;
        if (payload) {
            $v.value.currency.$model = payload.result.data!.currency.id;
            $v.value.name.$model = payload.result.data!.name;
            $v.value.symbol.$model = payload.result.data!.symbol;

            viewAccountTitle.value =
                data.value.name + " " + viewAccountTitle.value.toLowerCase();
        } else {
            router.replace({
                name: "dashboard-currencies-account",
                params: { id: 0 }
            });
        }
    } else {
        givenCurrencies.value = await accountStore.listGiven();
        const { payload } = await accountStore.list({
            filter: {
                abbreviation_In: givenCurrencies.value.map(
                    (e) => e.abbreviation
                )
            },
            paginator: {
                perPage: givenCurrencies.value.length
            },
            options: {
                fetchPolicy: "network-only"
            }
        });
        if (payload.value?.result.data) {
            takenAbbreviations.value = payload.value.result.data.map(
                (e) => e?.abbreviation!
            );
        }
    }
    document.title = `${document.title} - ${title.value}`;
}
setup();

const submitting = ref(false);
async function submit() {
    submitting.value = true;
    if (await $v.value.$validate()) {
        let res;
        if (id.value === 0) {
            res = await accountStore.create(data.value);
        } else {
            res = await accountStore.update({
                id: route.params.id as string,
                name: data.value.name,
                symbol: data.value.symbol
            });
        }
        const payload = handleError({
            data: res.payload.value?.result,
            error: res.error.value
        });
        if (payload) {
            router.push({ name: "dashboard-currencies" });
        }
    }
    submitting.value = false;
}

const deleting = ref(false);
async function del() {
    deleting.value = true;
    if (confirm(i18nClient.global.t("aboutToDelete"))) {
        const res = await accountStore.delete({
            id: route.params.id as string
        });

        const payload = handleError({
            data: res.payload.value?.result,
            error: res.error.value
        });
        if (payload) {
            router.push({ name: "dashboard-currencies" });
        }
    }
    deleting.value = false;
}

const selectedAccount = ref("");
function selectAccount() {
    if (!selectedAccount.value) return;
    const input = givenCurrencies.value.find(
        (v) => v.abbreviation === selectedAccount.value
    );
    if (input) {
        $v.value.abbreviation.$model = input.abbreviation.toUpperCase();
        $v.value.name.$model = input.name;
        $v.value.symbol.$model = input.symbol.toUpperCase();
    }
    selectedAccount.value = "";
}
</script>

<template>
    <h2>{{ title }}</h2>
    <br />

    <form @submit.prevent="submit" novalidate>
        <template v-if="id === 0">
            <div>
                <select v-model="selectedAccount" @change="selectAccount">
                    <option value="" hidden>
                        {{ $t("preFillAccount") }}
                    </option>
                    <option
                        v-for="account of givenCurrencies"
                        :key="account.abbreviation"
                        :value="account.abbreviation"
                        :disabled="
                            takenAbbreviations.includes(account.abbreviation)
                        "
                    >
                        {{
                            `${account.abbreviation.toUpperCase()}${
                                account.name ? ` - ${account.name}` : ""
                            }`
                        }}
                    </option>
                </select>
            </div>
            <br />
        </template>

        <div>
            <label for="abbreviation">{{ $t("abbreviation") }}</label>
            <br />
            <input
                id="abbreviation"
                name="abbreviation"
                type="text"
                :maxlength="createRules.abbreviation.maxLength.$params.max"
                :readonly="id > 0"
                :disabled="id > 0"
                v-model="$v.abbreviation.$model"
            />
            <FieldErrorsPart
                :errors="$v.abbreviation.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <div>
            <label for="name">{{ $t("name") }}</label>
            <br />
            <input
                id="name"
                name="name"
                type="text"
                :maxlength="rules.name.maxLength.$params.max"
                v-model="$v.name.$model"
            />
            <FieldErrorsPart
                :errors="$v.name.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <div>
            <label for="symbol">{{ $t("symbol") }}</label>
            <br />
            <input
                id="symbol"
                name="symbol"
                type="text"
                :maxlength="rules.symbol.maxLength.$params.max"
                v-model="$v.symbol.$model"
            />
            <FieldErrorsPart
                :errors="$v.symbol.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <br />
        <div>
            <template v-if="id > 0">
                <button @click.prevent="del" :disabled="deleting">
                    {{ $t("delete") }}
                </button>
                &nbsp;
            </template>
            <button
                type="submit"
                :disabled="submitting || $v.$invalid || !$v.$anyDirty"
            >
                {{ $t("submit") }}
            </button>
        </div>
    </form>
</template>
