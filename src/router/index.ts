import authGuard from "@/router/authGuard";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: []
});

router.beforeEach(authGuard);

export default router;
