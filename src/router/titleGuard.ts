import type { RouteLocationNormalized } from "vue-router";

const defaultTitle = "ThriftEase";

async function titleGuard(
    to: RouteLocationNormalized,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    from: RouteLocationNormalized
) {
    if (to.meta.title instanceof Function)
        document.title = to.meta.title(to, from);
    else document.title = to.meta.title || defaultTitle;
    return true;
}

export default titleGuard;
export { defaultTitle };
