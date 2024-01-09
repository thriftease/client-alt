import "./assets/main.css";

import { createPinia } from "pinia";
import { createApp, h, provide } from "vue";

import App from "./App.vue";
import router from "./router";

import { apolloClient, i18nClient } from "@/utils";
import { DefaultApolloClient } from "@vue/apollo-composable";

const app = createApp({
    setup() {
        provide(DefaultApolloClient, apolloClient);
    },

    render: () => h(App)
});

app.use(i18nClient);
app.use(createPinia());
app.use(router);

app.mount("#app");
