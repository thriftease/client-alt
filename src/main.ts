import "./assets/main.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import router from "./router";

import AppVue from "@/App.vue";
import { apolloClient, i18nClient } from "@/utils";
import { DefaultApolloClient } from "@vue/apollo-composable";

const app = createApp(AppVue);

app.provide(DefaultApolloClient, apolloClient);

app.use(i18nClient);
app.use(createPinia());
app.use(router);

app.mount("#app");
