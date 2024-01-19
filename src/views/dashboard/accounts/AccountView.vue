<script setup lang="ts">
import FieldErrorsPart from "@/components/FieldErrorsPart.vue";
import {
    CurrencyOrderQueryInput,
    type CurrencyType,
    type GivenCurrencyType
} from "@/gql";
import { accountRules as originalAccountRules } from "@/rules";
import { useAccountStore, useCurrencyStore } from "@/stores";
import { handleError, i18nClient } from "@/utils";
import useVuelidate from "@vuelidate/core";
import { helpers, not } from "@vuelidate/validators";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const { withAsync, withMessage } = helpers;

const router = useRouter();
const route = useRoute();
const currencyStore = useCurrencyStore();
const accountStore = useAccountStore();

const id = computed(() => +route.params.id);

const takenAbbreviations = ref<string[]>([]);
const givenCurrencies = ref<GivenCurrencyType[]>([]);

const currencies = ref<CurrencyType[]>([]);

const data = ref({
    currency: "",
    name: ""
});

const originalData = ref<typeof data.value | undefined>();

async function accountExisting([currency, name]: [string, string]) {
    if (originalData.value) {
        if (
            originalData.value.currency === currency &&
            originalData.value.name === name
        )
            return false;
    }
    const res = await accountStore.existing(currency, name, {
        fetchPolicy: "network-only"
    });
    return res.payload.value?.result === true;
}

const accountRules = {
    ...originalAccountRules
};

const createRules = {
    ...accountRules
};

const updateRules = {
    ...accountRules
};

const rules = id.value > 0 ? updateRules : createRules;

const $v = useVuelidate(rules, data);
const $v2 = useVuelidate(
    {
        account: {
            notExisting: withMessage(
                i18nClient.global.t("validations.accountNotExisting"),
                withAsync(not(accountExisting))
            )
        }
    },
    computed((): { account: [string, string] } => {
        return { account: [$v.value.currency.$model, $v.value.name.$model] };
    })
);

const accountTitle = i18nClient.global.t("account").toLowerCase();
const addAccountTitle = i18nClient.global.t("add") + " " + accountTitle;
const viewAccountTitle = ref(i18nClient.global.t("account"));
const title = computed(() =>
    id.value === 0 ? addAccountTitle : viewAccountTitle.value
);
async function setup() {
    const res = await currencyStore.list({
        order: [CurrencyOrderQueryInput.AbbreviationAsc],
        paginator: { perPage: 999 },
        options: { fetchPolicy: "network-only" }
    });
    if (res.payload.value) {
        currencies.value = res.payload.value.result.data as CurrencyType[];
    }

    givenCurrencies.value = (await currencyStore.listGivenAlt()).payload.value
        ?.result!;
    takenAbbreviations.value = currencies.value.map((e) => e?.abbreviation!);

    if (id.value !== 0) {
        const res = await accountStore.get({ id: route.params.id as string });
        const payload = res.payload.value;
        if (payload) {
            $v.value.currency.$model = payload.result.data!.currency.id;
            $v.value.name.$model = payload.result.data!.name;

            originalData.value = { ...data.value };

            viewAccountTitle.value =
                data.value.name + " " + viewAccountTitle.value.toLowerCase();
        } else {
            router.replace({
                name: "dashboard-accounts-account",
                params: { id: 0 }
            });
        }
    }
    document.title = `${document.title} - ${title.value}`;
}
setup();

const submitting = ref(false);
async function submit() {
    submitting.value = true;
    if ((await $v.value.$validate()) && (await $v2.value.$validate())) {
        let currency = data.value.currency;
        if (isNaN(+currency)) {
            const gcurrency = givenCurrencies.value.find(
                (e) => e.abbreviation === currency
            );
            if (!gcurrency) {
                submitting.value = false;
                return;
            }
            const res = await currencyStore.create({
                abbreviation: gcurrency.abbreviation,
                name: gcurrency.name,
                symbol: gcurrency.symbol
            });
            currency = res.payload.value!.result.data!.id;
        }

        let res;
        if (id.value === 0) {
            res = await accountStore.create({ ...data.value, currency });
        } else {
            res = await accountStore.update({
                id: route.params.id as string,
                currency,
                name: data.value.name
            });
        }
        const payload = handleError({
            data: res.payload.value?.result,
            error: res.error.value
        });
        if (payload) {
            router.push({ name: "dashboard-accounts" });
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
            router.push({ name: "dashboard-accounts" });
        }
    }
    deleting.value = false;
}
</script>

<template>
    <h2>{{ title }}</h2>
    <br />

    <form @submit.prevent="submit" novalidate>
        <div>
            <label for="currency">{{ $t("currency") }}</label>
            <br />
            <select
                id="currency"
                name="currency"
                :disabled="!currencies.length && !givenCurrencies.length"
                v-model="$v.currency.$model"
            >
                <option
                    v-if="!currencies.length && !givenCurrencies.length"
                    value=""
                    hidden
                    selected
                >
                    {{ $t("noCurrencies") }}
                </option>
                <optgroup
                    v-if="currencies.length"
                    :label="$t('createdCurrencies')"
                >
                    <option
                        v-for="currency of currencies"
                        :key="currency.abbreviation"
                        :value="currency.id"
                    >
                        {{
                            `${currency.abbreviation.toUpperCase()}${
                                currency.name ? ` - ${currency.name}` : ""
                            }`
                        }}
                    </option>
                </optgroup>
                <optgroup
                    v-if="givenCurrencies.length"
                    :label="$t('givenCurrencies')"
                >
                    <option
                        v-for="currency of givenCurrencies"
                        :key="currency.abbreviation"
                        :value="currency.abbreviation"
                        :disabled="
                            takenAbbreviations.includes(currency.abbreviation)
                        "
                    >
                        {{
                            `${currency.abbreviation.toUpperCase()}${
                                currency.name ? ` - ${currency.name}` : ""
                            }`
                        }}
                    </option>
                </optgroup>
            </select>
            <FieldErrorsPart
                :errors="$v.currency.$errors[0]"
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
                :errors="$v.name.$errors[0] || $v2.account.$errors[0]"
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
                :disabled="
                    submitting ||
                    $v.$invalid ||
                    ($v2.account.$anyDirty && $v2.$invalid) ||
                    !$v.$anyDirty
                "
            >
                {{ $t("submit") }}
            </button>
        </div>
    </form>
</template>
