export {};

declare module "vue-router" {
    interface RouteMeta {
        authed?: boolean;
        title?:
            | string
            | ((
                  to: RouteLocationNormalized,
                  from: RouteLocationNormalized
              ) => string);
    }
}
