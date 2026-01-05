import fs from 'fs';
import yaml from 'js-yaml';
import { z } from 'zod';
import { AppConfigSchema, type AppConfig } from './schemas';
import { logger } from '@/lib/logger';

export class ConfigLoader {
    private config: AppConfig | null = null;

    constructor(private configPath: string) {}

    load(): AppConfig {
        if (this.config) {
            return this.config;
        }

        if (!fs.existsSync(this.configPath)) {
            logger.warn(
                `Configuration file not found at ${this.configPath}, using default configuration.`
            );
            this.config = AppConfigSchema.parse({});
            return this.config;
        }

        try {
            const fileContents = fs.readFileSync(this.configPath, 'utf8');
            const rawConfig = yaml.load(fileContents);

            this.config = AppConfigSchema.parse(rawConfig);
            return this.config;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    private handleError(error: unknown) {
        logger.error({ error }, 'Failed to load configuration.');

        if (error instanceof z.ZodError) {
            error.issues.forEach(issue => {
                const path = issue.path.join('.');
                logger.error({ path, message: issue.message }, 'Configuration validation error');
            });
        } else {
            logger.error({ error }, 'Unknown error during configuration loading');
        }

        process.exit(1);
    }
}
