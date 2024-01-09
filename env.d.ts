/// <reference types="vite/client" />
interface ImportMetaEnv {
    API_URL?: string;
}

declare namespace NodeJS {
    interface ProcessEnv {
        API_URL?: string;
    }
}
