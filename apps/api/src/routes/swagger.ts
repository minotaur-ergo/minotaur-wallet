import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { FastifySeverInstance } from './types';

const registerSwagger = async (fastify: FastifySeverInstance) => {
  // Register Swagger
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Minotaur API ESM',
        description: 'ESM API server with Fastify and TypeORM',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3001',
          description: 'Development server',
        },
      ],
    },
  });

  // Register Swagger UI
  await fastify.register(swaggerUi, {
    routePrefix: '/swagger',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
};

export default registerSwagger;
