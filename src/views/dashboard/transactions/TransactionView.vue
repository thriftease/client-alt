<script setup lang="ts">
import FieldErrorsPart from "@/components/FieldErrorsPart.vue";
import { AccountOrderQueryInput, type AccountType } from "@/gql";
import { transactionRules as originalTransactionRules } from "@/rules";
import {
    useAccountStore,
    useCurrencyStore,
    useTransactionStore
} from "@/stores";
import {
    Dec,
    formatDecimal,
    handleError,
    i18nClient,
    toDecimal,
    toJsDatetime,
    toPrettyDecimal,
    validators
} from "@/utils";
import useVuelidate from "@vuelidate/core";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const currencyStore = useCurrencyStore();
const accountStore = useAccountStore();
const transactionStore = useTransactionStore();

const id = computed(() => +route.params.id);
const type = computed<"transfer" | undefined | null>(() => {
    const typ = route.query.type;
    if (typ === undefined || typ === null) return typ;
    if (typ === "transfer") return typ;
    return undefined;
});

const accounts = ref<AccountType[]>([]);

const data = ref({
    account: "",
    anotherAccount: "",
    datetime: toJsDatetime(new Date()),
    amount: "0.00",
    rate: "1.000",
    name: "",
    description: "",
    tags: [] as string[]
});

const selectedAccount = computed(() =>
    accounts.value.find((e) => e.id === data.value.account)
);
const selectedAnotherAccount = computed(() =>
    accounts.value.find((e) => e.id === data.value.anotherAccount)
);
const anotherAmount = computed(() => {
    try {
        return toDecimal(
            rate.value
                ? new Dec(rate.value)
                      .times(new Dec(data.value.amount))
                      .toFixed(2)
                : "0.00",
            { negative: false }
        );
    } catch (error) {
        return toDecimal("0.00");
    }
});
const rate = computed({
    get: () => {
        if (
            selectedAccount.value &&
            selectedAnotherAccount.value &&
            selectedAccount.value.currency.abbreviation ===
                selectedAnotherAccount.value.currency.abbreviation
        )
            return "1.000";
        return data.value.rate;
    },
    set: (v) => ($v.value.rate.$model = v)
});

const originalData = ref<typeof data.value | undefined>();

const transactionRules = {
    ...originalTransactionRules,
    anotherAccount: {},
    rate: {},
    tags: {}
};

const createRules = {
    ...transactionRules
};

const createTransferRules = {
    ...createRules,
    anotherAccount: {
        ...createRules.account
    },
    amount: {
        ...createRules.amount,
        minValue: validators.minValue(0.01)
    }
};

const updateRules = {
    ...transactionRules
};

const rules =
    id.value > 0
        ? updateRules
        : type.value !== "transfer"
          ? createRules
          : createTransferRules;

const $v = useVuelidate(rules, data);

const transactionTitle = i18nClient.global.t("transaction").toLowerCase();
const addTransactionTitle =
    i18nClient.global.t("add") + " " + transactionTitle;
