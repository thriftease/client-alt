<script setup lang="ts">
import FieldErrorsPart from "@/components/FieldErrorsPart.vue";
import type { CreateCurrencyMutationInput } from "@/gql";
import { currencyRules } from "@/rules";
import { useCurrencyStore } from "@/stores";
import { handleError, i18nClient } from "@/utils";
import useVuelidate from "@vuelidate/core";
import { helpers, not } from "@vuelidate/validators";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const { withAsync, withMessage } = helpers;

const router = useRouter();
const route = useRoute();
const currencyStore = useCurrencyStore();

const id = computed(() => +route.params.id);

const takenAbbreviations = ref<string[]>([]);
const givenCurrencies = ref<CreateCurrencyMutationInput[]>([]);

const data = ref({
    abbreviation: "",
    name: "",
    symbol: ""
});

async function abbreviationExisting(value: string) {
    const res = await currencyStore.list({
        filter: { abbreviation_Iexact: value },
        paginator: { perPage: 1 },
        options: { fetchPolicy: "network-only" }
    });
    return res.payload.value?.result.data.length == 1;
}

const createRules = {
    ...currencyRules,
    abbreviation: {
        ...currencyRules.abbreviation,
        notExisting: withMessage(
            i18nClient.global.t("validations.abbreviationNotExisting"),
            withAsync(not(abbreviationExisting))
        )
    }
};

const updateRules = {
    ...currencyRules,
    abbreviation: {}
};

const rules = id.value > 0 ? updateRules : createRules;

const $v = useVuelidate(rules, data);

async function setup() {
    if (id.value !== 0) {
        const res = await currencyStore.get({ id: route.params.id as string });
        const payload = res.payload.value;
        if (payload) {
            $v.value.abbreviation.$model =
                payload.result.data!.abbreviation.toUpperCase();
            $v.value.name.$model = payload.result.data!.name;
            $v.value.symbol.$model = payload.result.data!.symbol;
        } else {
            router.replace({
                name: "dashboard-currencies-currency",
                params: { id: 0 }
            });
        }
    } else {
        givenCurrencies.value = await currencyStore.listGiven();
        const { payload } = await currencyStore.list({
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
}
setup();

const submitting = ref(false);
async function submit() {
    submitting.value = true;
    if (await $v.value.$validate()) {
        let res;
        if (id.value === 0) {
            res = await currencyStore.create(data.value);
        } else {
            res = await currencyStore.update({
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
        const res = await currencyStore.delete({
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

const selectedCurrency = ref("");
function selectCurrency() {
    if (!selectedCurrency.value) return;
    const input = givenCurrencies.value.find(
        (v) => v.abbreviation === selectedCurrency.value
    );
    if (input) {
        $v.value.abbreviation.$model = input.abbreviation.toUpperCase();
        $v.value.name.$model = input.name;
        $v.value.symbol.$model = input.symbol.toUpperCase();
    }
    selectedCurrency.value = "";
}
</script>

<template>
    <h2>{{ $t("currency") }}</h2>
    <br />

    <form @submit.prevent="submit" novalidate>
        <template v-if="id === 0">
            <div>
                <select v-model="selectedCurrency" @change="selectCurrency">
                    <option value="" hidden>
                        {{ $t("preFillCurrency") }}
                    </option>
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
