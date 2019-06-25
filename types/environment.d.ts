declare namespace NodeJS {
    interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production' | 'test';
        readonly APP_PORT: number;
        readonly APP_SITE_URL: string;
        readonly APP_SECURE_COOKIE: boolean;
        readonly APP_SEND_MAIL: boolean;
        readonly DB_URI: string;
        readonly REDIS_ENABLED: boolean;
        readonly REDIS_URI: string;
        readonly REDIS_SECRET: string;
        readonly SPARKPOST_ENABLED: boolean;
        readonly SPARKPOST_SANDBOX: boolean;
        readonly SPARKPOST_API_KEY: string;
        readonly LOGGER_LOG_TO_FILE: boolean;
        readonly LOGGER_LOG_TO_CONSOLE: boolean;
    }
}
