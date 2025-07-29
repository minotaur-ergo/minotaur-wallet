import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Minotaur API')
    .setDescription('Simple API server with Swagger documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 API Server running on: http://localhost:${port}`);
  console.log(`📚 Swagger UI: http://localhost:${port}/swagger`);
}

bootstrap().then(() => null);