const addTransferTransactionTitle = [
    i18nClient.global.t("add"),
    i18nClient.global.t("transfer").toLowerCase(),
    transactionTitle
].join(" ");
const viewTransactionTitle = ref(i18nClient.global.t("transaction"));
const title = computed(() =>
    id.value === 0
        ? type.value === "transfer"
            ? addTransferTransactionTitle
            : addTransactionTitle
        : viewTransactionTitle.value
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

            data.value.tags = payload.result.data!.tagSet.map((e) => e.name);

            originalData.value = { ...data.value };

            // viewTransactionTitle.value =
            //     data.value.name +
            //     " " +
            //     viewTransactionTitle.value.toLowerCase();
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
            if (type.value !== "transfer") {
                res = await transactionStore.create({
                    account: data.value.account,
                    amount: data.value.amount,
                    name: data.value.name,
                    description: data.value.description,
                    datetime,
                    tags: data.value.tags
                });
            } else {
                await transactionStore.create({
                    account: data.value.account,
                    amount: `-${data.value.amount}`,
                    name: data.value.name,
                    description: data.value.description,
                    datetime,
                    tags: data.value.tags
                });
                res = await transactionStore.create({
                    account: data.value.anotherAccount,
                    amount: anotherAmount.value,
                    name: data.value.name,
                    description: data.value.description,
                    datetime,
                    tags: data.value.tags
                });
            }
        } else {
            res = await transactionStore.update({
                id: route.params.id as string,
                account: data.value.account,
                amount: data.value.amount,
                name: data.value.name,
                description: data.value.description,
                datetime,
                addTags: data.value.tags,
                removeTags: tagsToRemove.value
            });
        }
        const payload = handleError({
            data: res.payload.value?.result,
            error: res.error.value
        });
        if (payload) {
            router.push({ name: "dashboard-transactions" });
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

function amountOnInput() {
    const input = $v.value.amount;
    let str = data.value.amount;
    input.$model = toDecimal(str, { negative: type.value !== "transfer" });
}

function amountOnBlur() {
    const input = $v.value.amount;
    let str = data.value.amount;
    input.$model = formatDecimal(str, { negative: type.value !== "transfer" });
}

function rateOnInput() {
    const input = rate;
    let str = data.value.rate;
    input.value = toDecimal(str, { negative: false, decimalPlaces: 3 });
}

function rateOnBlur() {
    const input = rate;
    let str = data.value.rate;
    input.value = formatDecimal(str, { negative: false, decimalPlaces: 3 });
}

async function updateRate() {
    const a1 = selectedAccount.value;
    const a2 = selectedAnotherAccount.value;
    if (a1 && a2) {
        const rt = await currencyStore.getRate(
            a1.currency.abbreviation,
            a2.currency.abbreviation
        );
        if (rt !== undefined)
            rate.value = toDecimal("" + rt, { decimalPlaces: 3 });
    }
}

function addTag() {
    data.value.tags.push("");
}

const tagsToRemove = ref<string[]>([]);
function removeTag(index: number) {
    const tag = data.value.tags[index];
    data.value.tags.splice(index, 1);
    if (!tagsToRemove.value.includes(tag)) tagsToRemove.value.push(tag);
}
</script>

<template>
    <h2>{{ title }}</h2>
    <br />

    <form @submit.prevent="submit" novalidate>
        <div>
            <label for="account">{{
                $t(id === 0 && type === "transfer" ? "debitFrom" : "account")
            }}</label>
            <br />
            <select
                id="account"
                name="account"
                :disabled="!accounts.length"
                v-model="$v.account.$model"
                @change="updateRate"
            >
                <option v-if="!accounts.length" value="" hidden selected>
                    {{ $t("noAccounts") }}
                </option>
                <option
                    v-for="account of accounts"
                    :key="account.id"
                    :value="account.id"
                    :disabled="selectedAnotherAccount === account"
                >
                    {{ account.name }}&nbsp;({{ account.currency.symbol
                    }}{{ toPrettyDecimal(account.balance) }})
                </option>
            </select>
            <FieldErrorsPart
                :errors="$v.account.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <div v-if="id === 0 && type === 'transfer'">
            <label for="another-account">{{ $t("creditTo") }}</label>
            <br />
            <select
                id="another-account"
                name="anotherAccount"
                :disabled="!accounts.length"
                v-model="$v.anotherAccount.$model"
                @change="updateRate"
            >
                <option v-if="!accounts.length" value="" hidden selected>
                    {{ $t("noAccounts") }}
                </option>
                <option
                    v-for="account of accounts"
                    :key="account.id"
                    :value="account.id"
                    :disabled="selectedAccount === account"
                >
                    {{ account.name }}&nbsp;({{ account.currency.symbol
                    }}{{ toPrettyDecimal(account.balance) }})
                </option>
            </select>
            <FieldErrorsPart
                :errors="$v.anotherAccount.$errors[0]"
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
            <label for="amount">{{
                $t(
                    id === 0 && type === "transfer"
                        ? "amountToDebit"
                        : "amount"
                )
            }}</label>
            <br />
            <template v-if="selectedAccount">
                <span>{{ selectedAccount.currency.symbol }}</span
                >&nbsp;
            </template>
            <input
                id="amount"
                name="amount"
                type="text"
                inputmode="numeric"
                v-model="$v.amount.$model"
                @input="amountOnInput"
                @blur="amountOnBlur"
            />
            <FieldErrorsPart
                :errors="$v.amount.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <div v-if="id === 0 && type === 'transfer'">
            <label for="rate">{{ $t("amountToCredit") }}</label>
            <br />
            <span>{{ $t("rate") }}</span
            >&nbsp;
            <input
                id="rate"
                name="rate"
                type="text"
                inputmode="numeric"
                v-model="rate"
                :disabled="
                    selectedAccount &&
                    selectedAnotherAccount &&
                    selectedAccount.currency.abbreviation ===
                        selectedAnotherAccount.currency.abbreviation
                "
                style="width: 4em"
                @input="rateOnInput"
                @blur="rateOnBlur"
            />&nbsp;
            <template v-if="selectedAnotherAccount">
                <span>{{ selectedAnotherAccount.currency.symbol }}</span
                >&nbsp;
            </template>
            <input
                type="text"
                disabled
                :value="anotherAmount"
                style="width: 8em"
            />
            <FieldErrorsPart
                :errors="$v.rate.$errors[0]"
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
            <textarea
                id="description"
                name="description"
                cols="20"
                rows="5"
                :maxlength="rules.description.maxLength.$params.max"
                v-model="$v.description.$model"
            ></textarea>
            <FieldErrorsPart
                :errors="$v.description.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <div>
            <label for="tags">{{ $t("tags") }}</label>
            <br />
            <span v-for="(tag, idx) of data.tags" :key="idx">
                <input
                    :id="`tags[${idx}]`"
                    :name="`tags[${idx}]`"
                    type="text"
                    v-model="data.tags[idx]"
                    style="width: 5em"
                />
                <button class="button" @click.prevent="removeTag(idx)">
                    &times;
                </button>
                &nbsp;
            </span>
            <button class="button" @click.prevent="addTag">&plus;</button>
            <FieldErrorsPart
                :errors="$v.description.$errors[0]"
                :hidden="false"
            ></FieldErrorsPart>
        </div>
        <br />
        <div>
            <template v-if="id > 0">
                <button
                    class="button"
                    @click.prevent="del"
                    :disabled="deleting"
                >
                    {{ $t("delete") }}
                </button>
                &nbsp;
            </template>
            <button
                class="button"
                type="submit"
                :disabled="submitting || $v.$invalid || !$v.$anyDirty"
            >
                {{ $t("submit") }}
            </button>
        </div>
    </form>
</template>
