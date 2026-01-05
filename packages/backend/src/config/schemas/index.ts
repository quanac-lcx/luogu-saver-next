import { z } from 'zod';
import { ServerSchema } from './server';
import { DbSchema, RedisSchema, ChromaSchema } from './infrastructure';
import { RecommendationSchema, QueueSchema } from './business';

export const AppConfigSchema = ServerSchema.extend({
    db: DbSchema,
    redis: RedisSchema,
    chroma: ChromaSchema,
    recommendation: RecommendationSchema,
    queue: QueueSchema
});

export type AppConfig = z.infer<typeof AppConfigSchema>;
