import { FastifyWithZod } from '@rosen-bridge/fastify-enhanced';
import z from 'zod';

const registerHealth = (fastify: FastifyWithZod) => {
  // Health check route
  fastify.get(
    '/health',
    {
      schema: {
        description: 'Health check endpoint',
        tags: ['health'],
        response: {
          200: HealthResponseSchema,
        },
      },
    },
    async () => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
      };
    },
  );
};

const HealthResponseSchema = {
  content: {
    'application/json': {
      schema: z.object({
        status: z.string(),
        timestamp: z.string(),
      }),
    },
  },
};

export default registerHealth;
