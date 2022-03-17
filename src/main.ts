import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app
    .listen(3333)
    .then(() => console.log('App running on port 3333'))
    .catch((error) =>
      console.log(
        `An error happened starting the app on the main file: ${error}`,
      ),
    );
}
bootstrap();
