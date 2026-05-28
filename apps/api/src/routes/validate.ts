import { FastifyWithZod } from '@rosen-bridge/fastify-enhanced';
import z from 'zod';

import { AppDataSource } from '../database/data-source';
import { Auth } from '../database/entities/auth';

const registerValidateAuth = (fastify: FastifyWithZod) => {
  fastify.post<{ Body: ValidateAuthRequest }>(
    '/auth/validate',
    {
      schema: {
        description: 'Check whether user authentication is valid',
        tags: ['auth'],
        body: ValidateAuthRequestSchema,
        response: {
          200: ValidateAuthResponseSchema,
        },
      },
    },
    async (request) => {
      const auth = await AppDataSource.getRepository(Auth).findOneBy({
        publicKey: request.body.publicKey,
      });

      return {
        valid: Boolean(auth),
        userId: auth?.userId ?? null,
      };
    },
  );
};

const ValidateAuthRequestSchema = z.object({
  publicKey: z.string().min(1),
});

type ValidateAuthRequest = z.infer<typeof ValidateAuthRequestSchema>;

const ValidateAuthResponseSchema = {
  content: {
    'application/json': {
      schema: z.object({
        valid: z.boolean(),
        userId: z.number().nullable(),
      }),
    },
  },
};

export default registerValidateAuth;
