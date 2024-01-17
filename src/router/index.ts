import authGuard from "@/router/authGuard";
import titleGuard, { defaultTitle } from "@/router/titleGuard";
import { i18nClient } from "@/utils";
import { createRouter, createWebHistory } from "vue-router";

function getTitle(title?: string) {
    if (!title) return defaultTitle;
    return `${defaultTitle} - ${title}`;
}

const $t = i18nClient.global.t;

const idRegex = "(new|0|[1-9]\\d*)";

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
            meta: { authed: false },
            component: () => import("@/views/AuthView.vue"),
            children: [
                {
                    path: "",
                    name: "auth",
                    redirect: { name: "auth-sign-in" }
                },
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
                },
                {
                    path: "reset",
                    name: "auth-reset",
                    meta: {
                        title: (to) =>
                            getTitle(
                                $t(
                                    !to.query.token
                                        ? "sendReset"
                                        : "applyReset"
                                )
                            )
                    },
                    component: () => import("@/views/auth/ResetView.vue")
                }
            ]
        },
        {
            path: "/dashboard",
            meta: { authed: true },
            component: () => import("@/views/DashboardView.vue"),
            children: [
                {
                    path: "",
                    name: "dashboard",
                    redirect: { name: "dashboard-currencies" }
                },
                {
                    path: "currencies",
                    name: "dashboard-currencies",
                    meta: { title: getTitle($t("currencies")) },
                    component: () =>
                        import("@/views/dashboard/CurrenciesView.vue")
                },
                {
                    path: `currencies/:id${idRegex}`,
                    name: "dashboard-currencies-currency",
                    meta: { title: getTitle() },
                    component: () =>
                        import("@/views/dashboard/currencies/CurrencyView.vue")
                },
                {
                    path: "accounts",
                    name: "dashboard-accounts",
                    meta: { title: getTitle($t("accounts")) },
                    component: () =>
                        import("@/views/dashboard/AccountsView.vue")
                },
                {
                    path: `accounts/:id${idRegex}`,
                    name: "dashboard-accounts-account",
                    meta: { title: getTitle() },
                    component: () =>
                        import("@/views/dashboard/accounts/AccountView.vue")
                }
            ]
        }
    ]
});

router.beforeEach(authGuard);
router.beforeEach(titleGuard);

export default router;
