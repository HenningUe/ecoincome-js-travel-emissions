import "./instrument";

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { NotFoundFilter, SentryCatchAllExceptionFilter } from './app.filter';


/**
 * configures the main application, i.e. sets filters, default paths, etc.
 * In separate file to keep main.ts clean and to ensure that the configuration
 * is used in e2e tests as well.
 * 
 * @param app the application to configure
 */
export function addAppConfig(app: INestApplication) {

  const ver = "0.2.0";
  ver.split(".").forEach((v, i) => {

  });

  // versioning such as https://xxx.xxx/v1/...
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ver[0],
  });
  
  // global prefix for all routes
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

  app.useGlobalFilters(new SentryCatchAllExceptionFilter(), new NotFoundFilter(), );

  const config = new DocumentBuilder()
  .setTitle('Travel CO2 Emission Budget API')
  .setDescription(`Store and manage CO2 emissions caused by (business) travel.
    This is working as demonstration only. Database is presumably empty.
    To test is the emissions-queries add travel records first.`)
  .setVersion(ver)
  .addTag('travel-emissions-co2')
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPath}/docs`, app, documentFactory);
  
  app.useGlobalPipes(new ValidationPipe({transform: true}));
}