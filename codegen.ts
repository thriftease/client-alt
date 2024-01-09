import type { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";

dotenv.config();

const config: CodegenConfig = {
    schema: process.env.API_URL,
    generates: {
        "./src/gql/types.d.ts": {
            plugins: [
                "typescript",
                "typescript-operations",
                "typescript-vue-apollo"
            ]
        }
    }
};

export default config;
