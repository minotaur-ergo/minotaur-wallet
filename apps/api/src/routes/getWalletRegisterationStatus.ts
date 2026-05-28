import { FastifyWithZod } from '@rosen-bridge/fastify-enhanced';
import z from 'zod';

import { AppDataSource } from '../database/data-source';
import { Auth } from '../database/entities/auth';
import { UserWallet } from '../database/entities/user-wallet';
import { Wallet } from '../database/entities/wallet';

const registerGetWalletRegistrationStatus = (fastify: FastifyWithZod) => {
  fastify.get<{ Querystring: GetWalletRegistrationStatusRequest }>(
    '/register/status',
    {
      schema: {
        description: 'Get wallet registration status for authenticated user',
        tags: ['wallets'],
        querystring: GetWalletRegistrationStatusRequestSchema,
        response: {
          200: GetWalletRegistrationStatusResponseSchema,
          401: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { address, publicKey } = request.query;

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
          registered: false,
          walletExists: false,
          userId: auth.userId,
          walletId: null,
        };
      }

      const userWallet = await AppDataSource.getRepository(
        UserWallet,
      ).findOneBy({
        userId: auth.userId,
        walletId: wallet.id,
      });

      return {
        registered: Boolean(userWallet),
        walletExists: true,
        userId: auth.userId,
        walletId: wallet.id,
      };
    },
  );
};

const GetWalletRegistrationStatusRequestSchema = z.object({
  publicKey: z.string().min(1),
  address: z.string().min(1),
});

type GetWalletRegistrationStatusRequest = z.infer<
  typeof GetWalletRegistrationStatusRequestSchema
>;

const GetWalletRegistrationStatusResponseSchema = {
  content: {
    'application/json': {
      schema: z.object({
        registered: z.boolean(),
        walletExists: z.boolean(),
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

export default registerGetWalletRegistrationStatus;
