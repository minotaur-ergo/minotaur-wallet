import { FastifyWithZod } from '@rosen-bridge/fastify-enhanced';
import { Not } from 'typeorm';
import z from 'zod';

import { AppDataSource } from '../database/data-source';
import { Auth } from '../database/entities/auth';
import { User } from '../database/entities/user';

const registerAuth = (fastify: FastifyWithZod) => {
  fastify.post<{ Body: AuthRequest }>(
    '/auth',
    {
      schema: {
        description: 'Create or refresh user authentication public key',
        tags: ['auth'],
        body: AuthRequestSchema,
        response: {
          200: AuthResponseSchema,
          409: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { chainCode, keyData, publicKey } = request.body;

      return AppDataSource.transaction(async (manager) => {
        const userRepository = manager.getRepository(User);
        const authRepository = manager.getRepository(Auth);

        let user = await userRepository.findOneBy({ chainCode, keyData });

        if (!user) {
          user = userRepository.create({ chainCode, keyData });
          user = await userRepository.save(user);
        }

        const existingAuth = await authRepository.findOne({
          where: { publicKey },
          relations: { user: true },
        });

        if (existingAuth && existingAuth.userId !== user.id) {
          return reply.code(409).send({
            message: 'publicKey is already assigned to another user',
          });
        }

        const auth =
          existingAuth ??
          authRepository.create({
            publicKey,
            user,
            userId: user.id,
          });

        auth.updatedAt = new Date();
        const savedAuth = await authRepository.save(auth);

        await authRepository.delete({
          userId: user.id,
          publicKey: Not(publicKey),
        });

        return {
          authId: savedAuth.id,
          userId: user.id,
          publicKey: savedAuth.publicKey,
        };
      });
    },
  );
};

const AuthRequestSchema = z.object({
  chainCode: z.string().min(1),
  keyData: z.string().min(1),
  publicKey: z.string().min(1),
});

type AuthRequest = z.infer<typeof AuthRequestSchema>;

const AuthResponseSchema = {
  content: {
    'application/json': {
      schema: z.object({
        authId: z.number(),
        userId: z.number(),
        publicKey: z.string(),
      }),
    },
  },
};

const ErrorResponseSchema = {
  content: {
    'application/json': {
      schema: z.object({
        message: z.string(),
      }),
    },
  },
};

export default registerAuth;
