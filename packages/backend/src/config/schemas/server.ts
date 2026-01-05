import { z } from 'zod';

export const ServerSchema = z.object({
    port: z.number().default(3000),
    env: z.string().default('development'),
    network: z.object({
        timeout: z.number().default(30000)
    })
});
