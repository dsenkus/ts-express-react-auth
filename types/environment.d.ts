declare namespace NodeJS {
    interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production' | 'test';
        readonly APP_PORT: string;
        readonly APP_SITE_URL: string;
        readonly APP_SECURE_COOKIE: string;
        readonly APP_SEND_MAIL: string;
        readonly DB_URI: string;
        readonly REDIS_URI: string;
        readonly REDIS_SECRET: string;
        readonly SPARKPOST_ENABLED: string;
        readonly SPARKPOST_SANDBOX: string;
        readonly SPARKPOST_API_KEY: string;
        readonly LOGGER_LOG_TO_FILE: string;
        readonly LOGGER_LOG_TO_CONSOLE: string;
    }
}
