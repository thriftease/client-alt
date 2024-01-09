import "./assets/main.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

import { i18nClient } from "@/utils";

const app = createApp(App);

app.use(i18nClient);
app.use(createPinia());
app.use(router);

app.mount("#app");
