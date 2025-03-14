import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const apiPath = 'api';
  app.setGlobalPrefix(apiPath);
  
  // https://medium.com/ayuth/proper-way-to-create-response-dto-in-nest-js-2d58b9e42bf9
  //  exclude properties by default
  // app.useGlobalInterceptors(
  //   new ClassSerializerInterceptor(app.get(Reflector), {
  //     strategy: 'excludeAll',
  //     excludeExtraneousValues: true,
  //   }),
  // );

  const config = new DocumentBuilder()
  .setTitle('Travel CO2 Emission Budget API')
  .setDescription('Store and manage CO2 emissions caused by travels')
  .setVersion('1.0')
  .addTag('travel-emissions-co2')
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPath}/docs`, app, documentFactory);
  
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
