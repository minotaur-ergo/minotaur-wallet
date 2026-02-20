import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify from 'fastify';

import { AppDataSource } from './database/data-source.js';
import registerRoutes from './routes';

const fastify = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

// Start server
const start = async () => {
  try {
    // Initialize database
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');
    await registerRoutes(fastify);
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
