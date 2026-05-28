import { FastifyWithZod } from '@rosen-bridge/fastify-enhanced';

import registerAuth from './auth';
import registerGetUserWallets from './getUserWallets';
import registerGetWalletRegistrationStatus from './getWalletRegisterationStatus';
import registerHealth from './health';
import registerWallet from './register';
import registerUnregisterWallet from './unregister';
import registerValidateAuth from './validate';

const registerRoutes = async (fastify: FastifyWithZod) => {
  registerHealth(fastify);
  registerAuth(fastify);
  registerValidateAuth(fastify);
  registerWallet(fastify);
  registerGetUserWallets(fastify);
  registerGetWalletRegistrationStatus(fastify);
  registerUnregisterWallet(fastify);
};

export default registerRoutes;
