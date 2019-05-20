import * as config from 'config';
import * as SparkPost from 'sparkpost';

export const client: SparkPost | null = config.get('sparkpost.enabled') ? new SparkPost(config.get('sparkpost.apiKey')) : null;
