import { config } from "dotenv";
config();

const _config = {
    port: process.env.PORT,
    mongoURI: process.env.MONGODB_URI,
    env: process.env.NODE_ENV,
} as const;
// verify that environment variables are correctly defined
function checkEnvVariables() {
    const requiredEnvVariables = Object.keys(_config);
    for (const variable of requiredEnvVariables) {
        if (!_config[variable as keyof typeof _config]) {
            throw new Error(`Environment variable ${variable} is not set`);
        }
    }
}
checkEnvVariables();

export default _config;
