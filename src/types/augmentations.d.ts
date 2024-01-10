export {};

declare module "vue-router" {
    interface RouteMeta {
        authed?: boolean;
        title?: string;
    }
}
