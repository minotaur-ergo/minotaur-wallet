import { FastifyWithZod } from '@rosen-bridge/fastify-enhanced';
import z from 'zod';

import { AppDataSource } from '../database/data-source';
import { Auth } from '../database/entities/auth';
import { UserWallet } from '../database/entities/user-wallet';
import { Wallet } from '../database/entities/wallet';

const registerWallet = (fastify: FastifyWithZod) => {
  fastify.post<{ Body: RegisterWalletRequest }>(
    '/register',
    {
      schema: {
        description: 'Register a multi-sig wallet for authenticated user',
        tags: ['wallets'],
        body: RegisterWalletRequestSchema,
        response: {
          200: RegisterWalletResponseSchema,
          401: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { address, name, publicKey, requiredSignatures } = request.body;

      return AppDataSource.transaction(async (manager) => {
        const authRepository = manager.getRepository(Auth);
        const walletRepository = manager.getRepository(Wallet);
        const userWalletRepository = manager.getRepository(UserWallet);

        const auth = await authRepository.findOneBy({ publicKey });

        if (!auth) {
          return reply.code(401).send({
            message: 'user auth is not valid',
          });
        }

        let wallet = await walletRepository.findOneBy({ address });

        if (!wallet) {
          wallet = walletRepository.create({
            address,
            name,
            requiredSignatures,
          });
          wallet = await walletRepository.save(wallet);
        }

        let userWallet = await userWalletRepository.findOneBy({
          userId: auth.userId,
          walletId: wallet.id,
        });

        if (!userWallet) {
          userWallet = userWalletRepository.create({
            userId: auth.userId,
            walletId: wallet.id,
          });
          await userWalletRepository.save(userWallet);
        }

        return {
          registered: true,
          userId: auth.userId,
          wallet: toWalletResponse(wallet),
        };
      });
    },
  );
};

const RegisterWalletRequestSchema = z.object({
  publicKey: z.string().min(1),
  address: z.string().min(1),
  requiredSignatures: z.number().int().positive(),
  name: z.string().optional(),
});

type RegisterWalletRequest = z.infer<typeof RegisterWalletRequestSchema>;

const WalletResponseSchema = z.object({
  id: z.number(),
  address: z.string(),
  requiredSignatures: z.number(),
  name: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const RegisterWalletResponseSchema = {
  content: {
    'application/json': {
      schema: z.object({
        registered: z.boolean(),
        userId: z.number(),
        wallet: WalletResponseSchema,
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

export default registerWallet;
