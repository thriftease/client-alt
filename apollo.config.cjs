/* eslint-env node */
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    client: {
        service: {
            name: "thriftease-client",
            // URL to the GraphQL API
            url: process.env.API_URL
        },
        // Files processed by the extension
        includes: ["src/**/*.vue", "src/**/*.js", "src/**/*.ts"]
    }
};
