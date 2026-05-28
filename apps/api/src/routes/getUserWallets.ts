import { FastifyWithZod } from '@rosen-bridge/fastify-enhanced';
import z from 'zod';

import { AppDataSource } from '../database/data-source';
import { Auth } from '../database/entities/auth';
import { UserWallet } from '../database/entities/user-wallet';
import { Wallet } from '../database/entities/wallet';

const registerGetUserWallets = (fastify: FastifyWithZod) => {
  fastify.get<{ Querystring: GetUserWalletsRequest }>(
    '/wallets',
    {
      schema: {
        description: 'Get wallets registered for authenticated user',
        tags: ['wallets'],
        querystring: GetUserWalletsRequestSchema,
        response: {
          200: GetUserWalletsResponseSchema,
          401: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const auth = await AppDataSource.getRepository(Auth).findOneBy({
        publicKey: request.query.publicKey,
      });

      if (!auth) {
        return reply.code(401).send({
          message: 'user auth is not valid',
        });
      }

      const userWallets = await AppDataSource.getRepository(UserWallet).find({
        where: { userId: auth.userId },
        relations: { wallet: true },
        order: { id: 'ASC' },
      });

      return {
        userId: auth.userId,
        wallets: userWallets.map(({ wallet }) => toWalletResponse(wallet)),
      };
    },
  );
};

const GetUserWalletsRequestSchema = z.object({
  publicKey: z.string().min(1),
});

type GetUserWalletsRequest = z.infer<typeof GetUserWalletsRequestSchema>;

const WalletResponseSchema = z.object({
  id: z.number(),
  address: z.string(),
  requiredSignatures: z.number(),
  name: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const GetUserWalletsResponseSchema = {
  content: {
    'application/json': {
      schema: z.object({
        userId: z.number(),
        wallets: z.array(WalletResponseSchema),
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

const toWalletResponse = (wallet: Wallet) => ({
  id: wallet.id,
  address: wallet.address,
  requiredSignatures: wallet.requiredSignatures,
  name: wallet.name || null,
  createdAt: wallet.createdAt.toISOString(),
  updatedAt: wallet.updatedAt.toISOString(),
});

export default registerGetUserWallets;
