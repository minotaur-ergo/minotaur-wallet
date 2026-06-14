import { FastifyWithZod } from '@rosen-bridge/fastify-enhanced';

import registerHealth from './health';

const registerRoutes = async (fastify: FastifyWithZod) => {
  registerHealth(fastify);
};

export default registerRoutes;
