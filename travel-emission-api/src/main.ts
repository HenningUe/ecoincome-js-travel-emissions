import "./instrument";

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { addAppConfig } from "./main.config";
import { ConsoleLogger } from "@nestjs/common";


/**
 * The main entry point of the application (as for all Node.js applications).
 * Relevant code is located in ./modules/..
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: true,
    }),
  });
  addAppConfig(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
