import * as SparkPost from 'sparkpost';

export const client: SparkPost | null = process.env.SPARKPOST_ENABLED === 'true' ? new SparkPost(process.env.SPARKPOST_API_KEY) : null;
