import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: 'https://careparcel.vercel.app',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
