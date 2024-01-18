<script setup lang="ts">
import FieldErrorsPart from "@/components/FieldErrorsPart.vue";
import { AccountOrderQueryInput, type AccountType } from "@/gql";
import { transactionRules as originalTransactionRules } from "@/rules";
import { useAccountStore, useTransactionStore } from "@/stores";
import { handleError, i18nClient, toJsDatetime } from "@/utils";
import useVuelidate from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const { withAsync, withMessage } = helpers;

const router = useRouter();
const route = useRoute();
const accountStore = useAccountStore();
const transactionStore = useTransactionStore();

const id = computed(() => +route.params.id);

const accounts = ref<AccountType[]>([]);

const data = ref({
    account: "",
    datetime: toJsDatetime(new Date()),
    amount: "0.00",
    name: "",
    description: ""
});

const originalData = ref<typeof data.value | undefined>();

const transactionRules = {
    ...originalTransactionRules
};

const createRules = {
    ...transactionRules
};

const updateRules = {
    ...transactionRules
};

const rules = id.value > 0 ? updateRules : createRules;

const $v = useVuelidate(rules, data);

const transactionTitle = i18nClient.global.t("transaction").toLowerCase();
const addTransactionTitle =
    i18nClient.global.t("add") + " " + transactionTitle;
const viewTransactionTitle = ref(i18nClient.global.t("transaction"));
const title = computed(() =>
    id.value === 0 ? addTransactionTitle : viewTransactionTitle.value
);
async function setup() {
    const res = await accountStore.list({
        order: [AccountOrderQueryInput.NameAsc],
        paginator: { perPage: 999 },
        options: { fetchPolicy: "network-only" }
    });
    if (res.payload.value) {
        accounts.value = res.payload.value.result.data as AccountType[];
    }

    if (id.value !== 0) {
        const res = await transactionStore.get({
            id: route.params.id as string
        });
        const payload = res.payload.value;
        if (payload) {
            $v.value.account.$model = payload.result.data!.account.id;
            $v.value.datetime.$model = toJsDatetime(
                new Date(payload.result.data!.datetime)
            );
            $v.value.amount.$model = payload.result.data!.amount;
            $v.value.name.$model = payload.result.data!.name;
            $v.value.description.$model = payload.result.data!.description;

            originalData.value = { ...data.value };

            viewTransactionTitle.value =
                data.value.name +
                " " +
                viewTransactionTitle.value.toLowerCase();
        } else {
            router.replace({
                name: "dashboard-transactions-transaction",
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
    if (await $v.value.$validate()) {
        let res;
        const datetime = data.value.datetime;
        if (id.value === 0) {
            res = await transactionStore.create({ ...data.value, datetime });
        } else {
            res = await transactionStore.update({
                id: route.params.id as string,
                ...data.value,
                datetime
            });
        }
        const payload = handleError({
            data: res.payload.value?.result,
            error: res.error.value
        });
        if (payload) {
            // router.push({ name: "dashboard-transactions" });
            console.log(payload);
        }
    }
    submitting.value = false;
}

const deleting = ref(false);
async function del() {
    deleting.value = true;
    if (confirm(i18nClient.global.t("aboutToDelete"))) {
        const res = await transactionStore.delete({
            id: route.params.id as string
        });

        const payload = handleError({
            data: res.payload.value?.result,
            error: res.error.value
        });
        if (payload) {
            router.push({ name: "dashboard-transactions" });
        }
    }
    deleting.value = false;
}

function restrictInputAmount() {
    const input = $v.value.amount;
    let str = data.value.amount;
    input.$model = str.replace(/[^0-9\-.]/g, "");

    const sign = "-";
    const dot = ".";

    if (str.length > 1) {
        const substr = str.substring(1);
        if (substr.includes(sign)) {
            input.$model = str[0] + substr.replace(sign, "");
        }
    }

    const dotIdx = str.indexOf(dot);
    if (dotIdx !== -1) {
        {
            const substr = str.substring(dotIdx + 1);
            if (substr.includes(dot)) {
                input.$model =
                    str.substring(0, dotIdx + 1) + substr.replace(dot, "");
            }
        }
        {
            const substr = str.substring(dotIdx + 1);
            if (substr.length > 2) {
                input.$model =
                    str.substring(0, dotIdx + 1) + substr.substring(0, 2);
            }
        }
    } else if (str.length > 0) {
        const matches = str.match(/\d/g);
        if (matches && matches.length === 17) {
            const startIdx = str[0] === sign ? 1 : 0;
            const endIdx = startIdx + (matches.length - 1);
            input.$model =
                str.substring(0, endIdx) + "." + str.substring(endIdx + 1);
        }
    }
}

function restrictAmount() {
    const maxDigits = 18;
    // const decimalPlaces = 2;
    // const leftDigits = maxDigits - 2 - decimalPlaces;
    // const maxVal = new Dec("9".repeat(leftDigits) + "." + "9".repeat(decimalPlaces));
    // const minVal = new Dec("-" + maxVal);

    // const amount = data.value.amount;
    // if (!amount.includes(".")) {
    //     $v.value.amount.$model = amount + "." + "0".repeat(decimalPlaces);
    //     restrictAmount();
    // } else {
    //     let [left, right] = amount.split(".");
    //     left = left.substring(left.length - leftDigits, left.length);
    //     right = right.substring(0, decimalPlaces);
    //     if (right.length !== decimalPlaces)
    //         right = right + "0".repeat(decimalPlaces - right.length);
    //     $v.value.amount.$model = left + "." + right;
    // }
}
</script>

<template>
    <h2>{{ title }}</h2>
    <br />

    <form @submit.prevent="submit" novalidate>
        <div>
            <label for="account">{{ $t("account") }}</label>
            <br />
            <select
                id="account"
                name="account"
                :disabled="!accounts.length"
                v-model="$v.account.$model"
            >
                <option v-if="!accounts.length" value="" hidden selected>
                    {{ $t("noAccounts") }}
                </option>
                <option
                    v-for="account of accounts"
                    :key="account.id"
                    :value="account.id"
                >
                    {{ account.name }}
                </option>
            </select>
            <FieldErrorsPart
                :errors="$v.account.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <div>
            <label for="datetime">{{ $t("datetime") }}</label>
            <br />
            <input
                id="datetime"
                name="datetime"
                type="datetime-local"
                v-model="$v.datetime.$model"
            />
            <FieldErrorsPart
                :errors="$v.datetime.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <div>
            <label for="amount">{{ $t("amount") }}</label>
            <br />
            <input
                id="amount"
                name="amount"
                type="text"
                inputmode="numeric"
                v-model="$v.amount.$model"
                @input="restrictInputAmount"
                @blur="restrictAmount"
            />
            <FieldErrorsPart
                :errors="$v.amount.$errors[0]"
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
            <label for="description">{{ $t("description") }}</label>
            <br />
            <input
                id="description"
                name="description"
                type="text"
                :maxlength="rules.description.maxLength.$params.max"
                v-model="$v.description.$model"
            />
            <FieldErrorsPart
                :errors="$v.description.$errors[0]"
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
