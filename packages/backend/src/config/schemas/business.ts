import { z } from 'zod';

export const RecommendationSchema = z.object({
    anonymous: z.object({
        expireTime: z.number().default(7 * 24 * 60 * 60),
        maxCount: z.number().default(100)
    }),
    maxHistory: z.number().default(500),
    decayFactor: z.number().default(0.9),
    relevantThreshold: z.number().default(0.75)
});

export const QueueSchema = z.object({
    concurrencyLimit: z.number().default(5),
    maxRequestToken: z.number().default(20),
    regenerationSpeed: z.number().default(1),
    regenerationInterval: z.number().default(1000),
    maxQueueLength: z.number().default(1000),
    processInterval: z.number().default(100)
});
