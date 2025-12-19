import 'dotenv/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.use(compression());
  app.setGlobalPrefix('api');

  const rawOrigins = configService.get<string>('app.corsOrigins') ?? '';
  const allowedOrigins = rawOrigins
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const swaggerEnabled =
    configService.get<boolean>('app.enableSwagger') ??
    configService.get<boolean>('ENABLE_SWAGGER') ??
    configService.get<string>('NODE_ENV') !== 'production';


  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Prontuário Médico API')
      .setDescription('Documentação dos endpoints do Prontuário Médico')
      .setVersion('1.0.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header'
      })
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig, {
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey
    });

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true
      }
    });
  }

  const port = configService.get<number>('app.port') ?? 4000;
  await app.listen(port, '0.0.0.0');
  // console.log(`API running on http://localhost:${port}`);
  if (swaggerEnabled) {
    console.log(`Swagger docs available at http://localhost:${port}/docs`);
  }
}

bootstrap();
