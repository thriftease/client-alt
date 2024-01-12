import authGuard from "@/router/authGuard";
import titleGuard, { defaultTitle } from "@/router/titleGuard";
import { i18nClient } from "@/utils";
import { createRouter, createWebHistory } from "vue-router";

function getTitle(title?: string) {
    if (!title) return defaultTitle;
    return `${defaultTitle} - ${title}`;
}

const $t = i18nClient.global.t;

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "index",
            redirect: { name: "auth-sign-in" }
        },
        {
            path: "/auth",
            name: "auth",
            meta: { authed: false },
            component: () => import("@/views/AuthView.vue"),
            children: [
                {
                    path: "sign-in",
                    name: "auth-sign-in",
                    meta: { title: getTitle($t("signIn")) },
                    component: () => import("@/views/auth/SignInView.vue")
                },
                {
                    path: "sign-up",
                    name: "auth-sign-up",
                    meta: { title: getTitle($t("signUp")) },
                    component: () => import("@/views/auth/SignUpView.vue")
                }
            ]
        }
    ]
});

router.beforeEach(authGuard);
router.beforeEach(titleGuard);

export default router;
