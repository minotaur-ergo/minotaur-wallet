import registerHealth from './health';
import registerSwagger from './swagger';
import { FastifySeverInstance } from './types';

const registerRoutes = async (fastify: FastifySeverInstance) => {
  await registerSwagger(fastify);
  registerHealth(fastify);
};

export default registerRoutes;
