import { FastifyWithZod } from '@rosen-bridge/fastify-enhanced';
import z from 'zod';

import { AppDataSource } from '../database/data-source';
import { Auth } from '../database/entities/auth';
import { UserWallet } from '../database/entities/user-wallet';
import { Wallet } from '../database/entities/wallet';

const registerUnregisterWallet = (fastify: FastifyWithZod) => {
  fastify.delete<{ Body: UnregisterWalletRequest }>(
    '/register',
    {
      schema: {
        description: 'Unregister a wallet from authenticated user',
        tags: ['wallets'],
        body: UnregisterWalletRequestSchema,
        response: {
          200: UnregisterWalletResponseSchema,
          401: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { address, publicKey } = request.body;

      const auth = await AppDataSource.getRepository(Auth).findOneBy({
        publicKey,
      });

      if (!auth) {
        return reply.code(401).send({
          message: 'user auth is not valid',
        });
      }

      const wallet = await AppDataSource.getRepository(Wallet).findOneBy({
        address,
      });

      if (!wallet) {
        return {
          unregistered: false,
          userId: auth.userId,
          walletId: null,
        };
      }

      const result = await AppDataSource.getRepository(UserWallet).delete({
        userId: auth.userId,
        walletId: wallet.id,
      });

      return {
        unregistered: Boolean(result.affected),
        userId: auth.userId,
        walletId: wallet.id,
      };
    },
  );
};

const UnregisterWalletRequestSchema = z.object({
  publicKey: z.string().min(1),
  address: z.string().min(1),
});

type UnregisterWalletRequest = z.infer<typeof UnregisterWalletRequestSchema>;

const UnregisterWalletResponseSchema = {
  content: {
    'application/json': {
      schema: z.object({
        unregistered: z.boolean(),
        userId: z.number(),
        walletId: z.number().nullable(),
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

export default registerUnregisterWallet;
