import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Travel CO2 Emission Budget API')
  .setDescription('Store and manage travel CO2 emissions CO2')
  .setVersion('1.0')
  .addTag('travel-emission-co2')
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
