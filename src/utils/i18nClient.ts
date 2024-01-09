import en_US from "@/i18n/en_US.json";
import { createI18n } from "vue-i18n";

const i18nClient = createI18n({
    fallbackLocale: "en-US",
    messages: {
        "en-US": { ...en_US }
    }
});

export default i18nClient;
