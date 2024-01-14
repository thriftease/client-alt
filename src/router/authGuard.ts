import { useAuthStore } from "@/stores";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

const authedRedirection = { name: "dashboard" };
const notAuthedRedirection = { name: "auth-sign-in" };

async function authGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) {
    const authStore = useAuthStore();
    if (!authedRedirection && !notAuthedRedirection) return next();

    await authStore.verify();

    // skipAuthCheck if matches and just proceed with the route
    // since we don't want to re-run this route guard again
    if (to.matched.some((record) => record.meta.authed === true)) {
        if (!authStore.signedIn) {
            return next(notAuthedRedirection);
        }
    } else if (to.matched.some((record) => record.meta.authed === false)) {
        if (authStore.signedIn) {
            return next(authedRedirection);
        }
    }
    return next();
}

export default authGuard;
