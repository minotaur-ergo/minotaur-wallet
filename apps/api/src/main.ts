import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify from 'fastify';

import { AppDataSource } from './database/data-source.js';

const fastify = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

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

// Health check route
fastify.get(
  '/health',
  {
    schema: {
      description: 'Health check endpoint',
      tags: ['health'],
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
          },
        },
      },
    },
  },
  async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  },
);

// Start server
const start = async () => {
  try {
    // Initialize database
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');

    // Start server
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('🚀 API Server running on: http://localhost:3001');
    console.log('📚 Swagger UI: http://localhost:3001/swagger');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
