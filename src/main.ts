import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppValidationPipe } from './common/pipes/validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(AppValidationPipe);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  // ─── Swagger ─────────────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('FoodTech Voting Platform API')
    .setDescription(
      [
        'REST API for managing elections, candidates, voters, and votes.',
        '',
        '**Authentication:** login returns an `accessToken`. Send it on all',
        'protected requests as `Authorization: Bearer <token>`.',
        '',
        '- Voters: POST /auth/login (token expires in 30m)',
        '- Admins: POST /admin-auth/login (token expires in 8h)',
        '',
        'In Swagger UI click **Authorize**, paste the token, then call any endpoint.',
      ].join('\n'),
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Voter authentication — login')
    .addTag('admin-auth', 'Admin authentication — login, create admin')
    .addTag('elections', 'Election lifecycle management')
    .addTag('positions', 'Positions within an election')
    .addTag('candidates', 'Candidates standing for positions')
    .addTag('voters', 'Voter registration & bulk import')
    .addTag('votes', 'Cast and verify votes')
    .addTag('results', 'Live and final election results')
    .addTag('upload', 'File / image uploads via Cloudinary')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
  // ─────────────────────────────────────────────────────────────────────────

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Server running → http://localhost:${port}/api/v1`);
  console.log(`Swagger docs  → http://localhost:${port}/api/docs`);
}
bootstrap();
