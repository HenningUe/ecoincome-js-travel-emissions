import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DataSource } from 'typeorm';
import { EmissionsModule } from './modules/emissions/emissions.module';


@Module({
  imports: [
    EmissionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  /**
   * As for NestJs in general, the module container for all emissions-related services, controllers and resources.
   * Related dependencies are defined here and injected accordingly by the framework.
   */
  constructor(private dataSource: DataSource) {    
  }
}
