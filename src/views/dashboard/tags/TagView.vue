<script setup lang="ts">
import FieldErrorsPart from "@/components/FieldErrorsPart.vue";
import {
    CurrencyOrderQueryInput,
    type CurrencyType,
    type GivenCurrencyType
} from "@/gql";
import { tagRules as originalTagRules } from "@/rules";
import { useCurrencyStore, useTagStore } from "@/stores";
import { handleError, i18nClient } from "@/utils";
import useVuelidate from "@vuelidate/core";
import { helpers, not } from "@vuelidate/validators";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const { withAsync, withMessage } = helpers;

const router = useRouter();
const route = useRoute();
const currencyStore = useCurrencyStore();
const tagStore = useTagStore();

const id = computed(() => +route.params.id);

const takenAbbreviations = ref<string[]>([]);
const givenCurrencies = ref<GivenCurrencyType[]>([]);

const currencies = ref<CurrencyType[]>([]);

const data = ref({
    name: ""
});

const originalData = ref<typeof data.value | undefined>();

async function tagExisting(name: string) {
    if (originalData.value) {
        if (originalData.value.name === name) return false;
    }
    const res = await tagStore.existing(name, {
        fetchPolicy: "network-only"
    });
    return res.payload.value?.result === true;
}

const tagRules = {
    ...originalTagRules
};

const createRules = {
    ...tagRules
};

const updateRules = {
    ...tagRules
};

const rules = id.value > 0 ? updateRules : createRules;

const $v = useVuelidate(rules, data);
const $v2 = useVuelidate(
    {
        tag: {
            notExisting: withMessage(
                i18nClient.global.t("validations.tagNotExisting"),
                withAsync(not(tagExisting))
            )
        }
    },
    computed((): { tag: string } => {
        return { tag: $v.value.name.$model };
    })
);

const tagTitle = i18nClient.global.t("tag").toLowerCase();
const addTagTitle = i18nClient.global.t("add") + " " + tagTitle;
const viewTagTitle = ref(i18nClient.global.t("tag"));
const title = computed(() =>
    id.value === 0 ? addTagTitle : viewTagTitle.value
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
        const res = await tagStore.get({ id: route.params.id as string });
        const payload = res.payload.value;
        if (payload) {
            $v.value.name.$model = payload.result.data!.name;

            originalData.value = { ...data.value };

            viewTagTitle.value =
                data.value.name + " " + viewTagTitle.value.toLowerCase();
        } else {
            router.replace({
                name: "dashboard-tags-tag",
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
        let res;
        if (id.value === 0) {
            res = await tagStore.create({ ...data.value });
        } else {
            res = await tagStore.update({
                id: route.params.id as string,
                name: data.value.name
            });
        }
        const payload = handleError({
            data: res.payload.value?.result,
            error: res.error.value
        });
        if (payload) {
            router.push({ name: "dashboard-tags" });
        }
    }
    submitting.value = false;
}

const deleting = ref(false);
async function del() {
    deleting.value = true;
    if (confirm(i18nClient.global.t("aboutToDelete"))) {
        const res = await tagStore.delete({
            id: route.params.id as string
        });

        const payload = handleError({
            data: res.payload.value?.result,
            error: res.error.value
        });
        if (payload) {
            router.push({ name: "dashboard-tags" });
        }
    }
    deleting.value = false;
}
</script>

<template>
    <h2>
        <router-link :to="{ name: 'dashboard-tags' }">{{
            $t("tags")
        }}</router-link
        >&nbsp;/&nbsp;{{ title }}
    </h2>
    <br />

    <form class="container max-w-md" @submit.prevent="submit" novalidate>
        <div class="field">
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
                :errors="$v.name.$errors[0] || $v2.tag.$errors[0]"
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
                :disabled="
                    submitting ||
                    $v.$invalid ||
                    ($v2.tag.$anyDirty && $v2.$invalid) ||
                    !$v.$anyDirty
                "
            >
                {{ $t("submit") }}
            </button>
        </div>
    </form>
</template>

<style scoped lang="pcss">
h2 {
    @apply mt-0 !important;
}

input,
select {
    @apply w-full;
}

form > div:last-child {
    @apply text-right;
}
</style>
