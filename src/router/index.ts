import authGuard from "@/router/authGuard";
import { createRouter, createWebHistory } from "vue-router";

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
                    path: "/sign-in",
                    name: "auth-sign-in",
                    component: () => import("@/views/auth/SignInView.vue")
                }
            ]
        }
    ]
});

router.beforeEach(authGuard);

export default router;
