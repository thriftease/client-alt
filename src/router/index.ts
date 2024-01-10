import { useAuthStore } from "@/stores";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: []
});

let skipAuthCheck = false;
const authedRedirection = undefined;
const notAuthedRedirection = undefined;

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    if (!authedRedirection && !notAuthedRedirection) return next();

    if (skipAuthCheck) {
        skipAuthCheck = false;
        return next();
    }

    await authStore.verify();

    // skipAuthCheck if matches and just proceed with the route
    // since we don't want to re-run this route guard again
    if (to.matched.some((record) => record.meta.authed === true)) {
        if (!authStore.signedIn) {
            skipAuthCheck = true;
            return next(notAuthedRedirection);
        }
    } else if (to.matched.some((record) => record.meta.authed === false)) {
        if (authStore.signedIn) {
            skipAuthCheck = true;
            return next(authedRedirection);
        }
    }
    next();
});

export default router;
